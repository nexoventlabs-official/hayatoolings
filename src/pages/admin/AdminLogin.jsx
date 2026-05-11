import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Wrench } from 'lucide-react';
import { api, auth } from '../../lib/api';
import './admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hayatoolings.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.getToken()) navigate('/admin', { replace: true });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.adminLogin(email, password);
      auth.setToken(data.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-brand" style={{ color: '#0f172a', marginBottom: '1rem' }}>
          <Wrench size={20} />
          <span><span className="accent">HAYA</span> ADMIN</span>
        </div>
        <h2>Welcome back</h2>
        <p>Sign in to manage orders and transactions.</p>
        {error && <div className="admin-error">{error}</div>}
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="admin-btn" disabled={loading}>
          <LogIn size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
