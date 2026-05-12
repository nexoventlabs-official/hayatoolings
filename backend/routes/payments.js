const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { verifyToken, mapStatus, verifyRsaSignature } = require('../utils/payglocal');

const router = express.Router();

// Compare a gateway-reported amount/currency against the order. Returns a
// human-readable mismatch reason, or null when the values agree (or when the
// gateway didn't tell us an amount, in which case we trust the status).
function checkAmountMatch(order, paidAmount, paidCurrency) {
  if (paidAmount == null || paidAmount === '') return null; // nothing to compare
  const paid = Number(paidAmount);
  if (!Number.isFinite(paid)) return `invalid_amount:${paidAmount}`;

  const expected = Number(order.totalDisplay);
  // Allow a 1-unit (or 1%) rounding tolerance — some gateways round half-up.
  const tolerance = Math.max(1, expected * 0.01);
  if (Math.abs(paid - expected) > tolerance) {
    return `amount_mismatch:paid=${paid} expected=${expected} ${order.currency}`;
  }
  if (paidCurrency && String(paidCurrency).toUpperCase() !== order.currency) {
    return `currency_mismatch:paid=${paidCurrency} expected=${order.currency}`;
  }
  return null;
}

// Apply a status update to both the Transaction and the Order in one place.
//
// Defense-in-depth: if the gateway reports `success` but the amount/currency
// disagrees with what the order was created for, we OVERRIDE the status to
// `failed` and record the mismatch as the failure reason. This prevents the
// classic "₹1,25,000 cart marked paid for ₹1" attack.
async function applyStatus({ orderId, status, gatewayRef, failureReason, amount, currency, source, raw }) {
  if (!orderId) return null;
  const order = await Order.findOne({ orderId });
  if (!order) return null;

  let finalStatus = status;
  let finalReason = failureReason;
  if (finalStatus === 'success') {
    const mismatch = checkAmountMatch(order, amount, currency);
    if (mismatch) {
      console.warn(`[payglocal] order ${orderId} success rejected: ${mismatch}`);
      finalStatus = 'failed';
      finalReason = mismatch;
    }
  }

  const txn = await Transaction.findOneAndUpdate(
    { orderId },
    {
      status: finalStatus,
      ...(gatewayRef ? { gatewayRef } : {}),
      ...(finalReason ? { failureReason: finalReason } : {}),
      rawResponse: { source, body: raw },
    },
    { new: true, sort: { createdAt: -1 } }
  );

  order.paymentStatus = finalStatus;
  if (finalStatus === 'success') order.orderStatus = 'confirmed';
  if (gatewayRef) order.transactionRef = gatewayRef;
  await order.save();

  return { txn, order, mismatch: finalStatus !== status ? finalReason : null };
}

/**
 * Frontend calls this to fetch the PayGlocal Simple-Pay button id for the
 * selected currency. The actual <script src="oneclick.payglocal.in/simple.js"
 * data-pb-id="..."> embed is rendered in the React component.
 */
router.get('/payglocal/button', (req, res) => {
  const currency = String(req.query.currency || 'USD').toUpperCase();
  const pbId =
    currency === 'EUR' ? process.env.PAYGLOCAL_EUR_PB_ID :
    currency === 'USD' ? process.env.PAYGLOCAL_USD_PB_ID :
    currency === 'INR' ? process.env.PAYGLOCAL_INR_PB_ID :
    '';
  if (!pbId) return res.status(400).json({ error: `No PayGlocal button configured for ${currency}` });
  res.json({
    data: {
      currency,
      paymentButtonId: pbId,
      scriptSrc: 'https://oneclick.payglocal.in/simple.js',
    },
  });
});

/**
 * Soft status update from the frontend "thank you" page after the user is
 * redirected back from PayGlocal. The frontend forwards whatever query / body
 * params it received (e.g. `token`, `status`, `merchantOrderId`, `gid`).
 *
 * If a JWT/JWS is present (`token`), it is verified against PayGlocal's
 * public key (utils/payglocal.js).
 */
