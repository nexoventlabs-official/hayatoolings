import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { api } from '../../lib/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (q) qs.set('q', q);
    api.adminOrders(qs.toString())
      .then(({ data }) => setOrders(data || []))
      .catch((e) => setError(e.message || 'Failed to load'));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <div className="meta">All orders placed by customers, including their full transaction details.</div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
          <input
            placeholder="Search by order id, name or email"
            value={q}
            style={{ paddingLeft: 30 }}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All order statuses</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="admin-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={load}>
          <Filter size={14} style={{ verticalAlign: '-2px' }} /> Apply
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Country</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td><Link to={`/admin/orders/${o.orderId}`}>{o.orderId}</Link></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.shipping.firstName} {o.shipping.lastName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{o.shipping.email}</div>
                </td>
                <td>{o.shipping.country} ({o.shipping.countryCode})</td>
                <td>{o.items.length}</td>
                <td>{o.totalDisplay} {o.currency}</td>
                <td><span className={`badge ${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                <td><span className={`badge ${o.orderStatus}`}>{o.orderStatus}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="admin-empty">No orders match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminOrders;
