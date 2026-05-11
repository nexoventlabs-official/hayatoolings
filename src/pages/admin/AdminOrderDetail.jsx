import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '../../lib/api';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [txns, setTxns] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const load = () => {
    api.adminOrder(orderId)
      .then(({ data }) => {
        setOrder(data.order);
        setTxns(data.transactions || []);
        setOrderStatus(data.order.orderStatus);
        setPaymentStatus(data.order.paymentStatus);
      })
      .catch((e) => setError(e.message || 'Failed to load'));
  };

  useEffect(load, [orderId]);

  const save = async () => {
    setSaving(true);
    try {
      await api.adminUpdateOrder(orderId, { orderStatus, paymentStatus });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return (
      <>
        <div className="admin-header">
          <h1>Order {orderId}</h1>
        </div>
        {error ? <div className="admin-error">{error}</div> : <div>Loading...</div>}
      </>
    );
  }

  const s = order.shipping;
  const sym = order.currency === 'USD' ? '$' : order.currency === 'EUR' ? '€' : '₹';

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Order {order.orderId}</h1>
          <div className="meta">
            <Link to="/admin/orders" style={{ color: '#2563eb' }}><ArrowLeft size={12} /> All orders</Link>
            {' · '}Created {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-detail-grid">
        <div>
          <div className="admin-card admin-card-pad" style={{ marginBottom: '1.25rem' }}>
            <h3>Items ({order.items.length})</h3>
            <table className="admin-items-table">
              <thead>
                <tr><th>Product</th><th>Qty</th><th style={{ textAlign: 'right' }}>Unit (INR)</th><th style={{ textAlign: 'right' }}>Line (INR)</th></tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.productId}>
                    <td>{it.name}</td>
                    <td>{it.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₹{it.price}</td>
                    <td style={{ textAlign: 'right' }}>₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total ({order.currency})</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{sym}{order.totalDisplay}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', color: '#64748b', fontSize: '0.8rem' }}>Total in INR</td>
                  <td style={{ textAlign: 'right', color: '#64748b', fontSize: '0.8rem' }}>₹{order.totalInr}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="admin-card admin-card-pad">
            <h3>Transactions</h3>
            <div className="admin-table-wrap" style={{ border: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Txn</th><th>Gateway Ref</th><th>Amount</th><th>Status</th><th>Created</th></tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.txnId}>
                      <td>{t.txnId}</td>
                      <td>{t.gatewayRef || '—'}</td>
                      <td>{t.amount} {t.currency}</td>
                      <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {txns.length === 0 && <tr><td colSpan={5} className="admin-empty">No transactions</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="admin-card admin-card-pad" style={{ marginBottom: '1.25rem' }}>
            <h3>Status</h3>
            <div className="admin-update-row">
              <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Order</label>
              <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="admin-update-row">
              <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Payment</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="admin-update-row">
              <button onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>

          <div className="admin-card admin-card-pad" style={{ marginBottom: '1.25rem' }}>
            <h3>Customer & Shipping</h3>
            <dl className="admin-kv">
              <dt>Name</dt><dd>{s.firstName} {s.lastName}</dd>
              <dt>Email</dt><dd>{s.email}</dd>
              <dt>Phone</dt><dd>{s.phone}</dd>
              <dt>Address</dt><dd>{s.addressLine1}{s.addressLine2 ? `, ${s.addressLine2}` : ''}</dd>
              <dt>City</dt><dd>{s.city}</dd>
              <dt>State</dt><dd>{s.state}</dd>
              <dt>Postal Code</dt><dd>{s.postalCode}</dd>
              <dt>Country</dt><dd>{s.country} ({s.countryCode})</dd>
              {s.notes && (<><dt>Notes</dt><dd>{s.notes}</dd></>)}
            </dl>
          </div>

          <div className="admin-card admin-card-pad">
            <h3>Payment</h3>
            <dl className="admin-kv">
              <dt>Method</dt><dd>{order.paymentMethod}</dd>
              <dt>Currency</dt><dd>{order.currency}</dd>
              <dt>Total</dt><dd>{sym}{order.totalDisplay}</dd>
              <dt>FX rate</dt><dd>1 INR = {order.exchangeRate}</dd>
              {order.transactionRef && (<><dt>Gateway Ref</dt><dd>{order.transactionRef}</dd></>)}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetail;
