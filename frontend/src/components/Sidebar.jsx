import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ADMIN_LINKS = [
  { to: '/admin',             label: 'Dashboard',    icon: '▦' },
  { to: '/admin/upload',      label: 'Upload CSV',   icon: '⬆' },
  { to: '/admin/assign',      label: 'Assign Students', icon: '↔' },
  { to: '/admin/counsellors', label: 'Counsellors',  icon: '👤' },
];

const COUNSELLOR_LINKS = [
  { to: '/counsellor', label: 'My Students', icon: '▦' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const links = user.role === 'admin' ? ADMIN_LINKS : COUNSELLOR_LINKS;

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <aside style={S.root}>
      {/* Brand */}
      <div style={S.brand}>
        <div style={S.logoBox}>
          <span style={{ fontSize: 20, fontWeight: 900 }}>E</span>
        </div>
        <div>
          <div style={S.logoText}>EduSafe<span style={{ color: 'var(--primary)' }}>Guard</span></div>
          <div style={S.logoSub}>v2.0 · {user.institution_name || 'Platform'}</div>
        </div>
      </div>

      {/* User pill */}
      <div style={S.userPill}>
        <div style={S.avatar}>{(user.name || 'U')[0].toUpperCase()}</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={S.uname}>{user.name}</div>
          <div style={S.uemail}>{user.role === 'admin' ? 'Administrator' : `Counsellor · ${user.branch_name || ''}`}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.navSection}>MENU</div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/admin' || l.to === '/counsellor'}
            style={({ isActive }) => ({ ...S.link, ...(isActive ? S.linkActive : {}) })}>
            <span style={S.icon}>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <button onClick={logout} style={S.logout}>
        <span>⏻</span> Sign Out
      </button>
    </aside>
  );
}

const S = {
  root:    { position:'fixed', top:0, left:0, width:'var(--sidebar-w)', height:'100vh', background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'18px 0', zIndex:100, boxShadow:'1px 0 8px rgba(37,99,235,.06)' },
  brand:   { display:'flex', alignItems:'center', gap:10, padding:'0 18px 18px', borderBottom:'1px solid var(--border)' },
  logoBox: { width:36, height:36, background:'var(--primary)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 },
  logoText:{ fontWeight:800, fontSize:15, color:'var(--text)' },
  logoSub: { fontSize:10, color:'var(--text-muted)', marginTop:1 },
  userPill:{ display:'flex', alignItems:'center', gap:9, margin:'14px 12px', padding:'10px 12px', background:'var(--surface2)', borderRadius:10 },
  avatar:  { width:32, height:32, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 },
  uname:   { fontWeight:600, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:130 },
  uemail:  { fontSize:10.5, color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:130 },
  nav:     { flex:1, padding:'10px 10px 0' },
  navSection: { fontSize:10, fontWeight:700, color:'var(--text-light)', letterSpacing:'.1em', padding:'8px 8px 4px' },
  link:    { display:'flex', alignItems:'center', gap:9, padding:'9px 10px', borderRadius:8, color:'var(--text-muted)', fontWeight:500, fontSize:13.5, marginBottom:2, transition:'all .15s', textDecoration:'none' },
  linkActive:{ background:'var(--primary-lt)', color:'var(--primary)', fontWeight:700 },
  icon:    { fontSize:13, width:18, textAlign:'center' },
  logout:  { display:'flex', alignItems:'center', gap:7, margin:'0 10px', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', background:'transparent', color:'var(--text-muted)', fontFamily:'var(--font)', fontSize:13.5, fontWeight:500, width:'calc(100% - 20px)', transition:'all .15s' },
};
