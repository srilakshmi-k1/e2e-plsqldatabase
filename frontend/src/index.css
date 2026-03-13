@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── Design Tokens ─────────────────────────────────────────── */
:root {
  --bg:           #f5f7fc;
  --surface:      #ffffff;
  --surface2:     #eef1f8;
  --border:       #e3e8f2;
  --border2:      #d0d9ee;

  --primary:      #2563eb;
  --primary-lt:   #eff4ff;
  --primary-dk:   #1d4ed8;

  --danger:       #dc2626;
  --danger-lt:    #fef2f2;
  --warning:      #d97706;
  --warning-lt:   #fffbeb;
  --success:      #059669;
  --success-lt:   #ecfdf5;
  --purple:       #7c3aed;
  --purple-lt:    #f5f3ff;

  --text:         #111827;
  --text-2:       #374151;
  --text-muted:   #6b7280;
  --text-light:   #9ca3af;

  --shadow-xs:    0 1px 2px rgba(0,0,0,.05);
  --shadow-sm:    0 1px 6px rgba(37,99,235,.08);
  --shadow:       0 4px 16px rgba(37,99,235,.11);
  --shadow-lg:    0 10px 40px rgba(37,99,235,.15);

  --radius:       12px;
  --radius-sm:    8px;
  --radius-xs:    5px;

  --sidebar-w:    248px;
  --font:         'DM Sans', sans-serif;
  --mono:         'DM Mono', monospace;
}

/* ── Reset ──────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font);
  background:  var(--bg);
  color:       var(--text);
  font-size:   14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { text-decoration: none; color: inherit; }

/* ── Layout ─────────────────────────────────────────────────── */
.layout       { display: flex; min-height: 100vh; }
.main-content { flex: 1; margin-left: var(--sidebar-w); padding: 28px 32px; min-height: 100vh; }

/* ── Cards ──────────────────────────────────────────────────── */
.card {
  background:    var(--surface);
  border-radius: var(--radius);
  border:        1px solid var(--border);
  box-shadow:    var(--shadow-sm);
  padding:       22px;
}

/* ── Buttons ────────────────────────────────────────────────── */
.btn {
  display:       inline-flex;
  align-items:   center;
  gap:           6px;
  padding:       9px 18px;
  border-radius: var(--radius-sm);
  font-family:   var(--font);
  font-size:     13.5px;
  font-weight:   600;
  border:        none;
  cursor:        pointer;
  transition:    all .18s;
  white-space:   nowrap;
}
.btn-primary  { background: var(--primary);  color: #fff; }
.btn-primary:hover  { background: var(--primary-dk); transform: translateY(-1px); box-shadow: var(--shadow); }
.btn-danger   { background: var(--danger);   color: #fff; }
.btn-success  { background: var(--success);  color: #fff; }
.btn-ghost    { background: transparent; color: var(--text-muted); border: 1.5px solid var(--border); }
.btn-ghost:hover { background: var(--surface2); color: var(--text); }
.btn-sm       { padding: 6px 12px; font-size: 12.5px; }
.btn-xs       { padding: 4px 10px; font-size: 11.5px; border-radius: var(--radius-xs); }
.btn:disabled { opacity: .55; cursor: not-allowed; transform: none !important; }

/* ── Tables ─────────────────────────────────────────────────── */
.tbl-wrap    { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
table        { width: 100%; border-collapse: collapse; }
thead        { background: var(--surface2); }
th           { padding: 11px 14px; text-align: left; font-size: 11px; font-weight: 700;
               text-transform: uppercase; letter-spacing: .07em; color: var(--text-muted);
               white-space: nowrap; border-bottom: 1px solid var(--border); }
td           { padding: 12px 14px; border-top: 1px solid var(--border); font-size: 13.5px; }
tr:hover td  { background: var(--primary-lt); }

/* ── Badges ─────────────────────────────────────────────────── */
.badge       { display:inline-flex; align-items:center; gap:4px; padding:3px 9px;
               border-radius:99px; font-size:11.5px; font-weight:600; }
.badge-high  { background:var(--danger-lt);  color:var(--danger);  }
.badge-mod   { background:var(--warning-lt); color:var(--warning); }
.badge-safe  { background:var(--success-lt); color:var(--success); }
.badge-info  { background:var(--primary-lt); color:var(--primary); }

/* ── Forms ──────────────────────────────────────────────────── */
.form-group   { margin-bottom: 16px; }
.form-label   { display:block; font-size:13px; font-weight:600; margin-bottom:5px; }
.form-input, .form-select, .form-textarea {
  width: 100%; padding: 10px 13px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--font); font-size: 14px;
  color: var(--text); background: var(--surface);
  transition: border-color .18s, box-shadow .18s;
  outline: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,.12);
}
.form-textarea { resize: vertical; min-height: 88px; }

/* ── Alerts ─────────────────────────────────────────────────── */
.alert        { padding:11px 15px; border-radius:var(--radius-sm); font-size:13.5px; margin-bottom:14px; }
.alert-success{ background:var(--success-lt); color:var(--success); border:1px solid #a7f3d0; }
.alert-error  { background:var(--danger-lt);  color:var(--danger);  border:1px solid #fca5a5; }
.alert-info   { background:var(--primary-lt); color:var(--primary); border:1px solid #bfdbfe; }
.alert-warn   { background:var(--warning-lt); color:var(--warning); border:1px solid #fde68a; }

/* ── Page header ─────────────────────────────────────────────── */
.page-hdr       { margin-bottom: 24px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; }
.page-title     { font-size:20px; font-weight:700; }
.page-subtitle  { font-size:13px; color:var(--text-muted); margin-top:2px; }

/* ── Stat cards grid ────────────────────────────────────────── */
.stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:14px; margin-bottom:22px; }
.stat-card  { background:var(--surface); border-radius:var(--radius); border:1px solid var(--border);
              box-shadow:var(--shadow-sm); padding:18px 16px; }
.stat-val   { font-size:30px; font-weight:800; line-height:1; margin-bottom:4px; }
.stat-lbl   { font-size:12px; color:var(--text-muted); font-weight:500; }

/* ── Code block ─────────────────────────────────────────────── */
.code-block { background:#1e293b; color:#e2e8f0; border-radius:var(--radius-sm);
              padding:12px 14px; font-family:var(--mono); font-size:11.5px;
              line-height:1.7; word-break:break-all; }

/* ── Scrollbar ─────────────────────────────────────────────── */
::-webkit-scrollbar       { width:6px; height:6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius:99px; }

/* ── Responsive ─────────────────────────────────────────────── */
@media(max-width:768px) {
  .main-content { margin-left:0; padding:16px; }
}
