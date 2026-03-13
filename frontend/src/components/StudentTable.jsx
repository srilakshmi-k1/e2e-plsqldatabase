import React from 'react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from './RiskBadge';

export default function StudentTable({ students, loading, basePath = '/admin', showAssign, counsellors, onAssign }) {
  const navigate = useNavigate();

  if (loading) return <div style={{ textAlign:'center', padding:48, color:'var(--text-muted)' }}>Loading…</div>;
  if (!students?.length)
    return (
      <div style={{ textAlign:'center', padding:'52px 24px', color:'var(--text-muted)' }}>
        <div style={{ fontSize:44, marginBottom:10 }}>📭</div>
        <div style={{ fontWeight:600, marginBottom:3 }}>No students found</div>
        <div style={{ fontSize:13 }}>Upload a CSV to get started</div>
      </div>
    );

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>CGPA</th>
            <th>Attend.</th>
            <th>Branch</th>
            <th>Risk Level</th>
            <th>Email</th>
            <th>Contact</th>
            {showAssign && <th>Assign To</th>}
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id}>
              <td style={{ color:'var(--text-muted)', fontSize:12 }}>{i + 1}</td>
              <td><strong>{s.name}</strong></td>
              <td>
                <span style={{ fontFamily:'var(--mono)', fontWeight:700,
                  color: parseFloat(s.cgpa)<5 ? 'var(--danger)' : parseFloat(s.cgpa)<=7 ? 'var(--warning)' : 'var(--success)' }}>
                  {parseFloat(s.cgpa).toFixed(2)}
                </span>
              </td>
              <td>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:40, height:4, background:'var(--border)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ width:`${Math.min(s.attendance,100)}%`, height:'100%', borderRadius:99,
                      background: s.attendance<60 ? 'var(--danger)' : s.attendance<75 ? 'var(--warning)' : 'var(--success)' }} />
                  </div>
                  <span style={{ fontFamily:'var(--mono)', fontSize:12 }}>{s.attendance}%</span>
                </div>
              </td>
              <td><span style={{ background:'var(--surface2)', padding:'2px 8px', borderRadius:5, fontSize:11.5, fontWeight:600 }}>{s.branch_code || '—'}</span></td>
              <td><RiskBadge level={s.level_name} /></td>
              <td style={{ color:'var(--text-muted)', fontSize:12 }}>{s.email || '—'}</td>
              <td style={{ color:'var(--text-muted)', fontSize:12 }}>{s.contact_number || '—'}</td>
              {showAssign && (
                <td><AssignCell student={s} counsellors={counsellors} onAssign={onAssign} /></td>
              )}
              <td>
                <button className="btn btn-ghost btn-xs"
                  onClick={() => navigate(`${basePath}/students/${s.id}`)}>
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssignCell({ student, counsellors, onAssign }) {
  const [sel, setSel] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const go = async () => {
    if (!sel) return;
    setBusy(true);
    await onAssign(student.id, sel);
    setBusy(false);
  };
  return (
    <div style={{ display:'flex', gap:5 }}>
      <select className="form-select" value={sel} onChange={e => setSel(e.target.value)}
        style={{ padding:'5px 8px', fontSize:12, width:145 }}>
        <option value="">— select —</option>
        {counsellors?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button className="btn btn-primary btn-xs" onClick={go} disabled={!sel || busy}>
        {busy ? '…' : 'Assign'}
      </button>
    </div>
  );
}
