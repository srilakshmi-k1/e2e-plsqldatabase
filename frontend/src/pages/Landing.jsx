import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={S.page}>

      {/* ── NAV BAR ─────────────────────────────────────────── */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.brand}>
            <div style={S.brandIcon}>E</div>
            <span style={S.brandName}>EduSafe<span style={{ color:'var(--primary)' }}>Guard</span></span>
          </div>
          <div style={S.navLinks}>
            <a href="#about"    style={S.navLink}>About</a>
            <a href="#features" style={S.navLink}>Features</a>
            <a href="#how"      style={S.navLink}>How It Works</a>
            <Link to="/login"   className="btn btn-primary btn-sm">Login</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.heroBg} aria-hidden="true">
          <div style={S.orb1} />
          <div style={S.orb2} />
          <div style={S.grid} />
        </div>
        <div style={S.heroContent}>
          <div style={S.heroBadge}>🎓 </div>
          <h1 style={S.heroTitle}>
            EduSafeGuard –<br />
            <span style={{ color:'#60a5fa' }}>Student Retention</span>{' '}
            &amp; Success Platform
          </h1>
          <p style={S.heroTagline}>
            Predict student drop-out early and support academic success through
            intelligent monitoring, counsellor assignment, and follow-up tracking.
          </p>
          <div style={S.heroBtns}>
            <Link to="/login" className="btn" style={S.btnHero}>
              🔐 Login to Platform
            </Link>
            <Link to="/activate" className="btn" style={S.btnHeroOutline}>
              🔑 Activate Counsellor Account
            </Link>
          </div>
          <div style={S.heroStats}>
            {[
              { v:'3',      l:'Risk Levels' },
              { v:'CSV',    l:'Bulk Upload' },
              { v:'AI',     l:'Smart Suggestions' },
              { v:'Email',  l:'Follow-up Alerts' },
            ].map(s => (
              <div key={s.l} style={S.heroStat}>
                <div style={S.heroStatVal}>{s.v}</div>
                <div style={S.heroStatLbl}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────── */}
      <section id="about" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionLabel}>About the Platform</div>
          <h2 style={S.sectionTitle}>What is EduSafeGuard?</h2>
          <div style={S.aboutGrid}>
            <div style={S.aboutText}>
              <p style={S.para}>
                EduSafeGuard is an intelligent platform designed to help educational
                institutions identify students who are at risk of dropping out. By analyzing
                academic indicators such as CGPA and attendance, the system predicts risk
                levels and helps counsellors provide timely support and follow-up guidance.
              </p>
              <p style={S.para}>
                The platform bridges the gap between student performance data and actionable
                intervention. Administrators upload student records, the system automatically
                classifies each student's risk level, and counsellors receive assignments to
                personally guide at-risk students back to academic success.
              </p>
              <div style={S.aboutHighlights}>
                {[
                  { icon:'🏛️', text:'Designed for engineering & technical colleges' },
                  { icon:'📊', text:'Analyzes CGPA and attendance automatically' },
                  { icon:'🤝', text:'Bridges admin, counsellors, and students' },
                  { icon:'🤖', text:'AI-powered improvement suggestions' },
                ].map(h => (
                  <div key={h.text} style={S.highlight}>
                    <span style={{ fontSize:18 }}>{h.icon}</span>
                    <span style={{ fontSize:13.5, color:'var(--text-2)' }}>{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.aboutVisual}>
              <div style={S.riskCard}>
                <div style={S.riskCardTitle}>Risk Classification</div>
                {[
                  { label:'High Risk',     color:'#dc2626', bg:'#fef2f2', dot:'🔴', desc:'CGPA < 5 & Attend. < 60%' },
                  { label:'Moderate Risk', color:'#d97706', bg:'#fffbeb', dot:'🟡', desc:'CGPA 5–7 or Attend. 60–75%' },
                  { label:'Safe',          color:'#059669', bg:'#ecfdf5', dot:'🟢', desc:'CGPA > 7 & Attend. > 75%' },
                ].map(r => (
                  <div key={r.label} style={{ ...S.riskRow, background:r.bg }}>
                    <span style={{ fontSize:18 }}>{r.dot}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13.5, color:r.color }}>{r.label}</div>
                      <div style={{ fontSize:11.5, color:'#6b7280' }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" style={{ ...S.section, background:'var(--surface2)' }}>
        <div style={S.sectionInner}>
          <div style={S.sectionLabel}>Key Features</div>
          <h2 style={S.sectionTitle}>Everything you need to retain students</h2>
          <div style={S.featGrid}>
            {[
              { icon:'🔍', title:'Early Risk Detection', desc:'Automatically identifies students at risk using academic data — CGPA and attendance — the moment records are uploaded.' },
              { icon:'📊', title:'Student Monitoring',   desc:'Tracks attendance, CGPA, and academic progress in real-time. Visual indicators make it easy to spot who needs help.' },
              { icon:'🤝', title:'Counsellor Support',   desc:'Allows counsellors to monitor assigned students, add follow-up notes, and send email notifications directly to students.' },
              { icon:'📁', title:'Bulk CSV Upload',       desc:'Admins can upload hundreds of student records in seconds using a CSV file. The system parses and classifies them instantly.' },
              { icon:'🤖', title:'AI Suggestions',        desc:'Click one button to get tailored improvement suggestions for any student — study plans, attendance strategies, and more.' },
              { icon:'📈', title:'Data-Driven Decisions', desc:'Dashboards with pie charts and bar charts help institutions take proactive, evidence-based actions to improve retention.' },
            ].map(f => (
              <div key={f.title} style={S.featCard}>
                <div style={S.featIcon}>{f.icon}</div>
                <div style={S.featTitle}>{f.title}</div>
                <div style={S.featDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionLabel}>How It Works</div>
          <h2 style={S.sectionTitle}>Simple four-step workflow</h2>
          <div style={S.steps}>
            {[
              { n:'1', icon:'📁', title:'Admin Uploads Data',       desc:'Administrator uploads a CSV file containing student names, CGPA, attendance, email, and branch details.' },
              { n:'2', icon:'⚙️', title:'System Analyses Records',  desc:'The backend parses each row, looks up branch codes, and automatically calculates a risk level per student.' },
              { n:'3', icon:'📊', title:'Risk Levels Assigned',     desc:'Each student is classified as High Risk, Moderate Risk, or Safe based on rule-based academic thresholds.' },
              { n:'4', icon:'🤝', title:'Counsellors Follow Up',    desc:'Admin assigns at-risk students to counsellors. Counsellors add notes and send follow-up emails to students.' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={S.step}>
                  <div style={S.stepNum}>{s.n}</div>
                  <div style={S.stepIcon}>{s.icon}</div>
                  <div style={S.stepTitle}>{s.title}</div>
                  <div style={S.stepDesc}>{s.desc}</div>
                </div>
                {i < 3 && <div style={S.stepArrow}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={S.cta}>
        <div style={S.ctaInner}>
          <h2 style={S.ctaTitle}>Ready to get started?</h2>
          <p style={S.ctaSub}>Login to your dashboard or activate your counsellor account.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/login"    className="btn" style={S.btnHero}>🔐 Login to Platform</Link>
            <Link to="/register" className="btn" style={S.btnHeroOutline}>🏛️ Register Institution</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerBrand}>
            <div style={S.footerLogo}>
              <div style={{ ...S.brandIcon, width:32, height:32, fontSize:16 }}>E</div>
              <span style={{ fontWeight:800, fontSize:15 }}>EduSafe<span style={{ color:'#60a5fa' }}>Guard</span></span>
            </div>
            <div style={S.footerTagline}>EduSafeGuard – Student Retention Platform</div>
          </div>
          <div style={S.footerMid}>
            <div style={S.footerItem}>📚 Developed as a B.Tech Final Year Project</div>
            <div style={S.footerItem}>📅 Year: 2026</div>
            <div style={S.footerItem}>🔒 Secure · Role-based access · MySQL backend</div>
          </div>
          <div style={S.footerLinks}>
            <Link to="/login"    style={S.fLink}>Login</Link>
            <Link to="/register" style={S.fLink}>Register</Link>
            <Link to="/activate" style={S.fLink}>Activate Account</Link>
          </div>
        </div>
        <div style={S.footerBottom}>
          © 2026 EduSafeGuard · Student Retention &amp; Success Platform · B.Tech Final Year Project
        </div>
      </footer>

    </div>
  );
}

const S = {
  page: { fontFamily:'var(--font)', color:'var(--text)', background:'var(--surface)' },

  /* Nav */
  nav:       { position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)', boxShadow:'var(--shadow-xs)' },
  navInner:  { maxWidth:1140, margin:'0 auto', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' },
  brand:     { display:'flex', alignItems:'center', gap:9 },
  brandIcon: { width:36, height:36, background:'var(--primary)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:19 },
  brandName: { fontWeight:800, fontSize:17, color:'var(--text)' },
  navLinks:  { display:'flex', alignItems:'center', gap:24 },
  navLink:   { fontSize:14, fontWeight:500, color:'var(--text-muted)', textDecoration:'none', transition:'color .15s' },

  /* Hero */
  hero:        { position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'linear-gradient(160deg,#0f172a 0%,#1e3a8a 50%,#1d4ed8 100%)' },
  heroBg:      { position:'absolute', inset:0, pointerEvents:'none' },
  orb1:        { position:'absolute', top:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.35) 0%,transparent 70%)' },
  orb2:        { position:'absolute', bottom:'-15%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,.3) 0%,transparent 70%)' },
  grid:        { position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize:'40px 40px' },
  heroContent: { position:'relative', maxWidth:780, textAlign:'center', padding:'60px 32px', color:'#fff' },
  heroBadge:   { display:'inline-block', padding:'6px 16px', background:'rgba(255,255,255,.1)', borderRadius:99, fontSize:13, fontWeight:500, marginBottom:24, border:'1px solid rgba(255,255,255,.15)', backdropFilter:'blur(6px)' },
  heroTitle:   { fontSize:46, fontWeight:900, lineHeight:1.2, marginBottom:22, letterSpacing:'-.02em' },
  heroTagline: { fontSize:18, opacity:.85, lineHeight:1.75, marginBottom:36, maxWidth:600, margin:'0 auto 36px' },
  heroBtns:    { display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:48 },
  btnHero:         { background:'#fff', color:'var(--primary)', fontWeight:700, fontSize:15, padding:'13px 28px', borderRadius:10, boxShadow:'0 4px 20px rgba(0,0,0,.2)' },
  btnHeroOutline:  { background:'rgba(255,255,255,.1)', color:'#fff', border:'1.5px solid rgba(255,255,255,.35)', fontWeight:600, fontSize:15, padding:'13px 28px', borderRadius:10, backdropFilter:'blur(6px)' },
  heroStats:   { display:'flex', gap:0, justifyContent:'center', background:'rgba(255,255,255,.08)', borderRadius:14, border:'1px solid rgba(255,255,255,.12)', overflow:'hidden', maxWidth:480, margin:'0 auto' },
  heroStat:    { flex:1, padding:'16px 12px', textAlign:'center', borderRight:'1px solid rgba(255,255,255,.1)' },
  heroStatVal: { fontWeight:900, fontSize:20, marginBottom:2 },
  heroStatLbl: { fontSize:11, opacity:.7, fontWeight:500 },

  /* Sections */
  section:      { padding:'80px 32px' },
  sectionInner: { maxWidth:1140, margin:'0 auto' },
  sectionLabel: { fontSize:12, fontWeight:700, color:'var(--primary)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10 },
  sectionTitle: { fontSize:32, fontWeight:800, marginBottom:40, lineHeight:1.3, color:'var(--text)' },

  /* About */
  aboutGrid:       { display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:48, alignItems:'start' },
  aboutText:       {},
  para:            { fontSize:15, lineHeight:1.8, color:'var(--text-2)', marginBottom:16 },
  aboutHighlights: { display:'flex', flexDirection:'column', gap:10, marginTop:20 },
  highlight:       { display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--surface2)', borderRadius:9 },
  aboutVisual:     {},
  riskCard:        { background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:22, boxShadow:'var(--shadow)' },
  riskCardTitle:   { fontWeight:700, fontSize:15, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--border)' },
  riskRow:         { display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:9, marginBottom:10 },

  /* Features */
  featGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 },
  featCard: { background:'var(--surface)', borderRadius:13, padding:'24px 22px', border:'1px solid var(--border)', boxShadow:'var(--shadow-xs)', transition:'box-shadow .2s, transform .2s' },
  featIcon: { fontSize:32, marginBottom:14 },
  featTitle:{ fontWeight:700, fontSize:15.5, marginBottom:9, color:'var(--text)' },
  featDesc: { fontSize:13.5, color:'var(--text-muted)', lineHeight:1.7 },

  /* Steps */
  steps:    { display:'flex', alignItems:'flex-start', gap:0, flexWrap:'wrap' },
  step:     { flex:1, minWidth:200, textAlign:'center', padding:'0 20px' },
  stepNum:  { width:40, height:40, background:'var(--primary)', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:17, margin:'0 auto 14px' },
  stepIcon: { fontSize:32, marginBottom:12 },
  stepTitle:{ fontWeight:700, fontSize:15, marginBottom:9 },
  stepDesc: { fontSize:13.5, color:'var(--text-muted)', lineHeight:1.7 },
  stepArrow:{ fontSize:24, color:'var(--border2)', alignSelf:'flex-start', paddingTop:36, flexShrink:0 },

  /* CTA */
  cta:      { background:'linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%)', padding:'72px 32px', textAlign:'center' },
  ctaInner: { maxWidth:600, margin:'0 auto' },
  ctaTitle: { fontSize:30, fontWeight:800, color:'#fff', marginBottom:12 },
  ctaSub:   { fontSize:16, color:'rgba(255,255,255,.8)', marginBottom:32 },

  /* Footer */
  footer:       { background:'#0f172a', color:'rgba(255,255,255,.75)', padding:'40px 32px 0' },
  footerInner:  { maxWidth:1140, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:32, paddingBottom:32, borderBottom:'1px solid rgba(255,255,255,.1)' },
  footerBrand:  {},
  footerLogo:   { display:'flex', alignItems:'center', gap:9, marginBottom:10 },
  footerTagline:{ fontSize:13, opacity:.65, lineHeight:1.6 },
  footerMid:    { display:'flex', flexDirection:'column', gap:10 },
  footerItem:   { fontSize:13.5 },
  footerLinks:  { display:'flex', flexDirection:'column', gap:10 },
  fLink:        { fontSize:13.5, color:'rgba(255,255,255,.65)', textDecoration:'none', fontWeight:500 },
  footerBottom: { maxWidth:1140, margin:'0 auto', padding:'16px 0', fontSize:12, opacity:.45, textAlign:'center' },
};
