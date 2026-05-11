import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { api } from '../../lib/api';

const AdminEnquiries = () => {
  const [list, setList] = useState([]);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    const qs = new URLSearchParams();
    if (type) qs.set('type', type);
    if (status) qs.set('status', status);
    if (q) qs.set('q', q);
    api.adminEnquiries(qs.toString())
      .then(({ data }) => setList(data || []))
      .catch((e) => setError(e.message));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [type, status]);

  const updateStatus = async (id, s) => {
    try { await api.adminUpdateEnquiry(id, { status: s }); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Enquiries</h1>
          <div className="meta">Quote requests and contact form messages.</div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-toolbar">
        <input
          placeholder="Search name, email, message…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="quote">Quote</option>
          <option value="contact">Contact</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button className="admin-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={load}>
          <Filter size={14} style={{ verticalAlign: '-2px' }} /> Apply
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject / Message</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e._id}>
                <td><span className="badge new" style={{ background: '#e2e8f0', color: '#0f172a' }}>{e.type}</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{e.name}</div>
                  {e.company && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{e.company}</div>}
                </td>
                <td>{e.email}</td>
                <td>{e.phone || '—'}</td>
                <td>
                  {e.subject && <div style={{ fontWeight: 600 }}>{e.subject}</div>}
                  <div style={{ maxWidth: 380, fontSize: '0.85rem', color: '#475569', whiteSpace: 'pre-wrap' }}>{e.message}</div>
                </td>
                <td><span className={`badge ${e.status}`}>{e.status}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(e.createdAt).toLocaleString()}</td>
                <td>
                  <select defaultValue="" onChange={(ev) => ev.target.value && updateStatus(e._id, ev.target.value)}>
                    <option value="" disabled>Set status…</option>
                    <option value="new">new</option>
                    <option value="in_progress">in_progress</option>
                    <option value="resolved">resolved</option>
                  </select>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={8} className="admin-empty">No enquiries match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminEnquiries;
