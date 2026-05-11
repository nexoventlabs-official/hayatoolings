const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Enquiry = require('../models/Enquiry');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const admin = await Admin.findOne({ email: String(email).toLowerCase() });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await admin.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email, role: admin.role, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      data: {
        token,
        admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/me
router.get('/me', authRequired, (req, res) => {
  res.json({ data: req.admin });
});

// GET /api/admin/stats
router.get('/stats', authRequired, async (_req, res) => {
  try {
    const [orders, txnAgg, enquiries, txnSuccess, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Transaction.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Enquiry.countDocuments(),
      Transaction.countDocuments({ status: 'success' }),
      Order.aggregate([
        { $match: { paymentStatus: 'success' } },
        { $group: { _id: null, totalInr: { $sum: '$totalInr' } } },
      ]),
    ]);

    const txnByStatus = txnAgg.reduce((acc, x) => ({ ...acc, [x._id]: x.count }), {});
    res.json({
      data: {
        orders,
        enquiries,
        transactionsTotal: Object.values(txnByStatus).reduce((a, b) => a + b, 0),
        transactionsByStatus: {
          pending: txnByStatus.pending || 0,
          success: txnByStatus.success || 0,
          failed: txnByStatus.failed || 0,
          refunded: txnByStatus.refunded || 0,
          cancelled: txnByStatus.cancelled || 0,
        },
        successfulTransactions: txnSuccess,
        revenueInr: (revenueAgg[0] && revenueAgg[0].totalInr) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Orders management (admin) ---
router.get('/orders', authRequired, async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (q) {
      filter.$or = [
        { orderId: new RegExp(q, 'i') },
        { 'shipping.email': new RegExp(q, 'i') },
        { 'shipping.firstName': new RegExp(q, 'i') },
        { 'shipping.lastName': new RegExp(q, 'i') },
      ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:orderId', authRequired, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const txns = await Transaction.find({ orderId: order.orderId }).sort({ createdAt: -1 });
    res.json({ data: { order, transactions: txns } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/orders/:orderId', authRequired, async (req, res) => {
  try {
    const allowed = ['orderStatus', 'paymentStatus', 'notes'];
    const update = {};
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ data: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Transactions management ---
router.get('/transactions', authRequired, async (req, res) => {
  try {
    const { status, currency, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (currency) filter.currency = currency;
    if (q) {
      filter.$or = [
        { txnId: new RegExp(q, 'i') },
        { orderId: new RegExp(q, 'i') },
        { gatewayRef: new RegExp(q, 'i') },
        { customerEmail: new RegExp(q, 'i') },
      ];
    }
    const txns = await Transaction.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ data: txns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/transactions/:txnId', authRequired, async (req, res) => {
  try {
    const allowed = ['status', 'gatewayRef', 'failureReason'];
    const update = {};
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    const txn = await Transaction.findOneAndUpdate({ txnId: req.params.txnId }, update, { new: true });
    if (!txn) return res.status(404).json({ error: 'Transaction not found' });
    // sync the order paymentStatus with the txn status
    if (update.status && txn.orderId) {
      await Order.findOneAndUpdate({ orderId: txn.orderId }, { paymentStatus: update.status });
    }
    res.json({ data: txn });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Enquiries management ---
router.get('/enquiries', authRequired, async (req, res) => {
  try {
    const { type, status, q } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { message: new RegExp(q, 'i') },
        { subject: new RegExp(q, 'i') },
      ];
    }
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ data: enquiries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/enquiries/:id', authRequired, async (req, res) => {
  try {
    const allowed = ['status'];
    const update = {};
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    const enq = await Enquiry.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!enq) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ data: enq });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
