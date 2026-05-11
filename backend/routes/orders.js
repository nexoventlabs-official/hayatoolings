const express = require('express');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { generateOrderId, generateTxnId } = require('../utils/ids');

const router = express.Router();

// POST /api/orders
// Creates an order in `pending` state. Used by the frontend before redirecting
// to PayGlocal hosted page (or as the final state for COD).
router.post('/', async (req, res) => {
  try {
    const {
      items,
      shipping,
      currency = 'INR',
      paymentMethod = 'payglocal',
      notes,
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }
    if (!shipping || typeof shipping !== 'object') {
      return res.status(400).json({ error: 'shipping details are required' });
    }
    const required = ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'countryCode'];
    for (const k of required) {
      if (!shipping[k]) return res.status(400).json({ error: `shipping.${k} is required` });
    }
    if (!['INR', 'USD', 'EUR'].includes(currency)) {
      return res.status(400).json({ error: 'currency must be INR, USD, or EUR' });
    }
    if (!['payglocal', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'paymentMethod must be payglocal or cod' });
    }

    // compute totals from server-side, do NOT trust client
    const subtotalInr = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const totalInr = subtotalInr; // shipping/tax can be added here later
    const rate = currency === 'USD'
      ? parseFloat(process.env.INR_TO_USD || '0.012')
      : currency === 'EUR'
        ? parseFloat(process.env.INR_TO_EUR || '0.011')
        : 1;
    const totalDisplay = Math.round(totalInr * rate * 100) / 100;

    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      items: items.map(it => ({
        productId: Number(it.productId ?? it.id),
        name: String(it.name),
        image: it.image,
        price: Number(it.price),
        quantity: Number(it.quantity),
      })),
      subtotalInr,
      totalInr,
      currency,
      exchangeRate: rate,
      totalDisplay,
      shipping,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'placed',
      notes,
    });

    // Create a pending transaction record (for non-COD)
    let txn = null;
    if (paymentMethod === 'payglocal') {
      txn = await Transaction.create({
        txnId: generateTxnId(),
        orderId: order.orderId,
        gateway: 'payglocal',
        paymentButtonId:
          currency === 'USD' ? process.env.PAYGLOCAL_USD_PB_ID :
          currency === 'EUR' ? process.env.PAYGLOCAL_EUR_PB_ID :
          currency === 'INR' ? process.env.PAYGLOCAL_INR_PB_ID : '',
        amount: totalDisplay,
        currency,
        status: 'pending',
        customerEmail: shipping.email,
        customerName: `${shipping.firstName} ${shipping.lastName}`.trim(),
        customerCountry: shipping.country,
        rawRequest: { items, totalInr, totalDisplay },
      });
    }

    res.status(201).json({ data: { order, transaction: txn } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders/:orderId  (public, lightweight; used by track order)
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        currency: order.currency,
        totalDisplay: order.totalDisplay,
        createdAt: order.createdAt,
        items: order.items,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
