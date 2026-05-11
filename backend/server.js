require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');

const metaRouter = require('./routes/meta');
const adminRouter = require('./routes/admin');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const enquiriesRouter = require('./routes/enquiries');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const apiLimiter = rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

app.use('/api/meta', metaRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/enquiries', enquiriesRouter);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = parseInt(process.env.PORT || '5000', 10);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
});
