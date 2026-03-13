import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function FollowupForm({ studentId, studentName, studentEmail, onClose }) {
  const [note,     setNote]     = useState('');
  const [date,     setDate]     = useState(new Date().toISOString().slice(0, 10));
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState(null);
  const [history,  setHistory]  = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchHistory(); }, [studentId]);

  const fetchHistory = async () => {
    setFetching(true);
    try {
      const res = await API.get(`/followups/student/${studentId}`);
      setHistory(res.data);
    } catch {}
    setFetching(false);
  };

  const save = async (sendEmail) => {
    if (!note.trim() || !date) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await API.post('/followups', {
        student_id:  studentId,
        note,
        follow_date: date,
        send_email:  sendEmail,
      });

      if (sendEmail) {
        if (res.data.email_sent) {
          setMsg({ type: 'success', text: '✅ Follow-up saved and email sent successfully.' });
        } else {
          setMsg({ type: 'warn', text: `⚠️ Follow-up saved but email could not be sent. ${res.data.email_error || ''}` });
        }
      } else {
        setMsg({ type: 'success', text: '✅ Follow-up note saved.' });
      }

      setNote('');
      fetchHistory();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Failed to save.' });
    }
    setLoading(false);
  };

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        {/* Header */}
        <div style={S.hdr}>
          <div>
            <div style={S.title}>Follow-up Notes</div>
            <div style={S.sub}>{studentName}</div>
          </div>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        {msg && (
          <div className={`alert alert-${msg.type === 'success' ? 'success' : msg.type === 'warn' ? 'warn' : 'error'}`}>
            {msg.text}
          </div>
        )}

        {/* Student Email – read-only */}
        <div className="form-group">
          <label className="form-label">
            Student Email
            <span style={{ marginLeft:6, fontSize:11, background:'#e0e7ff', color:'#3730a3', padding:'1px 7px', borderRadius:99, fontWeight:600 }}>read-only</span>
          </label>
          <input
            type="email"
            className="form-input"
            value={studentEmail || 'No email on record'}
            readOnly
            style={{ background:'var(--surface2)', color:'var(--text-muted)', cursor:'default' }}
          />
        </div>

        {/* Note + Date */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 160px', gap:10, marginBottom:14 }}>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Note</label>
            <textarea className="form-textarea"
              placeholder="Enter counselling session notes, recommendations, action items…"
              value={note} onChange={e => setNote(e.target.value)}
              style={{ minHeight:80 }} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}
            onClick={() => save(true)} disabled={loading || !note.trim()}>
            {loading ? 'Saving…' : '📧 Save & Send Email'}
          </button>
          <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}
            onClick={() => save(false)} disabled={loading || !note.trim()}>
            {loading ? '…' : '💾 Save Only'}
          </button>
        </div>

        {!studentEmail && (
          <div style={{ fontSize:12, color:'var(--warning)', marginTop:7 }}>
            ⚠ No email address found for this student. Email will not be sent.
          </div>
        )}

        {/* History */}
        <div style={S.histHdr}>Previous Notes ({fetching ? '…' : history.length})</div>
        {!fetching && history.length === 0 && (
          <div style={{ color:'var(--text-muted)', fontSize:13, fontStyle:'italic' }}>No notes yet.</div>
        )}
        {history.map(h => (
          <div key={h.id} style={S.note}>
            <div style={S.noteMeta}>
              <span style={{ fontFamily:'var(--mono)', fontSize:11 }}>
                {new Date(h.follow_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
              </span>
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>· {h.counsellor_name}</span>
            </div>
            <div style={{ fontSize:13.5, lineHeight:1.65 }}>{h.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  overlay:  { position:'fixed', inset:0, background:'rgba(17,24,39,.48)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 },
  modal:    { background:'#fff', borderRadius:16, padding:26, width:540, maxWidth:'95vw', maxHeight:'88vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(17,24,39,.2)' },
  hdr:      { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 },
  title:    { fontWeight:700, fontSize:17 },
  sub:      { fontSize:13, color:'var(--text-muted)', marginTop:2 },
  closeBtn: { width:28, height:28, borderRadius:'50%', border:'none', cursor:'pointer', background:'var(--surface2)', color:'var(--text-muted)', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' },
  histHdr:  { fontWeight:700, fontSize:12, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.07em', borderTop:'1px solid var(--border)', paddingTop:16, marginTop:16, marginBottom:10 },
  note:     { background:'var(--surface2)', borderRadius:8, padding:'10px 13px', marginBottom:8 },
  noteMeta: { display:'flex', alignItems:'center', gap:6, marginBottom:4 },
};
