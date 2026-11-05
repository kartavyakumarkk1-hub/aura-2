import React, { useEffect, useRef, useState } from "react";
import {
  Activity, BookOpen, Check, ChevronDown, Compass, Crown,
  Download, Flower2, Footprints, Heart, Home, Moon, Pencil,
  Plus, Settings, Shield, Sparkles, Star, Sun, Trophy, Upload, X
} from "lucide-react";

const THEMES = {
  Original: { bg:"#0b0b0d", panel:"#171719", accent:"#ef6572", accent2:"#ff9d68", gold:"#f8d36d", text:"#f6f3f0", muted:"#a6a1a2", line:"rgba(255,255,255,.09)" },
  Ocean:    { bg:"#071116", panel:"#10232a", accent:"#55b9cf", accent2:"#638df2", gold:"#9ce3e6", text:"#effbff", muted:"#9db7bd", line:"rgba(180,235,245,.12)" },
  Forest:   { bg:"#0a120e", panel:"#17231b", accent:"#81b879", accent2:"#c2a56b", gold:"#e1d18a", text:"#f3f8f0", muted:"#a6b2a4", line:"rgba(210,245,210,.11)" },
  Queen:    { bg:"#140d18", panel:"#24172a", accent:"#c77ce7", accent2:"#f07fa9", gold:"#f0c5dc", text:"#fff5ff", muted:"#b9a6bd", line:"rgba(245,210,255,.12)" },
  Princess: { bg:"#180f15", panel:"#291b24", accent:"#f28ab7", accent2:"#ffc18e", gold:"#ffe1a7", text:"#fff7fa", muted:"#c0aab5", line:"rgba(255,225,240,.13)" }
};

const initial = {
  aura: 93700, level: 12, xp: 2350, xpGoal: 5000, theme: "Original",
  activeTab: "Home",
  categories: [
    { id:"personality", name:"Personality", progress:50, tint:"#ef6572", tasks:[
      {id:"p1", title:"Write a daily reflection", xp:250, done:true},
      {id:"p2", title:"Be positive", xp:150, done:true},
      {id:"p3", title:"Live Minimally Today", xp:500, done:false},
      {id:"p4", title:"Do not interrupt others; instead, listen actively", xp:500, done:false}
    ]},
    { id:"body", name:"Body", progress:35, tint:"#ff9d68", tasks:[
      {id:"b1", title:"Move your body for 20 minutes", xp:250, done:false},
      {id:"b2", title:"Drink enough water", xp:150, done:true}
    ]},
    { id:"mind", name:"Mind", progress:60, tint:"#f6cf69", tasks:[
      {id:"m1", title:"Read 10 pages", xp:250, done:false},
      {id:"m2", title:"Learn something new", xp:300, done:false}
    ]},
    { id:"soul", name:"Soul", progress:25, tint:"#b69be8", tasks:[
      {id:"s1", title:"Spend a moment in stillness", xp:200, done:false},
      {id:"s2", title:"Connect with someone", xp:250, done:false}
    ]}
  ],
  habits: [{id:"h1",name:"Morning walk",xp:250,done:false},{id:"h2",name:"Read before bed",xp:150,done:true}],
  journal: [],
  quests: [{id:"q1",name:"A screen-free evening",detail:"Put your phone away for one evening.",xp:500,done:false}],
  layout: ["personality","body","mind","soul"]
};

function loadState() {
  try {
    const raw = localStorage.getItem("aura-replica-state");
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return {
      ...initial,
      ...parsed,
      categories: Array.isArray(parsed.categories) ? parsed.categories : initial.categories,
      habits: Array.isArray(parsed.habits) ? parsed.habits : initial.habits,
      quests: Array.isArray(parsed.quests) ? parsed.quests : initial.quests,
      journal: Array.isArray(parsed.journal) ? parsed.journal : initial.journal
    };
  } catch {
    return initial;
  }
}

