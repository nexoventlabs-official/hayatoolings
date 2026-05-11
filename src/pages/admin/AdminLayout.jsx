import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, CreditCard, MessageSquare, LogOut, Wrench,
} from 'lucide-react';
import { api, auth } from '../../lib/api';
import './admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!auth.getToken()) {
      navigate('/admin/login', { replace: true });
      return;
    }
    api.adminMe()
      .then(({ data }) => { setMe(data); setChecked(true); })
      .catch(() => {
        auth.clear();
        navigate('/admin/login', { replace: true });
      });
  }, [navigate]);

  const logout = () => {
    auth.clear();
    navigate('/admin/login', { replace: true });
  };

  if (!checked) {
    return <div className="admin-login"><div style={{ color: '#fff' }}>Loading...</div></div>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Wrench size={20} />
          <span><span className="accent">HAYA</span> ADMIN</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/admin/orders">
            <ShoppingBag size={16} /> Orders
          </NavLink>
          <NavLink to="/admin/transactions">
            <CreditCard size={16} /> Transactions
          </NavLink>
          <NavLink to="/admin/enquiries">
            <MessageSquare size={16} /> Enquiries
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          {me && <>Signed in as <strong>{me.email}</strong></>}
          <button onClick={logout}><LogOut size={14} /> Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
