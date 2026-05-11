// Quick smoke test against the running backend.
// Run with: node smoketest.js
const BASE = 'http://localhost:5000';

async function main() {
  console.log('--- /api/health');
  console.log(await (await fetch(`${BASE}/api/health`)).json());

  console.log('\n--- /api/meta/config');
  const cfg = await (await fetch(`${BASE}/api/meta/config`)).json();
  console.log(cfg);

  console.log('\n--- /api/meta/countries (count)');
  const c = await (await fetch(`${BASE}/api/meta/countries`)).json();
  console.log({ count: (c.data || []).length, sample: (c.data || []).slice(0, 3) });

  console.log('\n--- POST /api/admin/login');
  const login = await (await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@hayatoolings.com', password: 'Admin@12345' }),
  })).json();
  const token = login.data && login.data.token;
  console.log({ ok: !!token, admin: login.data && login.data.admin });

  console.log('\n--- POST /api/orders (USD)');
  const orderRes = await (await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 1, name: 'Test Product', price: 1000, quantity: 2 }],
      shipping: {
        firstName: 'Test', lastName: 'User', email: 't@example.com', phone: '+919999999999',
        addressLine1: '1 Test St', city: 'Bangalore', state: 'KA',
        postalCode: '560001', country: 'India', countryCode: 'IN',
      },
      currency: 'USD',
      paymentMethod: 'payglocal',
    }),
  })).json();
  console.log(orderRes);

  console.log('\n--- GET /api/admin/transactions (auth)');
  const txns = await (await fetch(`${BASE}/api/admin/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  })).json();
  console.log({ count: (txns.data || []).length, latest: (txns.data || [])[0] });

  console.log('\n--- POST /api/payments/payglocal/return (simulate webhook-less success)');
  const orderId = orderRes.data && orderRes.data.order && orderRes.data.order.orderId;
  const ret = await (await fetch(`${BASE}/api/payments/payglocal/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, status: 'success', gatewayRef: 'GID-TEST-123' }),
  })).json();
  console.log({ paymentStatus: ret.data && ret.data.order && ret.data.order.paymentStatus,
                txnStatus: ret.data && ret.data.transaction && ret.data.transaction.status });

  console.log('\n--- POST /api/enquiries (quote)');
  const enq = await (await fetch(`${BASE}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'quote', name: 'Test', email: 't@example.com', message: 'Hello' }),
  })).json();
  console.log({ id: enq.data && enq.data._id, type: enq.data && enq.data.type });
}

main().catch((e) => { console.error(e); process.exit(1); });
