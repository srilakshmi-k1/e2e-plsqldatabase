import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

export default function ManageCounsellors() {
  const [counsellors, setCounsellors] = useState([]);
  const [branches,    setBranches]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [form,        setForm]        = useState({ name:'', email:'', branch_id:'' });
  const [msg,         setMsg]         = useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([API.get('/auth/counsellors'), API.get('/auth/branches')]);
      setCounsellors(cRes.data);
      setBranches(bRes.data);
    } catch {}
    setLoading(false);
  };

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setSubmitting(true); setMsg(null);
    try {
      const res = await API.post('/auth/counsellors', form);
      setMsg({ type:'success', text: res.data.message });
      setForm({ name:'', email:'', branch_id:'' });
      fetchAll();
      setShowForm(false);
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.error || 'Failed to add counsellor.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-hdr">
          <div>
            <div className="page-title">Manage Counsellors</div>
            <div className="page-subtitle">{counsellors.length} counsellor{counsellors.length !== 1 ? 's' : ''} registered</div>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setMsg(null); }}>
            {showForm ? '✕ Cancel' : '+ Add Counsellor'}
          </button>
        </div>

        {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        {/* Add form */}
        {showForm && (
          <div className="card" style={{ marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Add New Counsellor</div>
            <form onSubmit={submit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:12, alignItems:'end' }}>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Dr. Priya Sharma" value={form.name} onChange={set('name')} required />
                </div>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="priya@college.edu" value={form.email} onChange={set('email')} required />
                </div>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">Branch</label>
                  <select className="form-select" value={form.branch_id} onChange={set('branch_id')} required>
                    <option value="">— select branch —</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding…' : 'Add'}
                </button>
              </div>
            </form>
            <div className="alert alert-info" style={{ marginTop:14, marginBottom:0 }}>
              ℹ️ The counsellor will need to visit <strong>/activate</strong> and use their email to set a password before they can log in.
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card" style={{ padding:0 }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Loading…</div>
          ) : counsellors.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 24px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:40, marginBottom:10 }}>👤</div>
              <div style={{ fontWeight:600 }}>No counsellors yet</div>
              <div style={{ fontSize:13, marginTop:4 }}>Click "Add Counsellor" to get started</div>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Branch</th><th>Status</th><th>Students</th><th>Added</th></tr>
                </thead>
                <tbody>
                  {counsellors.map((c, i) => (
                    <tr key={c.id}>
                      <td style={{ color:'var(--text-muted)', fontSize:12 }}>{i + 1}</td>
                      <td><strong>{c.name}</strong></td>
                      <td style={{ color:'var(--text-muted)', fontSize:13 }}>{c.email}</td>
                      <td><span style={{ background:'var(--surface2)', padding:'2px 8px', borderRadius:5, fontSize:12, fontWeight:600 }}>{c.branch_code || '—'}</span></td>
                      <td>
                        {c.is_active
                          ? <span className="badge badge-safe">✓ Active</span>
                          : <span className="badge" style={{ background:'#f3f4f6', color:'var(--text-muted)' }}>⏳ Pending</span>}
                      </td>
                      <td><span className="badge badge-info">{c.assigned_count}</span></td>
                      <td style={{ fontSize:12, color:'var(--text-muted)' }}>
                        {new Date(c.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
