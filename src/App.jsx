import { useState, useEffect } from "react";

const ALL_SUBJECTS = ["Telugu","Hindi","English","Maths","Science","Social"];
const SCHOOLS = [
  { id:"SCH001", name:"ZP HS Nalgonda",    mandal:"Nalgonda",    hmName:"K. Ramaiah",    hmUser:"hm001", hmPass:"pass123" },
  { id:"SCH002", name:"ZP HS Suryapet",    mandal:"Suryapet",    hmName:"M. Laxmi Devi", hmUser:"hm002", hmPass:"pass123" },
  { id:"SCH003", name:"ZP HS Miryalaguda", mandal:"Miryalaguda", hmName:"P. Venkatesh",  hmUser:"hm003", hmPass:"pass123" },
];
function uid() { return Math.random().toString(36).slice(2,9); }
function calcPct(obtained, max) { return max > 0 ? Math.round((obtained / max) * 100) : 0; }

async function load(key, def) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : def; }
  catch { return def; }
}
async function persist(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

function useToast() {
  const [msg, setMsg] = useState("");
  function show(m) { setMsg(m); setTimeout(() => setMsg(""), 2500); }
  return [msg, show];
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#eef2fa; --card:#fff; --p:#1e40af; --p2:#1d4ed8;
  --acc:#f59e0b; --red:#ef4444; --green:#16a34a;
  --text:#0f172a; --sub:#64748b; --border:#e2e8f0;
  --sh:0 2px 16px rgba(30,64,175,.09); --r:16px;
}
body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative}

