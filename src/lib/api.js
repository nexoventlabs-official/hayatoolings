// Lightweight fetch wrapper for the Haya Toolings backend.
// The base URL can be overridden via `VITE_API_BASE` at build time.

let RAW_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000';
// Strip trailing slash AND a trailing "/api" if the operator accidentally
// included it (our request paths already start with "/api/...").
RAW_BASE = RAW_BASE.replace(/\/$/, '').replace(/\/api$/, '');
// The deployed Render service is `hayatoolings.onrender.com`, not
// `hayatoolings-backend.onrender.com`. Auto-correct the common typo so
// production keeps working even if VITE_API_BASE is misconfigured.
RAW_BASE = RAW_BASE.replace(
  /\/\/hayatoolings-backend\.onrender\.com/,
  '//hayatoolings.onrender.com'
);
export const API_BASE = RAW_BASE;

const TOKEN_KEY = 'ht_admin_token';

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body, authed = false, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  if (authed) {
    const token = auth.getToken();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  let payload = null;
  try { payload = await res.json(); } catch (_) {}
  if (!res.ok) {
    const msg = (payload && (payload.error || payload.message)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

export const api = {
  // Public
  health: () => request('/api/health'),
  getCountries: () => request('/api/meta/countries'),
  getConfig: () => request('/api/meta/config'),
  createOrder: (data) => request('/api/orders', { method: 'POST', body: data }),
  getOrder: (orderId) => request(`/api/orders/${encodeURIComponent(orderId)}`),
  getPaygButton: (currency) => request(`/api/payments/payglocal/button?currency=${currency}`),
  postReturn: (data) => request('/api/payments/payglocal/return', { method: 'POST', body: data }),
  submitEnquiry: (data) => request('/api/enquiries', { method: 'POST', body: data }),

  // Admin
  adminLogin: (email, password) => request('/api/admin/login', { method: 'POST', body: { email, password } }),
  adminMe: () => request('/api/admin/me', { authed: true }),
  adminStats: () => request('/api/admin/stats', { authed: true }),
  adminOrders: (qs = '') => request(`/api/admin/orders${qs ? `?${qs}` : ''}`, { authed: true }),
  adminOrder: (orderId) => request(`/api/admin/orders/${encodeURIComponent(orderId)}`, { authed: true }),
  adminUpdateOrder: (orderId, data) => request(`/api/admin/orders/${encodeURIComponent(orderId)}`, { method: 'PATCH', body: data, authed: true }),
  adminTransactions: (qs = '') => request(`/api/admin/transactions${qs ? `?${qs}` : ''}`, { authed: true }),
  adminUpdateTransaction: (txnId, data) => request(`/api/admin/transactions/${encodeURIComponent(txnId)}`, { method: 'PATCH', body: data, authed: true }),
  adminEnquiries: (qs = '') => request(`/api/admin/enquiries${qs ? `?${qs}` : ''}`, { authed: true }),
  adminUpdateEnquiry: (id, data) => request(`/api/admin/enquiries/${encodeURIComponent(id)}`, { method: 'PATCH', body: data, authed: true }),
};
