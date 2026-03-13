import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import FollowupForm from '../components/FollowupForm';
import API from '../services/api';

export default function StudentDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');

  const [student,     setStudent]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [showFollowup, setShowFollowup] = useState(false);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [aiResult,    setAiResult]    = useState(null);

  useEffect(() => { fetchStudent(); }, [id]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/students/${id}`);
      setStudent(res.data);
    } catch { navigate(-1); }
    setLoading(false);
  };

  const getAI = async () => {
    setAiLoading(true); setAiResult(null);
    try {
      const res = await API.get(`/students/${id}/ai-suggestion`);
      setAiResult(res.data);
    } catch (e) {
      setAiResult({ error: e.response?.data?.error || 'Failed to generate suggestions.' });
    }
    setAiLoading(false);
  };

  const basePath = user.role === 'admin' ? '/admin' : '/counsellor';

  if (loading) return <div className="layout"><Sidebar /><div className="main-content" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>Loading…</div></div>;
  if (!student) return null;

  const cgpa   = parseFloat(student.cgpa);
  const attend = parseFloat(student.attendance);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="page-hdr">
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
            <div>
              <div className="page-title">{student.name}</div>
              <div className="page-subtitle">{student.branch_name} · Serial #{student.serial_number || id}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-primary" onClick={() => setShowFollowup(true)}>📝 Add Follow-up</button>
            <button className="btn" style={{ background:'var(--purple)', color:'#fff' }}
              onClick={getAI} disabled={aiLoading}>
              {aiLoading ? '🤖 Generating…' : '🤖 AI Suggestions'}
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
          {/* Info card */}
          <div className="card">
            <div style={S.sec}>Student Information</div>
            <div style={S.infoGrid}>
              <InfoRow label="Full Name"     value={student.name} />
              <InfoRow label="Email"         value={student.email || '—'} />
              <InfoRow label="Contact"       value={student.contact_number || '—'} />
              <InfoRow label="Branch"        value={`${student.branch_name} (${student.branch_code})`} />
              <InfoRow label="Serial No."    value={student.serial_number || '—'} />
              <InfoRow label="Uploaded"      value={new Date(student.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })} />
            </div>
          </div>

          {/* Academic card */}
          <div className="card">
            <div style={S.sec}>Academic Performance</div>
            <div style={{ marginBottom:20 }}>
              <div style={S.metricLabel}>CGPA</div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ ...S.bigNum, color: cgpa<5 ? 'var(--danger)' : cgpa<=7 ? 'var(--warning)' : 'var(--success)' }}>
                  {cgpa.toFixed(2)}
                </div>
                <div style={S.bar}>
                  <div style={{ ...S.barFill, width:`${(cgpa/10)*100}%`, background: cgpa<5 ? 'var(--danger)' : cgpa<=7 ? 'var(--warning)' : 'var(--success)' }} />
                </div>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>/10</span>
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={S.metricLabel}>Attendance</div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ ...S.bigNum, color: attend<60 ? 'var(--danger)' : attend<=75 ? 'var(--warning)' : 'var(--success)' }}>
                  {attend}%
                </div>
                <div style={S.bar}>
                  <div style={{ ...S.barFill, width:`${Math.min(attend,100)}%`, background: attend<60 ? 'var(--danger)' : attend<=75 ? 'var(--warning)' : 'var(--success)' }} />
                </div>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>/ 100%</span>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={S.metricLabel}>Risk Level</div>
              <RiskBadge level={student.level_name} />
            </div>
          </div>
        </div>

        {/* AI Result */}
        {aiResult && (
          <div className="card" style={{ marginTop:18 }}>
            {aiResult.error ? (
              <div className="alert alert-error">{aiResult.error}</div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                  <span style={{ fontSize:22 }}>🤖</span>
                  <div style={{ fontWeight:700, fontSize:15 }}>AI Improvement Suggestions for {aiResult.student}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {aiResult.suggestions?.map((s, i) => (
                    <div key={i} style={S.aiItem}>{s}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Follow-up modal */}
        {showFollowup && (
          <FollowupForm
            studentId={id}
            studentName={student.name}
            studentEmail={student.email}
            onClose={() => setShowFollowup(false)}
          />
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</div>
      <div style={{ fontSize:13.5, fontWeight:500 }}>{value}</div>
    </div>
  );
}

const S = {
  sec:         { fontWeight:700, fontSize:13.5, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--border)' },
  infoGrid:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 20px' },
  metricLabel: { fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 },
  bigNum:      { fontFamily:'var(--mono)', fontWeight:800, fontSize:30, minWidth:70 },
  bar:         { flex:1, height:8, background:'var(--border)', borderRadius:99, overflow:'hidden' },
  barFill:     { height:'100%', borderRadius:99, transition:'width .4s' },
  aiItem:      { padding:'11px 14px', background:'var(--surface2)', borderRadius:9, fontSize:13.5, lineHeight:1.65 },
};