/* Login */
.lbg{min-height:100vh;background:linear-gradient(150deg,#1e3a8a,#1d4ed8 60%,#1e40af);display:flex;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden}
.lbg::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 75% 15%,rgba(251,191,36,.22) 0%,transparent 55%),radial-gradient(ellipse at 15% 85%,rgba(96,165,250,.18) 0%,transparent 55%);pointer-events:none}
.lcard{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.18);border-radius:28px;padding:36px 26px;width:100%;backdrop-filter:blur(18px);position:relative;z-index:1}
.logo{width:70px;height:70px;background:var(--acc);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 18px;box-shadow:0 8px 28px rgba(245,158,11,.45)}
.ltitle{font-size:23px;font-weight:800;color:#fff;text-align:center}
.lsub{color:rgba(255,255,255,.5);text-align:center;font-size:13px;margin:5px 0 24px}
.fld{margin-bottom:13px}
.fld label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,.6);margin-bottom:5px;letter-spacing:.6px;text-transform:uppercase}
.fld input,.fld select{width:100%;padding:13px 15px;background:rgba(255,255,255,.10);border:1.5px solid rgba(255,255,255,.18);border-radius:13px;color:#fff;font-size:15px;outline:none;font-family:'Sora',sans-serif}
.fld input::placeholder{color:rgba(255,255,255,.3)}
.fld input:focus,.fld select:focus{border-color:var(--acc)}
.fld select option{background:#1e3a8a}
.lbtn{width:100%;padding:15px;background:linear-gradient(135deg,var(--acc),#d97706);border:none;border-radius:14px;color:#fff;font-size:16px;font-weight:800;cursor:pointer;margin-top:8px;font-family:'Sora',sans-serif}
.lerr{color:#fca5a5;font-size:13px;text-align:center;margin-top:11px;font-weight:600}

/* Header */
.hdr{background:linear-gradient(135deg,var(--p),#1e3a8a);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
.hdr-l{display:flex;align-items:center;gap:10px}
.hdr-title{font-size:16px;font-weight:800;color:#fff;line-height:1.1}
.hdr-sub{font-size:11px;color:rgba(255,255,255,.55)}
.hbtn{background:rgba(255,255,255,.14);border:none;border-radius:10px;color:rgba(255,255,255,.85);padding:8px 13px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif}

/* Layout */
.page{padding:14px;padding-bottom:84px}
.sec{font-size:11px;font-weight:800;color:var(--sub);letter-spacing:.8px;text-transform:uppercase;margin:14px 0 8px}
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}

/* Dashboard stat tiles */
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.dash-tile{background:var(--card);border-radius:18px;box-shadow:var(--sh);padding:20px 16px;cursor:pointer;transition:transform .15s,box-shadow .15s;position:relative;overflow:hidden}
.dash-tile:active{transform:scale(.97)}
.dash-tile::before{content:'';position:absolute;right:-10px;top:-10px;width:70px;height:70px;border-radius:50%;opacity:.07}
.dash-tile.blue::before{background:var(--p)}
.dash-tile.amber::before{background:var(--acc)}
.dash-tile.green::before{background:var(--green)}
.tile-icon{font-size:26px;margin-bottom:8px}
.tile-num{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:700;line-height:1;color:var(--p)}
.tile-num.amber{color:#b45309}
.tile-num.green{color:var(--green)}
.tile-lbl{font-size:12px;font-weight:700;color:var(--sub);margin-top:4px}
.tile-hint{font-size:10px;color:#94a3b8;margin-top:2px}
.avg-tile{background:var(--card);border-radius:18px;box-shadow:var(--sh);padding:18px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.avg-left{}
.avg-lbl{font-size:12px;font-weight:700;color:var(--sub)}
.avg-num{font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700;color:var(--p);line-height:1.1}
.pbar-wrap{height:8px;background:var(--border);border-radius:99px;overflow:hidden;margin-top:10px}
.pbar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--p),var(--p2));transition:width .6s}

/* Nav */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid var(--border);display:flex;padding:8px 0 14px;z-index:180}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 0}
.bni-icon{font-size:20px}
.bni-lbl{font-size:10px;font-weight:700;letter-spacing:.3px}

/* FAB */
.fab{position:fixed;bottom:76px;right:calc(50% - 215px + 14px);width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--p2));border:none;color:#fff;font-size:26px;cursor:pointer;box-shadow:0 6px 20px rgba(30,64,175,.38);display:flex;align-items:center;justify-content:center;z-index:150}

/* Modal sheet */
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:300;display:flex;align-items:flex-end;justify-content:center;animation:fIn .2s}
@keyframes fIn{from{opacity:0}to{opacity:1}}
.sheet{background:#fff;border-radius:24px 24px 0 0;padding:22px 18px 36px;width:100%;max-width:430px;max-height:92vh;overflow-y:auto;animation:sUp .25s cubic-bezier(.32,.72,0,1)}
@keyframes sUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
.sh-title{font-size:17px;font-weight:800;color:var(--text);margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
.sh-close{background:var(--bg);border:none;border-radius:9px;padding:6px 11px;font-size:13px;cursor:pointer;font-weight:700;color:var(--sub);font-family:'Sora',sans-serif}

/* Light form fields */
.lf{margin-bottom:13px}
.lf label{display:block;font-size:11px;font-weight:700;color:var(--sub);margin-bottom:5px;letter-spacing:.5px;text-transform:uppercase}
.lf input,.lf select{width:100%;padding:12px 13px;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;font-size:15px;outline:none;color:var(--text);font-family:'Sora',sans-serif}
.lf input:focus,.lf select:focus{border-color:var(--p);background:#fff}

/* Subject max marks row in modal */
.subj-max-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);gap:10px}
.subj-max-row:last-child{border-bottom:none}
.subj-check{display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;font-size:14px;font-weight:600;color:var(--sub);user-select:none}
.subj-check.on{color:var(--p)}
.chk-box{width:20px;height:20px;border-radius:6px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;transition:all .15s}
.chk-box.on{background:var(--p);border-color:var(--p);color:#fff}
.max-inp{width:64px;padding:8px;text-align:center;border:1.5px solid var(--border);border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;color:var(--p);background:var(--bg);outline:none}
.max-inp:focus{border-color:var(--acc);background:#fffbeb}
.max-inp:disabled{opacity:.3;cursor:not-allowed}

/* Primary / danger btns */
.pbtn{width:100%;padding:15px;background:linear-gradient(135deg,var(--p),var(--p2));border:none;border-radius:14px;color:#fff;font-size:15px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;margin-top:6px}
.pbtn:disabled{opacity:.45;cursor:not-allowed}
.dbtn{background:linear-gradient(135deg,var(--red),#b91c1c)!important}
.gbtn{background:linear-gradient(135deg,var(--green),#15803d)!important}
.btn-row{display:flex;gap:8px;margin-top:6px}
.btn-row .pbtn{margin-top:0}

/* Back */
.back{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--p);font-size:14px;font-weight:700;cursor:pointer;padding:12px 14px 4px;font-family:'Sora',sans-serif}

/* List rows */
.lrow{display:flex;align-items:center;padding:13px 15px;border-bottom:1px solid var(--border);gap:8px}
.lrow:last-child{border-bottom:none}
.lrow-info{flex:1}
.lrow-name{font-size:15px;font-weight:700;color:var(--text)}
.lrow-sub{font-size:12px;color:var(--sub);margin-top:1px}
.icon-btn{background:none;border:none;font-size:17px;cursor:pointer;padding:5px;border-radius:8px}

/* Slip test card */
.st-card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);padding:15px;margin-bottom:10px}
.st-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.st-name{font-size:16px;font-weight:800;color:var(--text)}
.st-date{font-size:11px;color:var(--sub);margin-top:2px}
.st-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px}
.st-tag{background:#eff6ff;color:var(--p);font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px}
.st-foot{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--sub)}

/* Mark entry — VERTICAL list */
.me-student-card{background:var(--card);border-radius:14px;box-shadow:var(--sh);margin-bottom:10px;overflow:hidden}
.me-stu-header{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#f8faff;border-bottom:1px solid var(--border);cursor:pointer}
.me-stu-name{font-size:15px;font-weight:800;color:var(--text)}
.me-stu-meta{font-size:12px;color:var(--sub)}
.me-stu-badge{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;padding:4px 10px;border-radius:20px;color:#fff}
.me-body{padding:12px 15px}
.me-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)}
.me-row:last-child{border-bottom:none}
.me-subj{font-size:13px;font-weight:700;color:var(--text);flex:1}
.me-max{font-size:11px;color:var(--sub);width:36px;text-align:center}
.me-inp{width:60px;padding:7px;text-align:center;border:2px solid var(--border);border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;color:var(--p);background:var(--bg);outline:none}
.me-inp:focus{border-color:var(--acc);background:#fffbeb}
.me-inp:disabled{opacity:.35;background:#f8faff}
.absent-toggle{display:flex;align-items:center;gap:6px;padding:8px 0;margin-bottom:4px}
.abs-btn{padding:7px 14px;border-radius:10px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;background:var(--bg);color:var(--sub)}
.abs-btn.on{border-color:var(--red);background:#fef2f2;color:var(--red)}
.pf-row{display:flex;gap:8px;margin-top:8px}
.pf-btn{flex:1;padding:9px;border-radius:11px;border:2px solid var(--border);font-size:13px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;background:var(--bg);color:var(--sub)}
.pf-btn.pass{border-color:var(--green);background:#f0fdf4;color:var(--green)}
.pf-btn.fail{border-color:var(--red);background:#fef2f2;color:var(--red)}

/* Toast */
.toast{position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:11px 22px;border-radius:13px;font-size:13px;font-weight:700;z-index:500;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.22);animation:tIn .3s,tOut .3s 2.1s forwards}
@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes tOut{to{opacity:0;pointer-events:none}}

/* Empty */
.empty{text-align:center;padding:40px 20px;color:var(--sub)}
.empty-icon{font-size:42px;margin-bottom:8px}
.empty-txt{font-size:14px;font-weight:700}
.empty-hint{font-size:12px;margin-top:3px;color:#94a3b8}

/* Dashboard detail views */
.detail-header{background:linear-gradient(135deg,var(--p),#1e3a8a);padding:16px;margin-bottom:14px}
.detail-title{font-size:17px;font-weight:800;color:#fff}
.detail-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:2px}
.info-row{display:flex;justify-content:space-between;padding:11px 15px;border-bottom:1px solid var(--border);font-size:14px}
.info-row:last-child{border-bottom:none}
.info-lbl{color:var(--sub);font-weight:600}
.info-val{font-weight:700;color:var(--text)}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:800;color:#fff}
.pass-badge{background:var(--green)}
.fail-badge{background:var(--red)}
.abs-badge{background:#94a3b8}

/* Clickable st row in dash */
.clickable-row{cursor:pointer;transition:background .15s}
.clickable-row:active{background:var(--bg)}
`;

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [schId, setSchId] = useState(SCHOOLS[0].id);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  function go() {
    const s = SCHOOLS.find(x => x.id === schId);
    if (s && s.hmUser === user && s.hmPass === pass) onLogin({ school: s });
    else setErr("Wrong credentials. Demo: hm001 / pass123");
  }
  return (
    <div className="lbg">
      <div className="lcard">
        <div className="logo">📋</div>
        <div className="ltitle">Slip Test Manager</div>
        <div className="lsub">10th Class · HM Portal</div>
        <div className="fld">
          <label>Select School</label>
          <select value={schId} onChange={e => setSchId(e.target.value)}>
            {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="fld">
          <label>Username</label>
          <input placeholder="e.g. hm001" value={user} onChange={e => setUser(e.target.value)} />
        </div>
        <div className="fld">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} />
        </div>
        <button className="lbtn" onClick={go}>Login →</button>
        {err && <div className="lerr">⚠ {err}</div>}
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "rgba(255,255,255,.3)" }}>
          hm001 / pass123 &nbsp;·&nbsp; hm002 / pass123 &nbsp;·&nbsp; hm003 / pass123
        </div>
      </div>
    </div>
  );
}

// ─── Slip Test Modal ──────────────────────────────────────────────────────────
function SlipTestModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  // subjects: [{ subj, maxMarks }]
  const [subjects, setSubjects] = useState(
    initial?.subjects || ALL_SUBJECTS.map(s => ({ subj: s, selected: false, maxMarks: "" }))
  );
  function toggleSubj(i) {
    setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, selected: !s.selected } : s));
  }
  function setMax(i, val) {
    setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, maxMarks: val } : s));
  }
  const selected = subjects.filter(s => s.selected);
  const valid = name.trim() && selected.length > 0 && selected.every(s => s.maxMarks !== "" && Number(s.maxMarks) > 0);

  function save() {
    if (!valid) return;
    onSave({ name: name.trim(), date, subjects: subjects.filter(s => s.selected).map(s => ({ subj: s.subj, maxMarks: Number(s.maxMarks) })) });
  }
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sh-title">{initial ? "Edit Slip Test" : "New Slip Test"}<button className="sh-close" onClick={onClose}>✕</button></div>
        <div className="lf"><label>Test Name</label><input placeholder="e.g. ST-1, Unit Test 2…" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="lf"><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="lf">
          <label>Subjects & Max Marks</label>
          {subjects.map((s, i) => (
            <div className="subj-max-row" key={s.subj}>
              <div className={`subj-check ${s.selected ? "on" : ""}`} onClick={() => toggleSubj(i)}>
                <div className={`chk-box ${s.selected ? "on" : ""}`}>{s.selected ? "✓" : ""}</div>
                {s.subj}
              </div>
              <input className="max-inp" type="number" min="1" placeholder="Max" disabled={!s.selected}
                value={s.maxMarks} onChange={e => setMax(i, e.target.value)} />
            </div>
          ))}
        </div>
        <button className="pbtn" onClick={save} disabled={!valid}>
          {!name.trim() ? "Enter test name" : selected.length === 0 ? "Select at least 1 subject" : !selected.every(s => s.maxMarks) ? "Enter max marks for all subjects" : "💾 Save Slip Test"}
        </button>
      </div>
    </div>
  );
}

// ─── Student Modal ────────────────────────────────────────────────────────────
function StudentModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [roll, setRoll] = useState(initial?.rollNo || "");
  const [gender, setGender] = useState(initial?.gender || "Male");
  function save() { if (!name.trim() || !roll.trim()) return; onSave({ name: name.trim(), rollNo: roll.trim(), gender }); }
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sh-title">{initial ? "Edit Student" : "Add Student"}<button className="sh-close" onClick={onClose}>✕</button></div>
        <div className="lf"><label>Full Name</label><input placeholder="Student full name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="lf"><label>Roll Number</label><input placeholder="e.g. 101" value={roll} onChange={e => setRoll(e.target.value)} /></div>
        <div className="lf"><label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <button className="pbtn" onClick={save}>💾 Save Student</button>
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function Confirm({ title, msg, onConfirm, onClose }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sh-title">{title}<button className="sh-close" onClick={onClose}>✕</button></div>
        <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 18 }}>{msg}</p>
        <div className="btn-row">
          <button className="pbtn" style={{ background: "var(--bg)", color: "var(--sub)" }} onClick={onClose}>Cancel</button>
          <button className="pbtn dbtn" onClick={onConfirm}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Mark Entry (vertical, one card per student) ──────────────────────────────
function MarkEntry({ school, slipTest, students, marks, onMarkChange, onBack, toast, showToast }) {
  // marks[studentId] = { absent: bool, pass: bool|null, scores: {subj: value} }
  const [expanded, setExpanded] = useState(students[0]?.id || null);

  function getEntry(sid) {
    return marks[sid] || { absent: false, pass: null, scores: {} };
  }
  function update(sid, patch) {
    onMarkChange(sid, { ...getEntry(sid), ...patch });
  }
  function setScore(sid, subj, val) {
    const e = getEntry(sid);
    update(sid, { scores: { ...e.scores, [subj]: val } });
  }
  function getTotalObtained(sid) {
    const e = getEntry(sid);
    return slipTest.subjects.reduce((a, s) => {
      const v = e.scores?.[s.subj]; return a + (v !== "" && v !== undefined ? Number(v) : 0);
    }, 0);
  }
  function getTotalMax() {
    return slipTest.subjects.reduce((a, s) => a + s.maxMarks, 0);
  }

  if (students.length === 0) return (
    <div className="app">
      <div className="hdr"><div className="hdr-l"><span style={{ fontSize: 20 }}>📝</span><div><div className="hdr-title">{slipTest.name}</div></div></div></div>
      <button className="back" onClick={onBack}>← Back</button>
      <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students — add students first</div></div>
    </div>
  );

  const totalMax = getTotalMax();
  const saved = students.filter(s => { const e = getEntry(s.id); return e.absent || e.pass !== null || Object.keys(e.scores || {}).length > 0; }).length;

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-l">
          <span style={{ fontSize: 20 }}>📝</span>
          <div><div className="hdr-title">{slipTest.name}</div><div className="hdr-sub">{school.name} · {slipTest.subjects.length} subjects · Max {totalMax}</div></div>
        </div>
      </div>
      <button className="back" onClick={onBack}>← Back</button>

      <div className="page" style={{ paddingTop: 0 }}>
        <div style={{ fontSize: 12, color: "var(--sub)", marginBottom: 10, fontWeight: 600 }}>
          {saved}/{students.length} students filled
        </div>

        {students.map(s => {
          const e = getEntry(s.id);
          const obtained = getTotalObtained(s.id);
          const pct = e.absent ? null : totalMax > 0 ? calcPct(obtained, totalMax) : null;
          const isOpen = expanded === s.id;

          return (
            <div className="me-student-card" key={s.id}>
              <div className="me-stu-header" onClick={() => setExpanded(isOpen ? null : s.id)}>
                <div>
                  <div className="me-stu-name">{s.rollNo}. {s.name}</div>
                  <div className="me-stu-meta">{s.gender} &nbsp;·&nbsp; {isOpen ? "tap to collapse" : "tap to expand"}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {e.absent && <span className="badge abs-badge">Absent</span>}
                  {!e.absent && e.pass === true && <span className="badge pass-badge">Pass</span>}
                  {!e.absent && e.pass === false && <span className="badge fail-badge">Fail</span>}
                  {!e.absent && pct !== null && (
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: "var(--p)" }}>{obtained}/{totalMax}</span>
                  )}
                  <span style={{ color: "var(--sub)", fontSize: 16 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>

              {isOpen && (
                <div className="me-body">
                  {/* Absent toggle */}
                  <div className="absent-toggle">
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sub)" }}>Status:</span>
                    <button className={`abs-btn ${e.absent ? "on" : ""}`}
                      onClick={() => update(s.id, { absent: !e.absent, scores: {}, pass: null })}>
                      {e.absent ? "✓ Absent" : "Mark Absent"}
                    </button>
                  </div>

                  {/* Marks per subject */}
                  {!e.absent && slipTest.subjects.map(sub => (
                    <div className="me-row" key={sub.subj}>
                      <div className="me-subj">{sub.subj}</div>
                      <div className="me-max">/{sub.maxMarks}</div>
                      <input className="me-inp" type="number" min="0" max={sub.maxMarks}
                        placeholder="—" value={e.scores?.[sub.subj] ?? ""}
                        onChange={ev => {
                          const v = ev.target.value === "" ? "" : Math.min(sub.maxMarks, Math.max(0, Number(ev.target.value)));
                          setScore(s.id, sub.subj, v);
                        }} />
                    </div>
                  ))}

                  {/* Pass / Fail */}
                  {!e.absent && (
                    <div className="pf-row">
                      <button className={`pf-btn ${e.pass === true ? "pass" : ""}`}
                        onClick={() => update(s.id, { pass: e.pass === true ? null : true })}>✓ Pass</button>
                      <button className={`pf-btn ${e.pass === false ? "fail" : ""}`}
                        onClick={() => update(s.id, { pass: e.pass === false ? null : false })}>✗ Fail</button>
                    </div>
                  )}

                  <button className="pbtn gbtn" style={{ marginTop: 10, padding: "10px", fontSize: 13 }}
                    onClick={() => { setExpanded(null); showToast("✅ Saved — " + s.name); }}>
                    ✓ Done with this student
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
// view: null | "tests" | {test} | "students" | {student}
function Dashboard({ school, students, slipTests, allMarks }) {
  const [view, setView] = useState(null);
  const [subView, setSubView] = useState(null); // clicked test or student

  // aggregate stats
  const totalTests = slipTests.length;
  const totalStudents = students.length;

  // overall avg % across all tests, all students
  let grandObtained = 0, grandMax = 0;
  slipTests.forEach(st => {
    const stMarks = allMarks[st.id] || {};
    const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
    students.forEach(s => {
      const e = stMarks[s.id];
      if (!e || e.absent) return;
      grandMax += stMax;
      st.subjects.forEach(sub => {
        const v = e.scores?.[sub.subj];
        if (v !== "" && v !== undefined) grandObtained += Number(v);
      });
    });
  });
  const overallAvg = grandMax > 0 ? calcPct(grandObtained, grandMax) : null;

  // ── View: Tests list ──
  if (view === "tests" && !subView) {
    return (
      <div>
        <button className="back" onClick={() => setView(null)}>← Dashboard</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div className="sec">All Slip Tests ({totalTests})</div>
          {slipTests.length === 0 && <div className="empty"><div className="empty-icon">📋</div><div className="empty-txt">No slip tests yet</div></div>}
          {slipTests.map(st => {
            const stMarks = allMarks[st.id] || {};
            const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
            let tot = 0, mx = 0, pass = 0, fail = 0, absent = 0;
            students.forEach(s => {
              const e = stMarks[s.id];
              if (!e) return;
              if (e.absent) { absent++; return; }
              if (e.pass === true) pass++;
              if (e.pass === false) fail++;
              mx += stMax;
              st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); });
            });
            const avg = mx > 0 ? calcPct(tot, mx) : null;
            return (
              <div className="st-card clickable-row" key={st.id} onClick={() => setSubView(st)}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date} · Max {stMax}/subject group</div></div>
                  {avg !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 18, color: "var(--p)" }}>{avg}%</span>}
                </div>
                <div className="st-tags">{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj} ({s.maxMarks})</span>)}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--sub)" }}>
                  <span>✓ Pass: <b style={{ color: "var(--green)" }}>{pass}</b></span>
                  <span>✗ Fail: <b style={{ color: "var(--red)" }}>{fail}</b></span>
                  <span>Absent: <b>{absent}</b></span>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Tap to see student marks →</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── View: One test → student marks ──
  if (view === "tests" && subView) {
    const st = subView;
    const stMarks = allMarks[st.id] || {};
    const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
    return (
      <div>
        <button className="back" onClick={() => setSubView(null)}>← {st.name} — back to tests</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ background: "var(--card)", borderRadius: "var(--r)", boxShadow: "var(--sh)", marginBottom: 12, padding: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{st.name}</div>
            <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 2 }}>📅 {st.date}</div>
            <div className="st-tags" style={{ marginTop: 8 }}>{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj}: {s.maxMarks}</span>)}</div>
          </div>
          <div className="sec">Students ({students.length})</div>
          {students.length === 0 && <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students</div></div>}
          <div className="card">
            {students.map(s => {
              const e = stMarks[s.id];
              const obtained = e && !e.absent ? st.subjects.reduce((a, sub) => { const v = e.scores?.[sub.subj]; return a + (v !== "" && v !== undefined ? Number(v) : 0); }, 0) : null;
              return (
                <div key={s.id} style={{ padding: "12px 15px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{s.rollNo}. {s.name}</div>
                      <div style={{ fontSize: 11, color: "var(--sub)" }}>{s.gender}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {e?.absent && <span className="badge abs-badge">Absent</span>}
                      {!e?.absent && e?.pass === true && <span className="badge pass-badge">Pass</span>}
                      {!e?.absent && e?.pass === false && <span className="badge fail-badge">Fail</span>}
                      {obtained !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: "var(--p)" }}>{obtained}/{stMax}</span>}
                      {!e && <span style={{ fontSize: 12, color: "#94a3b8" }}>Not entered</span>}
                    </div>
                  </div>
                  {e && !e.absent && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {st.subjects.map(sub => {
                        const v = e.scores?.[sub.subj];
                        return (
                          <span key={sub.subj} style={{ background: "var(--bg)", borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>
                            {sub.subj}: <span style={{ color: "var(--p)", fontFamily: "'JetBrains Mono',monospace" }}>{v !== "" && v !== undefined ? v : "—"}/{sub.maxMarks}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── View: Students list ──
  if (view === "students" && !subView) {
    return (
      <div>
        <button className="back" onClick={() => setView(null)}>← Dashboard</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div className="sec">Students ({totalStudents})</div>
          {students.length === 0 && <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students yet</div></div>}
          <div className="card">
            {students.map(s => {
              // overall marks across all tests
              let tot = 0, mx = 0, absent = 0;
              slipTests.forEach(st => {
                const e = (allMarks[st.id] || {})[s.id];
                if (!e) return;
                if (e.absent) { absent++; return; }
                const stMax = st.subjects.reduce((a, sub) => a + sub.maxMarks, 0);
                mx += stMax;
                st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); });
              });
              const avg = mx > 0 ? calcPct(tot, mx) : null;
              return (
                <div className="lrow clickable-row" key={s.id} onClick={() => setSubView(s)}>
                  <div className="lrow-info">
                    <div className="lrow-name">{s.rollNo}. {s.name}</div>
                    <div className="lrow-sub">{s.gender} · {absent > 0 ? `Absent in ${absent} test(s)` : `${slipTests.length} tests`}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {avg !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "var(--p)" }}>{avg}%</span>}
                    <span style={{ color: "var(--sub)", fontSize: 16 }}>›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── View: One student → all slip tests with marks ──
  if (view === "students" && subView) {
    const s = subView;
    return (
      <div>
        <button className="back" onClick={() => setSubView(null)}>← {s.name} — back to students</button>
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ background: "var(--card)", borderRadius: "var(--r)", boxShadow: "var(--sh)", padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 2 }}>Roll: {s.rollNo} · {s.gender}</div>
          </div>
          <div className="sec">Slip Test Results</div>
          {slipTests.length === 0 && <div className="empty"><div className="empty-icon">📋</div><div className="empty-txt">No slip tests</div></div>}
          {slipTests.map(st => {
            const e = (allMarks[st.id] || {})[s.id];
            const stMax = st.subjects.reduce((a, sub) => a + sub.maxMarks, 0);
            const obtained = e && !e.absent ? st.subjects.reduce((a, sub) => { const v = e.scores?.[sub.subj]; return a + (v !== "" && v !== undefined ? Number(v) : 0); }, 0) : null;
            return (
              <div className="st-card" key={st.id} style={{ cursor: "default" }}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {e?.absent && <span className="badge abs-badge">Absent</span>}
                    {!e?.absent && e?.pass === true && <span className="badge pass-badge">Pass</span>}
                    {!e?.absent && e?.pass === false && <span className="badge fail-badge">Fail</span>}
                    {obtained !== null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 17, color: "var(--p)" }}>{obtained}/{stMax}</span>}
                    {!e && <span style={{ fontSize: 12, color: "#94a3b8" }}>Not entered</span>}
                  </div>
                </div>
                {e && !e.absent && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {st.subjects.map(sub => {
                      const v = e.scores?.[sub.subj];
                      return (
                        <span key={sub.subj} style={{ background: "var(--bg)", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
                          {sub.subj}: <span style={{ color: "var(--p)", fontFamily: "'JetBrains Mono',monospace" }}>{v !== "" && v !== undefined ? v : "—"}/{sub.maxMarks}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Default: Dashboard home ──
  return (
    <div style={{ padding: 14, paddingBottom: 84 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "var(--sub)", fontWeight: 700, marginBottom: 2 }}>Welcome,</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{school.hmName}</div>
        <div style={{ fontSize: 12, color: "var(--sub)" }}>{school.name} · {school.mandal}</div>
      </div>

      {/* Avg tile full width */}
      <div className="avg-tile">
        <div className="avg-left">
          <div className="avg-lbl">Overall Average</div>
          <div className="avg-num" style={{ color: overallAvg !== null ? "var(--p)" : "var(--sub)" }}>
            {overallAvg !== null ? overallAvg + "%" : "—"}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>across all tests & students</div>
        </div>
        <span style={{ fontSize: 36 }}>📊</span>
      </div>
      {overallAvg !== null && (
        <div style={{ margin: "-4px 0 14px" }}>
          <div className="pbar-wrap"><div className="pbar-fill" style={{ width: overallAvg + "%" }} /></div>
        </div>
      )}

      {/* Two tiles */}
      <div className="dash-grid">
        <div className="dash-tile blue" onClick={() => { setView("tests"); setSubView(null); }}>
          <div className="tile-icon">📋</div>
          <div className="tile-num">{totalTests}</div>
          <div className="tile-lbl">Slip Tests</div>
          <div className="tile-hint">Tap to view all →</div>
        </div>
        <div className="dash-tile amber" onClick={() => { setView("students"); setSubView(null); }}>
          <div className="tile-icon">👥</div>
          <div className="tile-num amber">{totalStudents}</div>
          <div className="tile-lbl">Students</div>
          <div className="tile-hint">Tap to view all →</div>
        </div>
      </div>

      {/* Recent tests quick preview */}
      {slipTests.length > 0 && (
        <>
          <div className="sec">Recent Tests</div>
          {slipTests.slice(-3).reverse().map(st => {
            const stMarks = allMarks[st.id] || {};
            const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
            let tot = 0, mx = 0, pass = 0;
            students.forEach(s => {
              const e = stMarks[s.id]; if (!e || e.absent) return;
              if (e.pass === true) pass++;
              mx += stMax;
              st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); });
            });
            const avg = mx > 0 ? calcPct(tot, mx) : null;
            return (
              <div className="st-card clickable-row" key={st.id} onClick={() => { setView("tests"); setSubView(st); }}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  {avg !== null ? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 17, color: "var(--p)" }}>{avg}%</span>
                    : <span style={{ fontSize: 12, color: "#94a3b8" }}>No marks</span>}
                </div>
                <div className="st-tags">{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj}</span>)}</div>
                <div style={{ fontSize: 12, color: "var(--sub)" }}>Pass: {pass} &nbsp;·&nbsp; Tap to view marks →</div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── HM App ───────────────────────────────────────────────────────────────────
function HMApp({ session, onLogout }) {
  const school = session.school;
  const [tab, setTab] = useState("dash");
  const [students, setStudents] = useState([]);
  const [slipTests, setSlipTests] = useState([]);
  // allMarks[slipTestId][studentId] = { absent, pass, scores:{subj:val} }
  const [allMarks, setAllMarks] = useState({});
  const [toast, showToast] = useToast();

  const [stuModal, setStuModal] = useState(null);
  const [stModal, setStModal] = useState(null);
  const [markView, setMarkView] = useState(null);
  const [delStu, setDelStu] = useState(null);
  const [delST, setDelST] = useState(null);

  const SK = k => `${school.id}_${k}`;

  useEffect(() => {
    (async () => {
      setStudents(await load(SK("students"), []));
      setSlipTests(await load(SK("sliptests"), []));
      setAllMarks(await load(SK("marks"), {}));
    })();
  }, [school.id]);

  async function saveStudents(s) { setStudents(s); await persist(SK("students"), s); }
  async function saveSlipTests(s) { setSlipTests(s); await persist(SK("sliptests"), s); }
  async function saveAllMarks(m) { setAllMarks(m); await persist(SK("marks"), m); }

  function addStudent(data) { saveStudents([...students, { id: uid(), ...data }]); setStuModal(null); showToast("✅ Student added!"); }
  function editStudent(data) { saveStudents(students.map(s => s.id === stuModal.id ? { ...s, ...data } : s)); setStuModal(null); showToast("✅ Updated!"); }
  function deleteStudent(id) { saveStudents(students.filter(s => s.id !== id)); setDelStu(null); showToast("🗑 Removed"); }

  function addST(data) { saveSlipTests([...slipTests, { id: uid(), ...data }]); setStModal(null); showToast("✅ Slip test created!"); }
  function editST(data) {
    saveSlipTests(slipTests.map(st => st.id === stModal.id ? { ...st, ...data } : st));
    setStModal(null); showToast("✅ Updated!");
  }
  function deleteST(id) {
    const m = { ...allMarks }; delete m[id];
    saveSlipTests(slipTests.filter(st => st.id !== id)); saveAllMarks(m); setDelST(null); showToast("🗑 Deleted");
  }

  function handleMarkChange(stId, sid, entry) {
    const m = { ...allMarks, [stId]: { ...allMarks[stId], [sid]: entry } };
    saveAllMarks(m);
  }

  // If in mark entry view
  if (markView) {
    const st = slipTests.find(x => x.id === markView) || slipTests[0];
    if (!st) { setMarkView(null); return null; }
    return (
      <MarkEntry school={school} slipTest={st} students={students}
        marks={allMarks[st.id] || {}}
        onMarkChange={(sid, entry) => handleMarkChange(st.id, sid, entry)}
        onBack={() => setMarkView(null)} toast={toast} showToast={showToast} />
    );
  }

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-l">
          <span style={{ fontSize: 20 }}>🏫</span>
          <div><div className="hdr-title">{school.name}</div><div className="hdr-sub">{school.hmName}</div></div>
        </div>
        <button className="hbtn" onClick={onLogout}>Logout</button>
      </div>

      {/* Dashboard tab */}
      {tab === "dash" && (
        <Dashboard school={school} students={students} slipTests={slipTests} allMarks={allMarks} />
      )}

      {/* Slip Tests tab */}
      {tab === "tests" && (
        <div className="page">
          <div className="sec">Slip Tests</div>
          {slipTests.length === 0 && <div className="empty"><div className="empty-icon">📋</div><div className="empty-txt">No slip tests yet</div><div className="empty-hint">Tap + to create one</div></div>}
          {slipTests.map(st => {
            const stMarks = allMarks[st.id] || {};
            const stMax = st.subjects.reduce((a, s) => a + s.maxMarks, 0);
            let tot = 0, mx = 0, pass = 0, fail = 0, absent = 0;
            students.forEach(s => {
              const e = stMarks[s.id]; if (!e) return;
              if (e.absent) { absent++; return; }
              if (e.pass === true) pass++;
              if (e.pass === false) fail++;
              mx += stMax;
              st.subjects.forEach(sub => { const v = e.scores?.[sub.subj]; if (v !== "" && v !== undefined) tot += Number(v); });
            });
            const avg = mx > 0 ? calcPct(tot, mx) : null;
            return (
              <div className="st-card" key={st.id}>
                <div className="st-top">
                  <div><div className="st-name">{st.name}</div><div className="st-date">📅 {st.date}</div></div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="icon-btn" onClick={() => setStModal(st)}>✏️</button>
                    <button className="icon-btn" onClick={() => setDelST(st)}>🗑</button>
                  </div>
                </div>
                <div className="st-tags">{st.subjects.map(s => <span key={s.subj} className="st-tag">{s.subj} ({s.maxMarks})</span>)}</div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--sub)", marginBottom: 10 }}>
                  <span>✓ Pass: <b style={{ color: "var(--green)" }}>{pass}</b></span>
                  <span>✗ Fail: <b style={{ color: "var(--red)" }}>{fail}</b></span>
                  <span>Absent: <b>{absent}</b></span>
                  {avg !== null && <span>Avg: <b style={{ color: "var(--p)" }}>{avg}%</b></span>}
                </div>
                <button className="pbtn" style={{ padding: "11px", fontSize: 14 }} onClick={() => setMarkView(st.id)}>
                  ✏ Enter / Edit Marks
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Students tab */}
      {tab === "students" && (
        <div className="page">
          <div className="sec">Students — 10th Class</div>
          {students.length === 0 && <div className="empty"><div className="empty-icon">👥</div><div className="empty-txt">No students yet</div><div className="empty-hint">Tap + to add students</div></div>}
          {students.length > 0 && (
            <div className="card">
              {students.map(s => (
                <div className="lrow" key={s.id}>
                  <div className="lrow-info">
                    <div className="lrow-name">{s.rollNo}. {s.name}</div>
                    <div className="lrow-sub">{s.gender}</div>
                  </div>
                  <button className="icon-btn" onClick={() => setStuModal(s)}>✏️</button>
                  <button className="icon-btn" onClick={() => setDelStu(s)}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAB — only on tests/students tabs */}
      {tab !== "dash" && (
        <button className="fab" onClick={() => tab === "tests" ? setStModal("new") : setStuModal("new")}>＋</button>
      )}

      {/* Bottom nav */}
      <div className="bnav">
        {[
          { key: "dash", icon: "🏠", lbl: "Dashboard" },
          { key: "tests", icon: "📋", lbl: "Tests" },
          { key: "students", icon: "👥", lbl: "Students" },
        ].map(n => (
          <div className="bni" key={n.key} onClick={() => setTab(n.key)}>
            <span className="bni-icon">{n.icon}</span>
            <span className="bni-lbl" style={{ color: tab === n.key ? "var(--p)" : "var(--sub)" }}>{n.lbl}</span>
          </div>
        ))}
      </div>

      {stuModal && <StudentModal initial={stuModal === "new" ? null : stuModal} onSave={stuModal === "new" ? addStudent : editStudent} onClose={() => setStuModal(null)} />}
      {stModal && <SlipTestModal initial={stModal === "new" ? null : stModal} onSave={stModal === "new" ? addST : editST} onClose={() => setStModal(null)} />}
      {delStu && <Confirm title="Remove Student?" msg={`Remove ${delStu.name} (Roll: ${delStu.rollNo})? All their marks will still remain.`} onConfirm={() => deleteStudent(delStu.id)} onClose={() => setDelStu(null)} />}
      {delST && <Confirm title="Delete Slip Test?" msg={`Delete "${delST.name}" and all its marks? This cannot be undone.`} onConfirm={() => deleteST(delST.id)} onClose={() => setDelST(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  return (
    <>
      <style>{CSS}</style>
      {!session ? <Login onLogin={setSession} /> : <HMApp session={session} onLogout={() => setSession(null)} />}
    </>
  );
}