router.post('/payglocal/return', async (req, res) => {
  try {
    const body = req.body || {};
    let payload = { ...body };

    // If PayGlocal sent a signed token, decode and merge its claims.
    if (body.token) {
      const decoded = verifyToken(body.token);
      if (decoded && typeof decoded === 'object') payload = { ...payload, ...decoded };
    }

    const orderId =
      payload.orderId || payload.merchantOrderId || payload.merchantTransactionId ||
      (body.data && (body.data.orderId || body.data.merchantOrderId));
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const status = mapStatus(payload.status || body.status);
    const gatewayRef = payload.gid || payload.transactionId || body.gatewayRef;
    const failureReason = payload.failureReason || payload.errorMessage;
    const amount = payload.amount ?? body.amount ?? (body.data && body.data.amount);
    const currency = payload.currency ?? body.currency ?? (body.data && body.data.currency);

    const result = await applyStatus({ orderId, status, gatewayRef, failureReason, amount, currency, source: 'return_url', raw: body });
    if (!result) return res.status(404).json({ error: 'Order not found' });
    res.json({ data: { order: result.order, transaction: result.txn } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET variant for PayGlocal's hosted-page redirect. PayGlocal can be
 * configured (on the dashboard) to redirect to a backend URL with status
 * params appended. We accept any of:
 *
 *   ?orderId=ORD-XXX&status=success&gid=GID123
 *   ?token=<JWS-signed-by-PayGlocal>
 *
 * After processing, the user is redirected to the storefront's
 * `/order/:orderId` page with the resolved status.
 */
router.get('/payglocal/return', async (req, res) => {
  try {
    const q = req.query || {};
    let payload = { ...q };
    if (q.token) {
      const decoded = verifyToken(q.token);
      if (decoded && typeof decoded === 'object') payload = { ...payload, ...decoded };
    }
    const orderId = payload.orderId || payload.merchantOrderId || payload.merchantTransactionId;
    const status = mapStatus(payload.status);
    const gatewayRef = payload.gid || payload.transactionId;
    const amount = payload.amount;
    const currency = payload.currency;

    if (orderId) {
      await applyStatus({ orderId, status, gatewayRef, amount, currency, source: 'return_url_get', raw: q });
    }

    const front = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const target = orderId
      ? `${front}/order/${encodeURIComponent(orderId)}?status=${status}`
      : `${front}/checkout`;
    res.redirect(302, target);
  } catch (err) {
    const front = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    res.redirect(302, `${front}/checkout?error=${encodeURIComponent(err.message)}`);
  }
});

/**
 * Webhook receiver for PayGlocal server-to-server notifications.
 * Configure the webhook URL on the PayGlocal dashboard, e.g.:
 *   https://<your-backend>/api/payments/payglocal/webhook
 *
 * If a signing secret is set, this endpoint validates the HMAC-SHA256 signature
 * present in the `x-payglocal-signature` header.
 */
router.post('/payglocal/webhook', async (req, res) => {
  try {
    const body = req.body || {};
    const rawJson = JSON.stringify(body);

    // Validate either an HMAC signature (when a webhook secret is configured)
    // or an RSA signature (using PayGlocal's public key).
    const secret = process.env.PAYGLOCAL_WEBHOOK_SECRET;
    const hmacHeader = req.headers['x-payglocal-signature'] || req.headers['x-pg-signature'];
    const rsaHeader = req.headers['x-payglocal-rsa-signature'];

    if (secret) {
      const expected = crypto.createHmac('sha256', secret).update(rawJson).digest('hex');
      if (!hmacHeader || hmacHeader !== expected) {
        console.warn('[payglocal] webhook HMAC mismatch');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else if (rsaHeader) {
      if (!verifyRsaSignature(rawJson, rsaHeader)) {
        console.warn('[payglocal] webhook RSA mismatch');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }
    // If neither signature is present, accept the body as-is (dev / no-webhook setups).

    let payload = body;
    if (body.token) {
      const decoded = verifyToken(body.token);
      if (decoded && typeof decoded === 'object') payload = { ...body, ...decoded };
    }

    const orderId =
      payload.orderId || payload.merchantOrderId || payload.merchantTransactionId ||
      (payload.data && (payload.data.orderId || payload.data.merchantOrderId));
    const gatewayRef = payload.gid || payload.transactionId ||
      (payload.data && (payload.data.gid || payload.data.transactionId));
    const status = mapStatus(payload.status || (payload.data && payload.data.status));
    const amount = payload.amount ?? (payload.data && payload.data.amount);
    const currency = payload.currency ?? (payload.data && payload.data.currency);

    if (orderId) {
      await applyStatus({ orderId, status, gatewayRef, amount, currency, source: 'webhook', raw: body });
    } else {
      console.warn('[payglocal] webhook received without orderId', body);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('[payglocal] webhook error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