function uid() { return Math.random().toString(36).slice(2,10); }
function App() {
  const [data, setData] = useState(loadState);
  const [tab, setTab] = useState("Home");
  const [modal, setModal] = useState("");
  const [newTask, setNewTask] = useState({ title:"", xp:250, category:"personality" });
  const [toast, setToast] = useState("");
  const importRef = useRef(null);
  const toastTimerRef = useRef(null);
  const t = THEMES[data.theme] || THEMES.Original;

  useEffect(() => {
    localStorage.setItem("aura-replica-state", JSON.stringify(data));
    document.documentElement.style.setProperty("--bg", t.bg);
    document.documentElement.style.setProperty("--panel", t.panel);
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent2", t.accent2);
    document.documentElement.style.setProperty("--gold", t.gold);
    document.documentElement.style.setProperty("--text", t.text);
    document.documentElement.style.setProperty("--muted", t.muted);
    document.documentElement.style.setProperty("--line", t.line);
  }, [data, t]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const allTasks = data.categories.flatMap(c => c.tasks || []);
  const completed = allTasks.filter(x => x.done).length;
  const total = allTasks.length;
  const todayPct = total ? Math.round(completed / total * 100) : 0;

  function notify(message) {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 2200);
  }

  function update(patch) { setData(d => ({...d, ...patch})); }

  function toggleTask(categoryId, taskId) {
    setData(d => {
      let earned = 0;
      const categories = d.categories.map(c => c.id !== categoryId ? c : {
        ...c, tasks: c.tasks.map(task => {
          if (task.id !== taskId) return task;
          const done = !task.done;
          if (done) earned = Number(task.xp) || 0;
          return {...task, done};
        })
      });
      const aura = d.aura + earned;
      const xp = d.xp + earned;
      const levelUp = xp >= d.xpGoal;
      return {...d, categories, aura, xp: levelUp ? xp - d.xpGoal : xp, level: levelUp ? d.level + 1 : d.level};
    });
    notify("Progress updated");
  }

  function addTask(e) {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const category = newTask.category;
    setData(d => ({
      ...d,
      categories: d.categories.map(c =>
        c.id === category
          ? { ...c, tasks: [...c.tasks, { id: uid(), title: newTask.title.trim(), xp: Number(newTask.xp) || 0, done: false }] }
          : c
      )
    }));
    setNewTask({ title: "", xp: 250, category });
    setModal("");
    notify("Task added");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aura-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    notify("Backup exported");
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.categories || !Array.isArray(parsed.categories)) throw new Error();
        setData({ ...initial, ...parsed });
        notify("Backup restored");
      } catch {
        notify("That backup file is not valid");
      }
    };
    reader.readAsText(file);
  }

  const nav = [
    ["Home", Home],
    ["Explore", Compass],
    ["Growth", Sparkles],
    ["Journal", BookOpen],
    ["Profile", Crown]
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Sparkles size={17}/></div><span>AURA</span></div>
        <div className="top-actions">
          <button type="button" className="icon-btn" title="Settings" onClick={() => setModal("settings")}><Settings size={18}/></button>
          <button type="button" className="level-chip" onClick={() => setTab("Profile")}><Trophy size={15}/> LEVEL {data.level}</button>
        </div>
      </header>

      <main className="main-content">
        {tab === "Home" && (
          <HomePage
            data={data}
            setData={setData}
            onToggle={toggleTask}
            onAdd={(category) => {
              setNewTask(v => ({ ...v, category: category || "personality" }));
              setModal("task");
            }}
            onTab={setTab}
            pct={todayPct}
          />
        )}
        {tab === "Explore" && <ExplorePage data={data} setData={setData} notify={notify} />}
        {tab === "Growth" && <GrowthPage />}
        {tab === "Journal" && <JournalPage data={data} setData={setData} />}
        {tab === "Profile" && (
          <ProfilePage
            data={data}
            setData={setData}
            onExport={exportData}
            onImport={() => importRef.current?.click()}
          />
        )}
      </main>

      <nav className="bottom-nav">
        {nav.map(([label, Icon]) => (
          <button
            type="button"
            key={label}
            className={`nav-item ${tab === label ? "active" : ""}`}
            onClick={() => setTab(label)}
          >
            <Icon size={19}/>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {modal === "task" && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setModal("")}>
          <form className="modal" onSubmit={addTask}>
            <div className="modal-head">
              <div><div className="eyebrow">MAKE IT COUNT</div><h2>New task</h2></div>
              <button type="button" className="icon-btn" onClick={() => setModal("")}><X/></button>
            </div>
            <label>Task name
              <input
                autoFocus
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="What will you work on?"
                required
              />
            </label>
            <div className="form-row">
              <label>Category
                <select value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}>
                  {data.categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>XP reward
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={newTask.xp}
                  onChange={e => setNewTask({ ...newTask, xp: e.target.value })}
                />
              </label>
            </div>
            <button className="primary-btn" type="submit"><Plus size={17}/> Add to my day</button>
          </form>
        </div>
      )}

      {modal === "settings" && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setModal("")}>
          <div className="modal">
            <div className="modal-head">
              <div><div className="eyebrow">MAKE IT YOURS</div><h2>Appearance</h2></div>
              <button type="button" className="icon-btn" onClick={() => setModal("")}><X/></button>
            </div>
            <p className="muted">Choose one of the five theme palettes.</p>
            <div className="theme-list">
              {Object.keys(THEMES).map(name => (
                <button
                  type="button"
                  key={name}
                  className={`theme-option ${data.theme === name ? "selected" : ""}`}
                  onClick={() => update({ theme: name })}
                >
                  <span className="theme-dots">
                    {[THEMES[name].accent, THEMES[name].accent2, THEMES[name].gold].map(c => (
                      <i key={c} style={{ background: c }}/>
                    ))}
                  </span>
                  {name}
                  {data.theme === name && <Check size={16}/>}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => { setModal(""); setTab("Profile"); }}
            >
              More settings in Profile
            </button>
          </div>
        </div>
      )}
      <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={e => importData(e.target.files?.[0])}/>
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
            }
function HomePage({ data, onToggle, onAdd, onTab }) {
  const [expanded, setExpanded] = useState("personality");
  const [showAll, setShowAll] = useState(false);
  const categories = data.categories || [];
  const allTasks = categories.flatMap(c => c.tasks || []);
  const done = allTasks.filter(x => x.done).length;
  const total = allTasks.length;
  const totalPct = total ? Math.round(done / total * 100) : 0;

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-top">
          <div className="date-label">
            {new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase()}
          </div>
          <button type="button" className="avatar-button" onClick={() => onTab("Profile")}><span>✦</span></button>
        </div>
        <div className="aura-total">{(data.aura / 1000).toFixed(1)}k <em>aura</em></div>
        <div className="hero-subtitle">A little better, every day.</div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${Math.min(100, (data.xp / data.xpGoal) * 100)}%` }}/>
        </div>
        <div className="xp-caption">
          <span>LEVEL {data.level}</span>
          <span>{data.xp.toLocaleString()} / {data.xpGoal.toLocaleString()} XP</span>
        </div>
        <div className="daily-shortcuts">
          <button type="button" onClick={() => onTab("Explore")}><Sparkles size={16}/> Habits</button>
          <button type="button" onClick={() => onTab("Explore")}><Sun size={16}/> Hobbies</button>
          <button type="button" onClick={() => onTab("Explore")}><Shield size={16}/> Vices</button>
          <button type="button" onClick={() => onAdd("personality")}><Pencil size={15}/> Custom</button>
        </div>
      </section>

      <section className="overview-card">
        <div className="section-kicker">YOUR DAILY RHYTHM <span>✦</span></div>
        <div className="overview-row">
          <div>
            <h2>Today, in balance</h2>
            <p>{done} of {total} growth tasks completed</p>
          </div>
          <div className="ring" style={{ "--progress": `${totalPct * 3.6}deg` }}>
            <strong>{totalPct}%</strong>
          </div>
        </div>
        <div className="mini-progress"><span style={{ width: `${totalPct}%` }}/></div>
      </section>

      <div className="section-heading">
        <div><div className="eyebrow">THE FOUR PILLARS</div><h1>Your growth</h1></div>
        <button type="button" className="text-button" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Collapse" : "Expand all"} <ChevronDown size={15}/>
        </button>
      </div>

      <div className="category-stack">
        {categories.map((cat) => {
          const tasks = cat.tasks || [];
          const count = tasks.filter(x => x.done).length;
          const percent = tasks.length ? Math.round(count / tasks.length * 100) : 0;
          const open = showAll || expanded === cat.id;

          return (
            <section className={`category-card ${open ? "open" : ""}`} key={cat.id}>
              <button
                type="button"
                className="category-header"
                onClick={() => setExpanded(open && !showAll ? "" : cat.id)}
              >
                <div className="category-title-wrap">
                  <span className="category-orb" style={{ "--tint": cat.tint }}><Flower2 size={17}/></span>
                  <div><h2>{cat.name}</h2><span>{count}/{tasks.length} completed</span></div>
                </div>
                <div className="category-right">
                  <div className="category-progress">
                    <span style={{ width: `${percent}%`, background: cat.tint }}/>
                  </div>
                  <strong>{percent}%</strong>
                  <ChevronDown className={open ? "rotate" : ""} size={16}/>
                </div>
              </button>
              {open && (
                <div className="task-list">
                  {tasks.map(task => (
                    <button
                      type="button"
                      key={task.id}
                      className={`task-row ${task.done ? "done" : ""}`}
                      onClick={() => onToggle(cat.id, task.id)}
                    >
                      <span className="check-circle">{task.done && <Check size={15}/>}</span>
                      <span className="task-name">{task.title}</span>
                      <span className="task-xp">{task.xp} <Star size={12} fill="currentColor"/></span>
                    </button>
                  ))}
                  <button type="button" className="add-inline" onClick={() => onAdd(cat.id)}>
                    <Plus size={15}/> Add a {cat.name.toLowerCase()} task
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <div className="bottom-note"><Sparkles size={15}/> Small steps create a life you love.</div>
    </div>
  );
                    }
function ExplorePage({ data, setData, notify }) {
  const [kind, setKind] = useState("Quests");
  const [name, setName] = useState("");
  const items = kind === "Quests" ? (data.quests || []) : (data.habits || []);

  function add() {
    if (!name.trim()) return;
    if (kind === "Quests") {
      setData(d => ({
        ...d,
        quests: [...(d.quests || []), { id: uid(), name: name.trim(), detail: "A challenge you created for yourself.", xp: 300, done: false }]
      }));
    } else {
      setData(d => ({
        ...d,
        habits: [...(d.habits || []), { id: uid(), name: name.trim(), xp: 200, done: false }]
      }));
    }
    setName("");
    notify(`${kind.slice(0, -1)} added`);
  }

  function toggle(id) {
    setData(d =>
      kind === "Quests"
        ? { ...d, quests: (d.quests || []).map(x => x.id === id ? { ...x, done: !x.done } : x) }
        : { ...d, habits: (d.habits || []).map(x => x.id === id ? { ...x, done: !x.done } : x) }
    );
  }

  return (
    <div className="sub-page">
      <div className="eyebrow">STEP OUTSIDE YOUR ROUTINE</div>
      <h1>Explore <em>more.</em></h1>
      <p className="page-lead">Make room for new experiences, small rituals and meaningful challenges.</p>
      <div className="segmented">
        <button type="button" className={kind === "Quests" ? "chosen" : ""} onClick={() => setKind("Quests")}>Side quests</button>
        <button type="button" className={kind === "Habits" ? "chosen" : ""} onClick={() => setKind("Habits")}>Habits</button>
      </div>
      <div className="feature-banner">
        <div className="banner-icon"><Compass size={28}/></div>
        <div>
          <span className="eyebrow">YOUR NEXT ADVENTURE</span>
          <h2>Make today count.</h2>
          <p>Choose one thing that moves you forward.</p>
        </div>
      </div>
      <div className="inline-create">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={kind === "Quests" ? "Name a new quest" : "Name a new habit"}
        />
        <button type="button" onClick={add}><Plus size={18}/></button>
      </div>
      <div className="list-cards">
        {items.map(x => (
          <button type="button" key={x.id} className={`list-card ${x.done ? "done" : ""}`} onClick={() => toggle(x.id)}>
            <span className="check-circle">{x.done && <Check size={15}/>}</span>
            <span className="list-card-copy">
              <b>{x.name}</b>
              <small>{x.detail || "A ritual for your better self."}</small>
            </span>
            <span className="task-xp">{x.xp} ✦</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GrowthPage() {
  const tools = [
    ["Focus", "Protect your attention", Activity],
    ["ScreenTime", "Be intentional online", Moon],
    ["Bucket List", "Dream beyond today", Star],
    ["Dumb Phone", "Make space for life", Footprints],
    ["Alarm", "Start with intention", Sun],
    ["Vision Board", "Keep your direction close", Heart],
    ["Aura Guy", "Your growth companion", Sparkles]
  ];

  return (
    <div className="sub-page">
      <div className="eyebrow">TOOLS FOR YOUR JOURNEY</div>
      <h1>Growth <em>& tools.</em></h1>
      <p className="page-lead">A collection of simple tools to support the person you're becoming.</p>
      <div className="tool-grid">
        {tools.map(([name, desc, Icon]) => (
          <div className="tool-card" key={name}>
            <span className="tool-icon"><Icon size={21}/></span>
            <b>{name}</b>
            <small>{desc}</small>
            <span className="coming">PERSONAL TOOL</span>
          </div>
        ))}
      </div>
      <p className="muted footnote">These are local-first starter surfaces. Their deeper workflows can be implemented in later iterations.</p>
    </div>
  );
}

function JournalPage({ data, setData }) {
  const [entry, setEntry] = useState("");
  const journalList = data.journal || [];

  function save() {
    if (!entry.trim()) return;
    setData(d => ({
      ...d,
      journal: [{ id: uid(), text: entry.trim(), date: new Date().toISOString() }, ...(d.journal || [])]
    }));
    setEntry("");
  }

  return (
    <div className="sub-page">
      <div className="eyebrow">PAUSE & REFLECT</div>
      <h1>Your <em>journal.</em></h1>
      <p className="page-lead">Capture the moments, thoughts and little wins you want to remember.</p>
      <div className="journal-compose">
        <label>Today's reflection</label>
        <textarea
          value={entry}
          onChange={e => setEntry(e.target.value)}
          placeholder="What felt meaningful today?"
        />
        <button type="button" className="primary-btn" onClick={save}><Plus size={16}/> Save reflection</button>
      </div>
      <div className="section-heading compact">
        <div><div className="eyebrow">YOUR NOTES</div><h2>Recent entries</h2></div>
      </div>
      {journalList.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={25}/>
          <p>Your journal starts with one honest sentence.</p>
        </div>
      ) : (
        journalList.map(x => (
          <article className="journal-entry" key={x.id}>
            <small>{new Date(x.date).toLocaleString()}</small>
            <p>{x.text}</p>
          </article>
        ))
      )}
    </div>
  );
}

function ProfilePage({ data, setData, onExport, onImport }) {
  const categories = data.categories || [];
  const allTasks = categories.flatMap(c => c.tasks || []);
  const done = allTasks.filter(x => x.done).length;
  const total = allTasks.length;

  return (
    <div className="sub-page">
      <div className="eyebrow">YOUR JOURNEY SO FAR</div>
      <h1>Your <em>profile.</em></h1>
      <div className="profile-hero">
        <div className="profile-avatar"><Crown size={31}/></div>
        <div>
          <h2>Becoming, daily.</h2>
          <p>Level {data.level} · {data.aura.toLocaleString()} aura</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Tasks completed</span>
          <b>{done}</b>
          <small>of {total} active tasks</small>
        </div>
        <div className="stat-card">
          <span>Current level</span>
          <b>{data.level}</b>
          <small>{data.xp.toLocaleString()} XP earned this level</small>
        </div>
        <div className="stat-card">
          <span>Total aura</span>
          <b>{(data.aura / 1000).toFixed(1)}k</b>
          <small>Lifetime points</small>
        </div>
        <div className="stat-card">
          <span>Completion</span>
          <b>{total ? Math.round((done / total) * 100) : 0}%</b>
          <small>Across your pillars</small>
        </div>
      </div>
      <div className="settings-panel">
        <div>
          <div className="eyebrow">PERSONALISE</div>
          <h2>Make Aura yours</h2>
        </div>
        <label>Theme
          <select value={data.theme} onChange={e => setData(d => ({ ...d, theme: e.target.value }))}>
            {Object.keys(THEMES).map(x => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>XP required per level
          <input
            type="number"
            min="100"
            step="100"
            value={data.xpGoal}
            onChange={e => setData(d => ({ ...d, xpGoal: Math.max(100, Number(e.target.value) || 100) }))}
          />
        </label>
        <label>Current level
          <input
            type="number"
            min="1"
            value={data.level}
            onChange={e => setData(d => ({ ...d, level: Math.max(1, Number(e.target.value) || 1) }))}
          />
        </label>
        <div className="backup-actions">
          <button type="button" className="secondary-btn" onClick={onExport}><Download size={16}/> Export backup</button>
          <button type="button" className="secondary-btn" onClick={onImport}><Upload size={16}/> Import backup</button>
        </div>
      </div>
      <div className="sync-note">
        <Shield size={17}/>
        <div>
          <b>Local-first privacy</b>
          <p>Your progress is stored in this browser. Cloud sync is not connected in this starter build.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
