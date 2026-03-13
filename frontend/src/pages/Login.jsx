import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [role,     setRole]     = useState('admin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/counsellor');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      {/* Left panel */}
      <div style={S.left}>
        <div style={S.leftInner}>
          <div style={S.brandRow}>
            <div style={S.brandIcon}>E</div>
            <span style={S.brandName}>EduSafe<span style={{ color:'#93c5fd' }}>Guard</span></span>
          </div>
          <h1 style={S.headline}>Student Retention &amp; Success Platform</h1>
          <p style={S.tagline}>
            Identify at-risk students early. Assign counsellors. Track progress. Save academic careers.
          </p>
          <div style={S.feats}>
            {['📊 Real-time risk classification', '📁 Bulk CSV student import',
              '🤝 Counsellor assignment workflow', '🤖 AI-powered improvement suggestions',
              '📝 Follow-up note tracking'].map(f => (
              <div key={f} style={S.feat}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={S.right}>
        <div style={S.card}>
          <div style={S.cardTop}>
            <h2 style={S.cardTitle}>Sign In</h2>
            <p style={S.cardSub}>Select your role and enter credentials</p>
          </div>

          {/* Role selector */}
          <div style={S.roleRow}>
            {['admin', 'counsellor'].map(r => (
              <button key={r} type="button"
                style={{ ...S.roleBtn, ...(role === r ? S.roleBtnActive : {}) }}
                onClick={() => setRole(r)}>
                <span style={{ fontSize: 18 }}>{r === 'admin' ? '🏛️' : '👤'}</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{r}</span>
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="your@email.com"
                name="email" autoComplete="off"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••"
                name="password" autoComplete="new-password"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'12px' }} disabled={loading}>
              {loading ? 'Signing in…' : `Sign In as ${role === 'admin' ? 'Admin' : 'Counsellor'} →`}
            </button>
          </form>

          <div style={S.divider}><span>or</span></div>

          <Link to="/activate" className="btn btn-ghost"
            style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
            🔑 Activate Counsellor Account
          </Link>

          <div style={S.footer}>
            New institution?{' '}
            <Link to="/register" style={{ color:'var(--primary)', fontWeight:600 }}>Register as Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page:   { display:'flex', minHeight:'100vh' },
  left:   { flex:1, background:'linear-gradient(150deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:48 },
  leftInner: { maxWidth:430, color:'#fff' },
  brandRow:  { display:'flex', alignItems:'center', gap:10, marginBottom:36 },
  brandIcon: { width:44, height:44, background:'rgba(255,255,255,.15)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:22 },
  brandName: { fontWeight:800, fontSize:22 },
  headline:  { fontSize:30, fontWeight:800, lineHeight:1.3, marginBottom:14 },
  tagline:   { fontSize:15.5, opacity:.8, lineHeight:1.75, marginBottom:32 },
  feats:     { display:'flex', flexDirection:'column', gap:9 },
  feat:      { padding:'9px 15px', background:'rgba(255,255,255,.09)', borderRadius:9, fontSize:14, fontWeight:500 },

  right:     { width:460, display:'flex', alignItems:'center', justifyContent:'center', padding:28, background:'var(--bg)' },
  card:      { width:'100%', background:'#fff', borderRadius:18, padding:32, boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)' },
  cardTop:   { marginBottom:22 },
  cardTitle: { fontSize:22, fontWeight:800 },
  cardSub:   { color:'var(--text-muted)', fontSize:13.5, marginTop:3 },

  roleRow:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 },
  roleBtn:   { display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'14px 10px', borderRadius:10, border:'2px solid var(--border)', background:'var(--surface2)', cursor:'pointer', font:'inherit', transition:'all .18s' },
  roleBtnActive: { border:'2px solid var(--primary)', background:'var(--primary-lt)', color:'var(--primary)' },

  divider: { textAlign:'center', color:'var(--text-light)', fontSize:12, margin:'18px 0', position:'relative' },
  footer:  { marginTop:18, textAlign:'center', fontSize:13, color:'var(--text-muted)' },
};
