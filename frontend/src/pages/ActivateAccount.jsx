import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function ActivateAccount() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState(null);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    if (password !== confirm) return setMsg({ type:'error', text:'Passwords do not match.' });
    if (password.length < 6)  return setMsg({ type:'error', text:'Password must be at least 6 characters.' });
    setLoading(true);
    try {
      const res = await API.post('/auth/activate', { email, password, confirm_password: confirm });
      setMsg({ type:'success', text: res.data.message + ' Redirecting to login…' });
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.error || 'Activation failed.' });
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.top}>
          <div style={{ fontSize:44, marginBottom:10 }}>🔑</div>
          <h2 style={S.title}>Activate Your Account</h2>
          <p style={S.sub}>
            Your administrator has added you as a counsellor.<br />
            Enter your email and set a new password to activate.
          </p>
        </div>

        {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        <form onSubmit={submit} autoComplete="off">
          <div className="form-group">
            <label className="form-label">Your Email Address</label>
            <input type="email" className="form-input" placeholder="your@email.com"
              name="email" autoComplete="off"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" placeholder="Minimum 6 characters"
              name="password" autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-input" placeholder="Repeat your password"
              name="confirm_password" autoComplete="new-password"
              value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:12 }} disabled={loading}>
            {loading ? 'Activating…' : 'Activate Account →'}
          </button>
        </form>

        <div style={{ marginTop:18, textAlign:'center', fontSize:13, color:'var(--text-muted)' }}>
          Already activated?{' '}
          <Link to="/login" style={{ color:'var(--primary)', fontWeight:600 }}>Sign in here</Link>
        </div>

        <div style={S.hint}>
          ℹ️ Your admin must first add your email to the system before you can activate.
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  card: { background:'#fff', borderRadius:18, padding:36, width:440, maxWidth:'100%', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' },
  top:  { textAlign:'center', marginBottom:24 },
  title:{ fontSize:21, fontWeight:800 },
  sub:  { fontSize:13.5, color:'var(--text-muted)', marginTop:5, lineHeight:1.65 },
  hint: { marginTop:18, padding:'10px 14px', background:'var(--surface2)', borderRadius:8, fontSize:12.5, color:'var(--text-muted)', lineHeight:1.6 },
};
