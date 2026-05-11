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

// Render / Vercel sit behind a proxy. Trust it so express-rate-limit
// and `req.ip` see the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);

// --- CORS ---
// FRONTEND_URL accepts a single URL or a comma-separated list of URLs.
// All of these are allowed: every URL in FRONTEND_URL, any *.vercel.app
// preview deployment, the production custom domain hayatoolings.online
// (and any subdomain of it), plus local dev origins.
const FRONTEND_URLS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const STATIC_ALLOWED = new Set(
  [
    ...FRONTEND_URLS,
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
  ].map((s) => s.replace(/\/$/, ''))
);

// Hostnames whose origin (with any scheme) is always allowed.
const ALLOWED_HOST_SUFFIXES = ['.vercel.app', '.hayatoolings.online'];
const ALLOWED_HOSTS = ['hayatoolings.online', 'localhost', '127.0.0.1'];

function isOriginAllowed(origin) {
  if (!origin) return true; // server-to-server / curl
  const cleaned = origin.replace(/\/$/, '');
  if (STATIC_ALLOWED.has(cleaned)) return true;
  try {
    const host = new URL(cleaned).hostname;
    if (ALLOWED_HOSTS.includes(host)) return true;
    if (ALLOWED_HOST_SUFFIXES.some((s) => host.endsWith(s))) return true;
  } catch (_) { /* invalid origin */ }
  return false;
}

const corsOptions = {
  origin: (origin, cb) => {
    if (isOriginAllowed(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
// Explicitly handle preflight for every route so a slow / errored
// downstream handler can never strip the CORS headers.
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Rate limit `/api`, but never count preflight requests.
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});
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
