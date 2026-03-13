import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ institution_name:'', email:'', password:'', confirm_password:'' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      setSuccess(res.data.message + ' Redirecting to login…');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.top}>
          <div style={S.icon}>🏛️</div>
          <h2 style={S.title}>Register Your Institution</h2>
          <p style={S.sub}>Create an admin account to get started with EduSafeGuard</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit} autoComplete="off">
          <div className="form-group">
            <label className="form-label">Institution Name</label>
            <input className="form-input" placeholder="e.g. ABC Engineering College"
              name="institution_name" autoComplete="off"
              value={form.institution_name} onChange={set('institution_name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input type="email" className="form-input" placeholder="admin@college.edu"
              name="email" autoComplete="off"
              value={form.email} onChange={set('email')} required />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min. 6 chars"
                name="password" autoComplete="new-password"
                value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" placeholder="Repeat"
                name="confirm_password" autoComplete="new-password"
                value={form.confirm_password} onChange={set('confirm_password')} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:12 }} disabled={loading}>
            {loading ? 'Registering…' : 'Create Admin Account →'}
          </button>
        </form>

        <div style={{ marginTop:18, textAlign:'center', fontSize:13, color:'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ color:'var(--primary)', fontWeight:600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  card: { background:'#fff', borderRadius:18, padding:36, width:480, maxWidth:'100%', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' },
  top:  { textAlign:'center', marginBottom:24 },
  icon: { fontSize:40, marginBottom:10 },
  title:{ fontSize:21, fontWeight:800 },
  sub:  { fontSize:13.5, color:'var(--text-muted)', marginTop:5, lineHeight:1.6 },
};
