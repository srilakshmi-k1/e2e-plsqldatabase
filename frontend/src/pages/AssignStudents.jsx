import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StudentTable from '../components/StudentTable';
import API from '../services/api';

export default function AssignStudents() {
  const [students,    setStudents]    = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [msg,         setMsg]         = useState(null);
  const [filter,      setFilter]      = useState('all');
  const [search,      setSearch]      = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        API.get('/students/unassigned'),
        API.get('/auth/counsellors'),
      ]);
      setStudents(sRes.data);
      setCounsellors(cRes.data.filter(c => c.is_active));
    } catch {}
    setLoading(false);
  };

  const handleAssign = async (studentId, counsellorId) => {
    try {
      await API.post('/assignments', { student_id: studentId, counsellor_id: counsellorId });
      setMsg({ type:'success', text:'Student assigned successfully!' });
      fetchAll();
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setMsg({ type:'error', text: e.response?.data?.error || 'Assignment failed.' });
    }
  };

  const FILTERS = [
    { key:'all',      label:`All (${students.length})` },
    { key:'high',     label:`🔴 High Risk (${students.filter(s=>s.risk_level_id===1||s.level_name?.includes('High')).length})` },
    { key:'moderate', label:`🟡 Moderate (${students.filter(s=>s.risk_level_id===2||s.level_name?.includes('Moderate')).length})` },
    { key:'safe',     label:`🟢 Safe (${students.filter(s=>s.risk_level_id===3||s.level_name?.includes('Safe')).length})` },
  ];

  let filtered = students;
  if (filter === 'high')     filtered = students.filter(s => s.level_name?.includes('High'));
  if (filter === 'moderate') filtered = students.filter(s => s.level_name?.includes('Moderate'));
  if (filter === 'safe')     filtered = students.filter(s => s.level_name?.includes('Safe'));
  if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-hdr">
          <div>
            <div className="page-title">Assign Students to Counsellors</div>
            <div className="page-subtitle">
              {students.length} unassigned student{students.length !== 1 ? 's' : ''} · {counsellors.length} active counsellor{counsellors.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}
        {counsellors.length === 0 && !loading && (
          <div className="alert alert-warn">⚠ No active counsellors found. Add counsellors from the Counsellors page first.</div>
        )}

        {/* Filters + search */}
        <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap', alignItems:'center' }}>
          {FILTERS.map(f => (
            <button key={f.key} className="btn btn-sm"
              style={{ background: filter===f.key ? 'var(--primary)' : 'var(--surface)', color: filter===f.key ? '#fff' : 'var(--text-muted)', border:'1.5px solid var(--border)' }}
              onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
          <input className="form-input" placeholder="🔍 Search by name…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:200, padding:'7px 11px', fontSize:13, marginLeft:'auto' }} />
        </div>

        <div className="card" style={{ padding:0 }}>
          <StudentTable students={filtered} loading={loading}
            showAssign={true} counsellors={counsellors} onAssign={handleAssign}
            basePath="/admin" />
        </div>
      </div>
    </div>
  );
}
