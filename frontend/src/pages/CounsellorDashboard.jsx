import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import FollowupForm from '../components/FollowupForm';
import API from '../services/api';

export default function CounsellorDashboard() {
  const [students,  setStudents]  = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, dRes] = await Promise.all([
        API.get('/assignments/mine'),
        API.get('/dashboard/counsellor'),
      ]);
      setStudents(sRes.data);
      setStats(dRes.data.stats);
    } catch {}
    setLoading(false);
  };

  let filtered = students;
  if (filter === 'high')     filtered = students.filter(s => s.level_name?.includes('High'));
  if (filter === 'moderate') filtered = students.filter(s => s.level_name?.includes('Moderate'));
  if (filter === 'safe')     filtered = students.filter(s => s.level_name?.includes('Safe'));
  if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-hdr">
          <div>
            <div className="page-title">My Students</div>
            <div className="page-subtitle">
              Welcome, {user.name} · {user.branch_name || 'Counsellor'}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchAll}>↻ Refresh</button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-grid" style={{ gridTemplateColumns:'repeat(5,1fr)' }}>
            {[
              { v: stats.total,    l:'Assigned',     c:'var(--primary)', i:'👥' },
              { v: stats.high,     l:'High Risk',    c:'var(--danger)',  i:'🔴' },
              { v: stats.moderate, l:'Moderate',     c:'var(--warning)', i:'🟡' },
              { v: stats.safe,     l:'Safe',         c:'var(--success)', i:'🟢' },
              { v: stats.followups,l:'Follow-ups',   c:'var(--purple)',  i:'📝' },
            ].map(s => (
              <div key={s.l} className="stat-card" style={{ borderTop:`3px solid ${s.c}` }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.i}</div>
                <div className="stat-val" style={{ color: s.c }}>{s.v}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap', alignItems:'center' }}>
          {[
            { key:'all',      label:'All' },
            { key:'high',     label:'🔴 High Risk' },
            { key:'moderate', label:'🟡 Moderate' },
            { key:'safe',     label:'🟢 Safe' },
          ].map(f => (
            <button key={f.key} className="btn btn-sm"
              style={{ background: filter===f.key ? 'var(--primary)' : 'var(--surface)', color: filter===f.key ? '#fff' : 'var(--text-muted)', border:'1.5px solid var(--border)' }}
              onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
          <input className="form-input" placeholder="🔍 Search student…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:200, padding:'7px 11px', fontSize:13, marginLeft:'auto' }} />
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>Loading your students…</div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎓</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:5 }}>
              {students.length === 0 ? 'No students assigned yet' : 'No students match your filter'}
            </div>
            <div style={{ color:'var(--text-muted)', fontSize:13.5 }}>
              {students.length === 0 ? 'Contact your administrator to get students assigned.' : 'Try a different filter.'}
            </div>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map(s => (
              <StudentCard key={s.id} student={s}
                onFollowup={() => setSelected(s)}
                onView={() => navigate(`/counsellor/students/${s.id}`)} />
            ))}
          </div>
        )}

        {selected && (
          <FollowupForm
            studentId={selected.id}
            studentName={selected.name}
            studentEmail={selected.email}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

function StudentCard({ student: s, onFollowup, onView }) {
  const cgpa   = parseFloat(s.cgpa);
  const attend = parseFloat(s.attendance);
  return (
    <div style={C.card}>
      <div style={C.top}>
        <div style={C.avatar}>{s.name[0]}</div>
        <div style={{ flex:1, overflow:'hidden' }}>
          <div style={{ fontWeight:700, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
          <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{s.branch_name || '—'}</div>
        </div>
        <RiskBadge level={s.level_name} />
      </div>

      {/* Metrics */}
      <div style={C.metrics}>
        <div style={C.metric}>
          <div style={C.mlabel}>CGPA</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:22, color: cgpa<5?'var(--danger)':cgpa<=7?'var(--warning)':'var(--success)' }}>
            {cgpa.toFixed(2)}
          </div>
        </div>
        <div style={{ width:1, background:'var(--border)' }} />
        <div style={C.metric}>
          <div style={C.mlabel}>Attendance</div>
          <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:22, color: attend<60?'var(--danger)':attend<=75?'var(--warning)':'var(--success)' }}>
            {attend}%
          </div>
        </div>
      </div>

      {/* Contact */}
      <div style={C.contact}>
        <span>📧 {s.email || 'No email'}</span>
        <span>📱 {s.contact_number || 'No contact'}</span>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:7 }}>
        <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={onFollowup}>
          📝 Follow-up
        </button>
        <button className="btn btn-ghost btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={onView}>
          View Details →
        </button>
      </div>
    </div>
  );
}

const S = {
  empty: { textAlign:'center', padding:'64px 24px', background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)' },
  grid:  { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:16 },
};

const C = {
  card:    { background:'var(--surface)', borderRadius:14, padding:18, border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)' },
  top:     { display:'flex', alignItems:'flex-start', gap:10, marginBottom:14 },
  avatar:  { width:38, height:38, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, flexShrink:0 },
  metrics: { display:'flex', background:'var(--surface2)', borderRadius:10, overflow:'hidden', marginBottom:12 },
  metric:  { flex:1, padding:'10px 14px', textAlign:'center' },
  mlabel:  { fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 },
  contact: { display:'flex', flexDirection:'column', gap:3, marginBottom:12, fontSize:12.5, color:'var(--text-muted)' },
};
