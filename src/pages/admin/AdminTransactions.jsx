import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { api } from '../../lib/api';

const AdminTransactions = () => {
  const [txns, setTxns] = useState([]);
  const [status, setStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState({});

  const load = () => {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (currency) qs.set('currency', currency);
    if (q) qs.set('q', q);
    api.adminTransactions(qs.toString())
      .then(({ data }) => setTxns(data || []))
      .catch((e) => setError(e.message));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status, currency]);

  const updateStatus = async (txnId, newStatus) => {
    setSaving((s) => ({ ...s, [txnId]: true }));
    try {
      await api.adminUpdateTransaction(txnId, { status: newStatus });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving((s) => ({ ...s, [txnId]: false }));
    }
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Transactions</h1>
          <div className="meta">All payment transactions: <strong>pending</strong>, <strong>successful</strong>, <strong>failed</strong>, refunded and cancelled.</div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-toolbar">
        <input
          placeholder="Search txn id, order id, gateway ref or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="">All currencies</option>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <button className="admin-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={load}>
          <Filter size={14} style={{ verticalAlign: '-2px' }} /> Apply
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Gateway Ref</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.txnId}>
                <td>{t.txnId}</td>
                <td>{t.orderId ? <Link to={`/admin/orders/${t.orderId}`}>{t.orderId}</Link> : '—'}</td>
                <td>
                  <div>{t.customerName || '—'}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.customerEmail}</div>
                </td>
                <td>{t.amount} {t.currency}</td>
                <td style={{ fontSize: '0.8rem' }}>{t.gatewayRef || '—'}</td>
                <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(t.createdAt).toLocaleString()}</td>
                <td>
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && updateStatus(t.txnId, e.target.value)}
                    disabled={saving[t.txnId]}
                  >
                    <option value="" disabled>Set status…</option>
                    <option value="pending">pending</option>
                    <option value="success">success</option>
                    <option value="failed">failed</option>
                    <option value="refunded">refunded</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {txns.length === 0 && (
              <tr><td colSpan={8} className="admin-empty">No transactions match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminTransactions;
