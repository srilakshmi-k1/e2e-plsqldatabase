import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import API from '../services/api';

const RISK_COLORS = { 'High Risk':'#dc2626', 'Moderate Risk':'#d97706', 'Safe':'#059669' };

function StatCard({ value, label, color, icon, border }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${border || color}` }}>
      <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
      <div className="stat-val" style={{ color }}>{value ?? '—'}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/dashboard/admin');
      setData(res.data);
    } catch {}
    setLoading(false);
  };

  if (loading) return <div className="layout"><Sidebar /><div className="main-content" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>Loading dashboard…</div></div>;

  const riskPie = data ? [
    { name:'High Risk',     value: data.stats.high_risk },
    { name:'Moderate Risk', value: data.stats.moderate_risk },
    { name:'Safe',          value: data.stats.safe },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-hdr">
          <div>
            <div className="page-title">Admin Dashboard</div>
            <div className="page-subtitle">Overview of student risk & counsellor activity</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchData}>↻ Refresh</button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard value={data?.stats.total}         label="Total Students"   color="var(--primary)"  icon="👥" border="var(--primary)" />
          <StatCard value={data?.stats.high_risk}     label="High Risk"        color="var(--danger)"   icon="🔴" border="var(--danger)" />
          <StatCard value={data?.stats.moderate_risk} label="Moderate Risk"    color="var(--warning)"  icon="🟡" border="var(--warning)" />
          <StatCard value={data?.stats.safe}          label="Safe"             color="var(--success)"  icon="🟢" border="var(--success)" />
          <StatCard value={data?.stats.assigned}      label="Assigned"         color="var(--primary)"  icon="📋" border="#93c5fd" />
          <StatCard value={data?.stats.unassigned}    label="Unassigned"       color="var(--warning)"  icon="⏳" border="#fbbf24" />
          <StatCard value={data?.stats.counsellors}   label="Active Counsellors" color="var(--purple)" icon="👤" border="var(--purple)" />
        </div>

        {/* Charts */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:18, marginBottom:20 }}>
          {/* Pie */}
          <div className="card">
            <div style={S.chartTitle}>Risk Distribution</div>
            {riskPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={riskPie} cx="50%" cy="50%" outerRadius={85} innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}
                    labelLine={false}>
                    {riskPie.map(e => <Cell key={e.name} fill={RISK_COLORS[e.name]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
            ) : <NoData />}
            {riskPie.length > 0 && (
              <div style={{ display:'flex', justifyContent:'center', gap:14, marginTop:6, flexWrap:'wrap' }}>
                {riskPie.map(r => (
                  <div key={r.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:RISK_COLORS[r.name] }} />
                    <span>{r.name}: <strong>{r.value}</strong></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar */}
          <div className="card">
            <div style={S.chartTitle}>Students per Branch</div>
            {data?.branchData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={data.branchData} margin={{ top:10, right:10, left:-10, bottom:5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="code" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize:12 }} />
                  <Bar dataKey="high"     name="High Risk"     fill="#dc2626" stackId="a" radius={[0,0,0,0]} />
                  <Bar dataKey="moderate" name="Moderate"      fill="#d97706" stackId="a" />
                  <Bar dataKey="safe"     name="Safe"          fill="#059669" stackId="a" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <NoData />}
          </div>
        </div>

        {/* Counsellor load */}
        {data?.counsellorLoad?.length > 0 && (
          <div className="card" style={{ marginBottom:20 }}>
            <div style={S.chartTitle}>Counsellor Load</div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:12 }}>
              {data.counsellorLoad.map(c => (
                <div key={c.name} style={S.cLoad}>
                  <div style={S.cAvatar}>{c.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{c.count} student{c.count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent students */}
        {data?.recentStudents?.length > 0 && (
          <div className="card">
            <div style={S.chartTitle}>Recently Added Students</div>
            <div className="tbl-wrap" style={{ marginTop:14 }}>
              <table>
                <thead><tr><th>Name</th><th>CGPA</th><th>Attendance</th><th>Branch</th><th>Risk</th></tr></thead>
                <tbody>
                  {data.recentStudents.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.name}</strong></td>
                      <td style={{ fontFamily:'var(--mono)' }}>{parseFloat(s.cgpa).toFixed(2)}</td>
                      <td style={{ fontFamily:'var(--mono)' }}>{s.attendance}%</td>
                      <td><span style={{ background:'var(--surface2)', padding:'2px 7px', borderRadius:5, fontSize:11.5, fontWeight:600 }}>{s.branch}</span></td>
                      <td><RiskBadge level={s.level_name} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NoData() {
  return <div style={{ height:230, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:13 }}>No data yet — upload a CSV first</div>;
}

const S = {
  chartTitle: { fontWeight:700, fontSize:14.5, marginBottom:2 },
  cLoad: { display:'flex', alignItems:'center', gap:9, background:'var(--surface2)', borderRadius:9, padding:'10px 14px', minWidth:160 },
  cAvatar: { width:32, height:32, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 },
};
