import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.adminStats(), api.adminOrders(), api.adminTransactions()])
      .then(([s, o, t]) => {
        setStats(s.data);
        setRecentOrders((o.data || []).slice(0, 5));
        setRecentTxns((t.data || []).slice(0, 5));
      })
      .catch((e) => setError(e.message || 'Failed to load'));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <div className="meta">Overview of orders, transactions and enquiries.</div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats ? stats.orders : '—'}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Successful Payments</div>
          <div className="stat-value">{stats ? stats.transactionsByStatus.success : '—'}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-label">Pending Payments</div>
          <div className="stat-value">{stats ? stats.transactionsByStatus.pending : '—'}</div>
        </div>
        <div className="stat-card fail">
          <div className="stat-label">Failed Payments</div>
          <div className="stat-value">{stats ? stats.transactionsByStatus.failed : '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue (INR base)</div>
          <div className="stat-value">{stats ? fmtINR(stats.revenueInr) : '—'}</div>
          <div className="stat-sub">Sum of orders with successful payment</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Enquiries</div>
          <div className="stat-value">{stats ? stats.enquiries : '—'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="admin-card">
          <div className="admin-card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: '#2563eb' }}>View all →</Link>
          </div>
          <div className="admin-table-wrap" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderBottom: 0 }}>
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td><Link to={`/admin/orders/${o.orderId}`}>{o.orderId}</Link></td>
                    <td>{o.shipping.firstName} {o.shipping.lastName}</td>
                    <td>{o.totalDisplay} {o.currency}</td>
                    <td><span className={`badge ${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan={4} className="admin-empty">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
            <Link to="/admin/transactions" style={{ fontSize: '0.85rem', color: '#2563eb' }}>View all →</Link>
          </div>
          <div className="admin-table-wrap" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderBottom: 0 }}>
            <table className="admin-table">
              <thead><tr><th>Txn</th><th>Order</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentTxns.map((t) => (
                  <tr key={t.txnId}>
                    <td>{t.txnId}</td>
                    <td><Link to={`/admin/orders/${t.orderId}`}>{t.orderId}</Link></td>
                    <td>{t.amount} {t.currency}</td>
                    <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                  </tr>
                ))}
                {recentTxns.length === 0 && <tr><td colSpan={4} className="admin-empty">No transactions yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
