import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

export default function UploadStudents() {
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [drag,    setDrag]    = useState(false);

  const onDrop = e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith('.csv')) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true); setResult(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await API.post('/students/upload', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      setResult({ ok: true, data: res.data });
      setFile(null);
    } catch (err) {
      setResult({ ok: false, data: err.response?.data });
    }
    setLoading(false);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-hdr">
          <div>
            <div className="page-title">Upload Students</div>
            <div className="page-subtitle">Import student data via CSV file</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22 }}>
          {/* Left: upload */}
          <div>
            <div className="card" style={{ marginBottom:18 }}>
              <div style={S.secTitle}>Select CSV File</div>

              {/* Dropzone */}
              <div style={{ ...S.drop, borderColor: drag ? 'var(--primary)' : file ? 'var(--success)' : 'var(--border)', background: drag ? 'var(--primary-lt)' : file ? 'var(--success-lt)' : 'var(--surface2)' }}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}>
                {file ? (
                  <>
                    <div style={{ fontSize:36 }}>✅</div>
                    <div style={{ fontWeight:600, marginTop:6 }}>{file.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>{(file.size/1024).toFixed(1)} KB</div>
                    <button style={S.clearBtn} onClick={() => setFile(null)}>✕ Remove</button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:40 }}>📁</div>
                    <div style={{ fontWeight:600, marginTop:6 }}>Drop CSV here</div>
                    <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:3 }}>or click to browse</div>
                  </>
                )}
                <input type="file" accept=".csv"
                  style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }}
                  onChange={e => setFile(e.target.files[0])} />
              </div>

              <button className="btn btn-primary"
                style={{ width:'100%', justifyContent:'center', marginTop:14, padding:11 }}
                onClick={upload} disabled={!file || loading}>
                {loading ? '⏳ Uploading…' : '⬆ Upload Students'}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="card">
                {result.ok ? (
                  <>
                    <div className="alert alert-success">✅ {result.data.message}</div>
                    <div style={{ display:'flex', gap:12 }}>
                      <div style={S.resStat}><span style={{ fontSize:26, fontWeight:800, color:'var(--success)' }}>{result.data.inserted}</span><br /><span style={{ fontSize:12, color:'var(--text-muted)' }}>Inserted</span></div>
                      <div style={S.resStat}><span style={{ fontSize:26, fontWeight:800, color:'var(--danger)' }}>{result.data.errorCount}</span><br /><span style={{ fontSize:12, color:'var(--text-muted)' }}>Errors</span></div>
                    </div>
                    {result.data.errors?.length > 0 && (
                      <div style={{ marginTop:12 }}>
                        <div style={{ fontWeight:600, fontSize:12.5, color:'var(--danger)', marginBottom:7 }}>⚠ Row Errors:</div>
                        {result.data.errors.map((e, i) => <div key={i} style={{ fontSize:12, color:'var(--text-muted)', borderTop:'1px solid var(--border)', padding:'4px 0' }}>{e.error}</div>)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="alert alert-error">❌ {result.data?.error || 'Upload failed.'}</div>
                )}
              </div>
            )}
          </div>

          {/* Right: instructions */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card">
              <div style={S.secTitle}>Required CSV Format</div>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:12 }}>Your CSV must have these columns (header row required):</p>
              <div className="code-block">Serial Number,Student Name,CGPA,Attendance,Email,Contact Number,Branch</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:10, fontWeight:600 }}>Example rows:</div>
              <div className="code-block" style={{ marginTop:6 }}>
                101,Rahul Kumar,6.8,72,rahul@gmail.com,9876543210,CSE{'\n'}
                102,Anjali Reddy,4.2,55,anjali@gmail.com,9876543211,ECE{'\n'}
                103,Kiran Patel,8.1,82,kiran@gmail.com,9876543212,MECH
              </div>
            </div>

            <div className="card">
              <div style={S.secTitle}>Valid Branch Codes</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
                {['CSE','ECE','MECH','CIVIL','IT','AIDS'].map(b => (
                  <span key={b} style={{ padding:'5px 13px', background:'var(--primary-lt)', color:'var(--primary)', borderRadius:99, fontSize:13, fontWeight:700 }}>{b}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={S.secTitle}>Risk Classification Rules</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:12 }}>
                <div style={S.rule}><span className="badge badge-high">🔴 High Risk</span><span style={{ fontSize:13, color:'var(--text-2)' }}>CGPA &lt; 5 <strong>AND</strong> Attendance &lt; 60%</span></div>
                <div style={S.rule}><span className="badge badge-mod">🟡 Moderate</span><span style={{ fontSize:13, color:'var(--text-2)' }}>CGPA 5–7 <strong>OR</strong> Attendance 60–75%</span></div>
                <div style={S.rule}><span className="badge badge-safe">🟢 Safe</span><span style={{ fontSize:13, color:'var(--text-2)' }}>CGPA &gt; 7 <strong>AND</strong> Attendance &gt; 75%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  secTitle: { fontWeight:700, fontSize:14, marginBottom:10 },
  drop: { border:'2px dashed', borderRadius:12, padding:'36px 20px', textAlign:'center', cursor:'pointer', transition:'all .2s', position:'relative', display:'flex', flexDirection:'column', alignItems:'center' },
  clearBtn: { marginTop:10, padding:'5px 13px', borderRadius:6, border:'1px solid var(--border)', background:'#fff', cursor:'pointer', fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font)' },
  resStat: { flex:1, textAlign:'center', padding:12, background:'var(--surface2)', borderRadius:9 },
  rule: { display:'flex', alignItems:'center', gap:10 },
};
