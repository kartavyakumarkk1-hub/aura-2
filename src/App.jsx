import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowUpRight, Award, BookOpen, CalendarDays, Check, ChevronDown,
  Compass, Crown, Flame, Flower2, Footprints, Globe2, Heart, Home, Leaf,
  Moon, Mountain, Pencil, Plus, Search, Settings, Shield, Sparkles, Star,
  Sun, Target, Trophy, Upload, Download, X, Zap, Share2, Dumbbell, Brain,
  Coffee, Camera, Music, Palette, Bike, Waves, Book, HandHeart, Timer,
  Smartphone, Eye, Droplets, ListChecks, ChevronRight
} from "lucide-react";

const THEMES = {
  Original: { bg:"#09090b", panel:"#171719", accent:"#f05e78", accent2:"#ff9b68", gold:"#f8d36d", text:"#f7f2f0", muted:"#aaa1a4", line:"rgba(255,255,255,.09)" },
  Ocean: { bg:"#071116", panel:"#10232a", accent:"#55b9cf", accent2:"#638df2", gold:"#9ce3e6", text:"#effbff", muted:"#9db7bd", line:"rgba(180,235,245,.12)" },
  Forest: { bg:"#0a120e", panel:"#17231b", accent:"#81b879", accent2:"#c2a56b", gold:"#e1d18a", text:"#f3f8f0", muted:"#a6b2a4", line:"rgba(210,245,210,.11)" },
  Queen: { bg:"#140d18", panel:"#24172a", accent:"#c77ce7", accent2:"#f07fa9", gold:"#f0c5dc", text:"#fff5ff", muted:"#b9a6bd", line:"rgba(245,210,255,.12)" },
  Princess: { bg:"#180f15", panel:"#291b24", accent:"#f28ab7", accent2:"#ffc18e", gold:"#ffe1a7", text:"#fff7fa", muted:"#c0aab5", line:"rgba(255,225,240,.13)" }
};
const photo = {
  running:["photo-1530549387789-4c1017266635","photo-1502904550040-7534597429ae","photo-1476480862126-209bfaa8edc8","photo-1461896836934- voices"],
};
const img = (id,w=900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
const CATALOG = [
  {id:"run",title:"Running",kind:"Hobby",difficulty:"Medium",points:250,category:"Fitness",desc:"Build cardiovascular endurance, mental discipline and consistency. Show up even when motivation is low.",images:["photo-1530549387789-4c1017266635","photo-1502904550040-7534597429ae","photo-1476480862126-209bfaa8edc8","photo-1461896836934-4c0c6c9a6f2a"]},
  {id:"read",title:"Reading",kind:"Habit",difficulty:"Easy",points:150,category:"Mind",desc:"Read a few pages every day and let small ideas compound into a broader perspective.",images:["photo-1519682337058-a94d519337bc","photo-1455390582262-044cno3d3e5","photo-1507842217343-583bb7270b66","photo-1512820790803-83ca734da794"]},
  {id:"meditate",title:"Meditation",kind:"Habit",difficulty:"Medium",points:600,category:"Mind",desc:"Train attention, lower reactivity and create a little more space between thought and action.",images:["photo-1506126613408-eca07ce68773","photo-1470252649378-9c29740c9fa8","photo-1545389336-cf090694435e","photo-1518611012118-696072aa579a"]},
  {id:"gym",title:"Strength Training",kind:"Hobby",difficulty:"Hard",points:450,category:"Fitness",desc:"Build strength through progressive practice, patient recovery and deliberate effort.",images:["photo-1534438327276-14e5300c3a48","photo-1581009146145-b5ef050c2e1e","photo-1517836357463-d25dfeac3438","photo-1534258936925-c58bed479fcb"]},
  {id:"journal",title:"Daily Journaling",kind:"Habit",difficulty:"Easy",points:200,category:"Personality",desc:"Turn passing thoughts into insight. Record what happened, what mattered and what you learned.",images:["photo-1455390582262-044cno3d3e5","photo-1517842645767-c639042777db","photo-1499750310107-5fef28a66643","photo-1519682337058-a94d519337bc"]},
  {id:"draw",title:"Sketching",kind:"Hobby",difficulty:"Medium",points:300,category:"Creative",desc:"Observe the world more carefully and build a creative practice one sketch at a time.",images:["photo-1513364776144-60967b0f800f","photo-1513475382585-d06e58bcb0e0","photo-1455390582262-044cno3d3e5","photo-1517694712202-14dd9538aa97"]},
  {id:"cook",title:"Cooking a New Dish",kind:"Hobby",difficulty:"Medium",points:300,category:"Life Skills",desc:"Learn to nourish yourself, experiment with flavour and become more independent.",images:["photo-1556911220-e15b29be8c8f","photo-1556909114-f6e7ad7d3136","photo-1498837167922-ddd27525d352","photo-1547592180-85f173990554"]},
  {id:"language",title:"Learn a Language",kind:"Hobby",difficulty:"Hard",points:500,category:"Mind",desc:"Open a new window into culture and communication through steady daily practice.",images:["photo-1543109740-4bdb38fda756","photo-1456513080510-7bf3a84b82f8","photo-1503676260728-1c00da094a0b","photo-1516321318423-f06f85e504b3"]},
  {id:"walk",title:"Morning Walk",kind:"Habit",difficulty:"Easy",points:120,category:"Fitness",desc:"Start the day with gentle movement, fresh air and a calmer mind.",images:["photo-1470252649378-9c29740c9fa8","photo-1441974231531-c6227db76b6e","photo-1500530855697-b586d89ba3ee","photo-1476480862126-209bfaa8edc8"]},
  {id:"water",title:"Drink Enough Water",kind:"Habit",difficulty:"Easy",points:100,category:"Body",desc:"Build a simple hydration rhythm and take care of the basics consistently.",images:["photo-1532634896-26909d0d4b8e","photo-1548839140-29a749e1cf4d","photo-1523362628745-0c100150b504","photo-1559839734-2b71ea197ec2"]},
  {id:"call",title:"Call Someone You Love",kind:"Habit",difficulty:"Easy",points:180,category:"Soul",desc:"Give a relationship your attention. A small check-in can mean more than you think.",images:["photo-1511632765486-a01980e01a18","photo-1529156069898-49953e39b3ac","photo-1511895426328-dc8714191300","photo-1529333166437-7750a6dd5a70"]},
  {id:"music",title:"Learn an Instrument",kind:"Hobby",difficulty:"Hard",points:550,category:"Creative",desc:"Develop patience, coordination and expression through deliberate musical practice.",images:["photo-1510915361894-db8b60106cb1","photo-1511379938547-c1f69419868d","photo-1507838153414-b4b713384a76","photo-1516280440614-37939bbacd81"]},
  {id:"cycle",title:"Cycling",kind:"Hobby",difficulty:"Medium",points:350,category:"Fitness",desc:"Explore farther, improve endurance and make movement part of your everyday life.",images:["photo-1485965120184-e220f721d03e","photo-1511994298241-608e28f14d3b","photo-1541625602330-2277c4c46182","photo-1507035895480-2b3156c31fc8"]},
  {id:"social",title:"Endless Scrolling",kind:"Vice",difficulty:"Medium",points:180,category:"Digital",desc:"Notice the urge to scroll. Replace one unplanned session with something you chose.",images:["photo-1516321318423-f06f85e504b3","photo-1519389950473-47ba0277781c","photo-1498050108023-c5249f4df085","photo-1518770660439-4636190af475"]},
  {id:"sugar",title:"Avoid Sugary Drinks",kind:"Vice",difficulty:"Easy",points:120,category:"Body",desc:"Choose a drink that supports how you want to feel. Small swaps add up.",images:["photo-1513558161293-cdcc765c96ec","photo-1548839140-29a749e1cf4d","photo-1544145945-f90425340c7e","photo-1551024709-8f23befc6f87"]},
  {id:"late",title:"No Late-Night Doomscrolling",kind:"Vice",difficulty:"Hard",points:400,category:"Digital",desc:"Protect your sleep by putting the phone away before bedtime.",images:["photo-1511295742362-92c96b2d5d75","photo-1517841905240-472988babdf9","photo-1500530855697-b586d89ba3ee","photo-1519682337058-a94d519337bc"]},
  {id:"procrast",title:"Beat Procrastination",kind:"Vice",difficulty:"Hard",points:350,category:"Personality",desc:"Start with five focused minutes instead of waiting for the perfect mood.",images:["photo-1484480974693-6ca0a78fb36b","photo-1499750310107-5fef28a66643","photo-1455390582262-044cno3d3e5","photo-1506784983877-45594efa4cbe"]},
  {id:"complain",title:"Avoid Unnecessary Complaining",kind:"Vice",difficulty:"Medium",points:200,category:"Personality",desc:"Notice the complaint, then ask whether you can improve or accept the situation.",images:["photo-1499209974431-9dddcece7f88","photo-1500530855697-b586d89ba3ee","photo-1470252649378-9c29740c9fa8","photo-1517841905240-472988babdf9"]},
  {id:"impulse",title:"Pause Before Impulse Buying",kind:"Vice",difficulty:"Medium",points:220,category:"Life Skills",desc:"Add a pause between wanting and buying. Choose with intention rather than impulse.",images:["photo-1490481651871-ab68de25d43d","photo-1472851294608-062f824d29cc","photo-1556742049-0cfed4f6a45d","photo-1516321318423-f06f85e504b3"]},
  {id:"volunteer",title:"Volunteer for an Hour",kind:"Side Quest",difficulty:"Hard",points:700,category:"Soul",desc:"Give your time to a cause or person who could use a hand.",images:["photo-1559027615-cd4628902d4a","photo-1469571486292-0ba58a3f068b","photo-1531206715517-5c0ba140b2b8","photo-1511632765486-a01980e01a18"]},
  {id:"camp",title:"Go Camping with Friends",kind:"Side Quest",difficulty:"Hard",points:800,category:"Adventure",desc:"Trade the usual routine for a night outdoors, shared stories and a new memory.",images:["photo-1478131143081-80f7f84ca84d","photo-1504280390367-361c6d9f38f4","photo-1473448912268-2022ce9509d8","photo-1464822759023-fed622ff2c3b"]},
  {id:"museum",title:"Visit a Museum",kind:"Side Quest",difficulty:"Medium",points:450,category:"Culture",desc:"Spend an afternoon with art, history or ideas outside your usual feed.",images:["photo-1561214115-f2f134cc4912","photo-1577083552431-6e5fd01aa342","photo-1579783902614-a3fb3927b6a5","photo-1531058020387-3be344556be6"]},
  {id:"sunrise",title:"Watch a Sunrise",kind:"Side Quest",difficulty:"Easy",points:250,category:"Adventure",desc:"Wake early, find a quiet view and give the day a thoughtful beginning.",images:["photo-1470252649378-9c29740c9fa8","photo-1500530855697-b586d89ba3ee","photo-1470770841072-f978cf4d019e","photo-1501785888041-af3ef285b470"]}
];
const PILLARS = [
  {id:"personality",name:"Personality",color:"#f06a7b",tasks:["Write a daily reflection","Listen without interrupting","Do one thing outside your comfort zone"]},
  {id:"body",name:"Body",color:"#ff9b68",tasks:["Move your body for 20 minutes","Drink enough water","Keep a consistent sleep routine"]},
  {id:"mind",name:"Mind",color:"#f4c76c",tasks:["Read 10 pages","Learn something new","Spend 25 minutes in focused work"]},
  {id:"soul",name:"Soul",color:"#b89be8",tasks:["Practice gratitude","Connect with someone you care about","Spend a moment in stillness"]}
];
const LESSONS = [
  {title:"Find Signal, Kill Noise",tag:"FOCUS",desc:"Your focus is destroyed not by lack of capability, but by constant noise. Protect your attention.",image:"photo-1470252649378-9c29740c9fa8"},
  {title:"Built to Create, Not Consume",tag:"MINDSET",desc:"Fear shrinks your potential. Make something before you consume something.",image:"photo-1531058020387-3be344556be6"},
  {title:"Make Your Bed",tag:"DISCIPLINE",desc:"Start with one small promise you can keep. Momentum grows from there.",image:"photo-1505693416388-ac5ce068fe85"}
];
const CHALLENGES = [
  {id:"21-days",title:"21 Days of Consistency",days:21,desc:"Show up for one meaningful habit every day.",image:"photo-1518611012118-696072aa579a"},
  {id:"no-scroll",title:"7 Days Without Mindless Scrolling",days:7,desc:"Take back a little attention every day.",image:"photo-1516321318423-f06f85e504b3"},
  {id:"early",title:"5 Days of Early Mornings",days:5,desc:"Create a calm start before the world gets loud.",image:"photo-1470252649378-9c29740c9fa8"}
];
const uid=()=>Math.random().toString(36).slice(2,10);
const todayKey=()=>new Date().toISOString().slice(0,10);
const freshState=()=>({
  aura:0,level:1,xp:0,xpGoal:1000,theme:"Original",displayName:"Your Aura",
  pillars:PILLARS.map(p=>({...p,tasks:p.tasks.map((title,i)=>({id:`${p.id}-${i}`,title,xp:[150,200,250][i]||150,done:false}))})),
  catalog:CATALOG.map(x=>({...x,active:false,done:false,custom:false})),
  journal:[],days:[],challengeProgress:{},customTools:[],createdAt:new Date().toISOString()
});
function readState(){
  try { const saved=JSON.parse(localStorage.getItem("aura-replica-v2")||"null"); if(!saved)return freshState(); const base=freshState(); return {...base,...saved}; }
  catch { return freshState(); }
}
const fmtDate=(d)=>new Date(`${d}T12:00:00`).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short",year:"numeric"});
const nice=(n)=>Number(n||0).toLocaleString();

export default function App(){
  const [data,setData]=useState(readState);
  const [tab,setTab]=useState("Home");
  const [toast,setToast]=useState("");
  const [modal,setModal]=useState("");
  const [custom,setCustom]=useState({title:"",kind:"Hobby",difficulty:"Medium",points:250,desc:"",category:"Personal"});
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [journalText,setJournalText]=useState("");
  const [mood,setMood]=useState("🙂");
  const importRef=useRef(null);
  const theme=THEMES[data.theme]||THEMES.Original;

  useEffect(()=>{
    localStorage.setItem("aura-replica-v2",JSON.stringify(data));
    Object.entries({bg:theme.bg,panel:theme.panel,accent:theme.accent,accent2:theme.accent2,gold:theme.gold,text:theme.text,muted:theme.muted,line:theme.line}).forEach(([k,v])=>document.documentElement.style.setProperty(`--${k}`,v));
  },[data,theme]);

  const allTasks=data.pillars.flatMap(p=>p.tasks);
  const doneTasks=allTasks.filter(t=>t.done).length;
  const activeCatalog=data.catalog.filter(x=>x.active);
  const todayRecord=data.days.find(x=>x.date===todayKey());
  const totalCompleted=doneTasks+data.catalog.filter(x=>x.done).length;
  function notify(s){setToast(s);window.clearTimeout(notify.timer);notify.timer=window.setTimeout(()=>setToast(""),2300);}
  function setPatch(p){setData(d=>({...d,...p}));}
  function award(points){
    setData(d=>{let xp=d.xp+points,level=d.level,aura=d.aura+points;while(xp>=d.xpGoal){xp-=d.xpGoal;level++;}return {...d,xp,level,aura};});
  }
  function togglePillar(pid,tid){
    const target=data.pillars.find(p=>p.id===pid)?.tasks.find(t=>t.id===tid);
    if(!target)return;
    setData(d=>{
      const pillars=d.pillars.map(p=>p.id!==pid?p:{...p,tasks:p.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)});
      const points=target.done?-target.xp:target.xp;
      const aura=Math.max(0,d.aura+points),xp=Math.max(0,d.xp+points);
      return {...d,pillars,aura,xp};
    });
    if(!target.done)recordDay({points:target.xp,activity:target.title});
  }
  function recordDay(entry){
    const date=todayKey();
    setData(d=>{
      const existing=d.days.find(x=>x.date===date)||{date,mood:"",points:0,activities:[],journalPreview:"",photos:[]};
      const next={...existing,...(entry.mood?{mood:entry.mood}:{}),...(entry.journalPreview?{journalPreview:entry.journalPreview}:{}),points:Math.max(0,(existing.points||0)+(entry.points||0)),activities:[...(existing.activities||[]),...(entry.activity?[entry.activity]:[])]};
      return {...d,days:[next,...d.days.filter(x=>x.date!==date)]};
    });
  }
  function toggleCatalog(id){
    const item=data.catalog.find(x=>x.id===id); if(!item)return;
    const next=!item.done;
    setData(d=>({...d,catalog:d.catalog.map(x=>x.id===id?{...x,done:next}:x)}));
    if(next){award(item.points);recordDay({points:item.points,activity:item.title});notify(item.kind==="Vice"?"Resistance recorded — points earned":"Adventure completed — points earned");}
    else {setData(d=>({...d,aura:Math.max(0,d.aura-item.points),xp:Math.max(0,d.xp-item.points)}));notify("Completion reversed");}
  }
  function toggleChallenge(id){
    setData(d=>({...d,challengeProgress:{...d.challengeProgress,[id]:!d.challengeProgress[id]}}));
    notify("Challenge progress updated");
  }
  function addCustom(e){
    e.preventDefault();if(!custom.title.trim())return;
    setData(d=>({...d,catalog:[{...custom,id:uid(),images:["photo-1494438639946-1ebd1d20bf85","photo-1500530855697-b586d89ba3ee","photo-1519682337058-a94d519337bc","photo-1499750310107-5fef28a66643"],active:true,done:false,custom:true},...d.catalog]}));
    setCustom({title:"",kind:"Hobby",difficulty:"Medium",points:250,desc:"",category:"Personal"});setModal("");notify("Your adventure was added");
  }
  function saveJournal(){
    if(!journalText.trim())return;
    const entry={id:uid(),text:journalText.trim(),date:new Date().toISOString(),mood};
    setData(d=>({...d,journal:[entry,...d.journal]}));
    recordDay({journalPreview:journalText.trim(),mood});
    setJournalText("");notify("Journal entry saved");
  }
  function exportData(){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="aura-progress-backup.json";a.click();URL.revokeObjectURL(url);notify("Backup exported");
  }
  function importData(file){
    if(!file)return;const r=new FileReader();r.onload=()=>{try{const parsed=JSON.parse(r.result);if(!Array.isArray(parsed.pillars)||!Array.isArray(parsed.catalog))throw Error();setData({...freshState(),...parsed});notify("Backup restored");}catch{notify("Invalid Aura backup file");}};r.readAsText(file);
  }

  const nav=[["Home",Home],["Explore",Compass],["Days",CalendarDays],["Growth",Zap],["Profile",Crown]];
  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={()=>setTab("Home")}><span className="brand-mark"><Sparkles size={17}/></span><span>AURA</span></button><div className="top-actions"><span className="top-level">LVL {data.level}</span><button className="icon-btn" onClick={()=>setTab("Profile")} aria-label="Profile"><Settings size={18}/></button></div></header>
    <main className="main-content">
      {tab==="Home"&&<HomePage data={data} onTab={setTab} onToggle={togglePillar}/>}
      {tab==="Explore"&&<ExplorePage data={data} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} onToggle={toggleCatalog} onAdd={()=>setModal("custom")}/>}
      {tab==="Days"&&<DaysPage data={data}/>}
      {tab==="Growth"&&<GrowthPage data={data} onToggleChallenge={toggleChallenge}/>}
      {tab==="Profile"&&<ProfilePage data={data} setData={setData} onExport={exportData} onImport={()=>importRef.current?.click()} journalText={journalText} setJournalText={setJournalText} mood={mood} setMood={setMood} onSaveJournal={saveJournal} onTheme={v=>setPatch({theme:v})}/>}
    </main>
    <nav className="bottom-nav">{nav.map(([label,Icon])=><button key={label} className={`nav-item ${tab===label?"active":""}`} onClick={()=>setTab(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    {modal==="custom"&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal("")}><form className="modal" onSubmit={addCustom}><div className="modal-head"><div><div className="eyebrow">MAKE IT YOURS</div><h2>New adventure</h2></div><button type="button" className="icon-btn" onClick={()=>setModal("")}><X/></button></div><label>Name<input autoFocus value={custom.title} onChange={e=>setCustom({...custom,title:e.target.value})} placeholder="e.g. Learn photography" required/></label><div className="form-row"><label>Type<select value={custom.kind} onChange={e=>setCustom({...custom,kind:e.target.value})}>{["Hobby","Habit","Vice","Side Quest"].map(x=><option>{x}</option>)}</select></label><label>Difficulty<select value={custom.difficulty} onChange={e=>setCustom({...custom,difficulty:e.target.value})}>{["Easy","Medium","Hard"].map(x=><option>{x}</option>)}</select></label></div><div className="form-row"><label>Points<input type="number" min="0" value={custom.points} onChange={e=>setCustom({...custom,points:e.target.value})}/></label><label>Category<input value={custom.category} onChange={e=>setCustom({...custom,category:e.target.value})}/></label></div><label>Description<textarea value={custom.desc} onChange={e=>setCustom({...custom,desc:e.target.value})} placeholder="What makes this meaningful?"/></label><button className="primary-btn"><Plus size={16}/> Add to Explore</button></form></div>}
    <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={e=>importData(e.target.files?.[0])}/>
    {toast&&<div className="toast"><Check size={15}/>{toast}</div>}
  </div>;
}

function HomePage({data,onTab,onToggle}){
  const done=data.pillars.flatMap(p=>p.tasks).filter(t=>t.done).length,total=data.pillars.flatMap(p=>p.tasks).length;
  const pct=total?Math.round(done/total*100):0;
  return <div className="home-page">
    <section className="hero"><div className="hero-top"><span className="date-label">{new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}).toUpperCase()}</span><button className="avatar-button" onClick={()=>onTab("Profile")}><Crown size={17}/></button></div>
      <div className="aura-total">{nice(data.aura)} <em>aura</em></div><div className="hero-subtitle">A little better, every day.</div>
      <div className="xp-track"><div className="xp-fill" style={{width:`${Math.min(100,data.xp/data.xpGoal*100)}%`}}/></div><div className="xp-caption"><span>LVL {data.level}</span><span>{nice(data.xp)} / {nice(data.xpGoal)} XP</span></div>
      <div className="daily-shortcuts"><button onClick={()=>onTab("Explore")}><Sparkles size={16}/> Habits</button><button onClick={()=>onTab("Explore")}><Sun size={16}/> Hobbies</button><button onClick={()=>onTab("Explore")}><Shield size={16}/> Vices</button><button onClick={()=>onTab("Explore")}><Pencil size={15}/> Custom</button></div>
    </section>
    <section className="overview-card"><div className="section-kicker">YOUR DAILY RHYTHM <span>✦</span></div><div className="overview-row"><div><h2>Today, in balance</h2><p>{done} of {total} daily actions completed</p></div><div className="ring" style={{"--progress":`${pct*3.6}deg`}}><strong>{pct}%</strong></div></div><div className="mini-progress"><span style={{width:`${pct}%`}}/></div></section>
    <div className="section-heading"><div><div className="eyebrow">THE FOUR PILLARS</div><h1>Your growth</h1></div><button className="text-button" onClick={()=>onTab("Profile")}>Your profile <ChevronRight size={15}/></button></div>
    <div className="category-stack">{data.pillars.map(p=>{const n=p.tasks.filter(t=>t.done).length,pc=p.tasks.length?Math.round(n/p.tasks.length*100):0;return <section className="category-card" key={p.id}><div className="category-header"><div className="category-title-wrap"><span className="category-orb" style={{"--tint":p.color}}><Flower2 size={17}/></span><div><h2>{p.name}</h2><span>{n}/{p.tasks.length} completed</span></div></div><div className="category-right"><div className="category-progress"><span style={{width:`${pc}%`,background:p.color}}/></div><strong>{pc}%</strong></div></div><div className="task-list">{p.tasks.map(t=><button className={`task-row ${t.done?"done":""}`} key={t.id} onClick={()=>onToggle(p.id,t.id)}><span className="check-circle">{t.done&&<Check size={14}/>}</span><span className="task-name">{t.title}</span><span className="task-xp">{nice(t.xp)} <Star size={12} fill="currentColor"/></span></button>)}</div></section>})}</div>
    <div className="bottom-note"><Sparkles size={15}/> Small steps create a life you love.</div>
  </div>;
}

function ExplorePage({data,filter,setFilter,search,setSearch,onToggle,onAdd}){
  const filters=["All","Hobby","Habit","Vice","Side Quest"];
  const items=data.catalog.filter(x=>(filter==="All"||x.kind===filter)&&`${x.title} ${x.category} ${x.desc}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="sub-page explore-page"><div className="eyebrow">STEP OUTSIDE YOUR ROUTINE</div><h1>Explore <em>your next adventure.</em></h1><p className="page-lead">Scroll through hobbies, habits, vices and side quests. Choose what you want to practise, then track your progress.</p>
    <div className="explore-tools"><div className="searchbox"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search adventures, skills, rituals…"/></div><button className="add-adventure" onClick={onAdd}><Plus size={17}/> Create</button></div>
    <div className="filter-row">{filters.map(x=><button key={x} className={filter===x?"selected":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    <div className="catalog-meta"><span>{items.length} adventures</span><span>Scroll to discover <ArrowUpRight size={13}/></span></div>
    <div className="adventure-list">{items.map(x=><AdventureCard key={x.id} item={x} onToggle={()=>onToggle(x.id)}/>)}</div>
  </div>;
}
function AdventureCard({item,onToggle}){
  const imgs=item.images?.length?item.images:["photo-1500530855697-b586d89ba3ee"];
  return <article className={`adventure-card ${item.kind.toLowerCase().replace(" ","-")} ${item.done?"completed":""}`}>
    <div className="adventure-photo-grid">{imgs.slice(0,4).map((id,i)=><img key={i} src={img(id,600)} alt={`${item.title} scene ${i+1}`} loading="lazy"/>)}</div>
    <div className="adventure-content"><div className="adventure-title-row"><h2>{item.title}</h2>{item.custom&&<span className="custom-tag">CUSTOM</span>}</div>
      <div className="adventure-meta"><span className="meta-pill"><Sun size={13}/>{item.kind}</span><span className="meta-pill">{item.difficulty}</span><span className="meta-pill">{nice(item.points)} <Star size={13} fill="currentColor"/></span><button className="share-btn" onClick={()=>navigator.share?.({title:item.title,text:item.desc}).catch(()=>{})} aria-label="Share"><Share2 size={18}/></button></div>
      <p>{item.desc}</p><div className="adventure-bottom"><span>{item.category}</span><button className={`complete-btn ${item.done?"is-done":""}`} onClick={onToggle}>{item.done?<><Check size={15}/> Completed</>:item.kind==="Vice"?"Resisted today":"Add to my journey"}</button></div>
    </div>
  </article>;
}

function DaysPage({data}){
  const sorted=[...data.days].sort((a,b)=>b.date.localeCompare(a.date));
  const totalPoints=sorted.reduce((s,d)=>s+(d.points||0),0);
  return <div className="sub-page days-page"><div className="eyebrow">YOUR STORY, ONE DAY AT A TIME</div><h1>Days <em>of becoming.</em></h1><p className="page-lead">A living history of what you did, how you felt and the moments worth keeping.</p>
    <div className="days-summary"><div><span>RECORDED DAYS</span><b>{sorted.length}</b></div><div><span>POINTS EARNED</span><b>{nice(totalPoints)}</b></div><div><span>ACTIVITIES</span><b>{sorted.reduce((s,d)=>s+(d.activities?.length||0),0)}</b></div></div>
    {sorted.length===0?<div className="empty-state"><CalendarDays size={28}/><h3>Your first day is waiting.</h3><p>Complete a habit, hobby, task or side quest. It will appear here as your daily history.</p></div>:<div className="day-timeline">{sorted.map((day,i)=><article className="day-entry" key={day.date}><div className="timeline-marker"><span>{i===0?<Sparkles size={17}/>:<CalendarDays size={15}/>}</span><i/></div><div className="day-body"><div className="day-heading"><div><h2>Day {sorted.length-i}</h2><span>{fmtDate(day.date)}</span></div><b>+{nice(day.points)} ✦</b></div><div className="day-mood"><span>Today's mood</span><strong>{day.mood||"—"}</strong></div><div className="day-detail-grid"><div className="day-detail"><span>ACTIVITIES</span><b>{day.activities?.length||0}</b><small>{(day.activities||[]).slice(0,3).join(" · ")||"No activities logged"}</small></div><div className="day-detail"><span>POINTS</span><b>+{nice(day.points)}</b><small>Earned this day</small></div></div>{day.journalPreview&&<div className="day-journal"><BookOpen size={15}/><span>{day.journalPreview}</span></div>}{day.activities?.length>0&&<div className="day-activity-list">{day.activities.map((a,j)=><span key={j}><Check size={12}/>{a}</span>)}</div>}</div></article>)}</div>}
  </div>;
}

function GrowthPage({data,onToggleChallenge}){
  const tools=[["Focus","Protect your attention",Target],["ScreenTime","Be intentional online",Eye],["The Wheel","Balance your life",Activity],["Bucket List","Dream beyond today",ListChecks],["Dumb Phone","Make space for life",Smartphone],["Alarm","Start with intention",Sun],["Vision Board","Keep your direction close",Heart],["Aura Guy","Your growth companion",Sparkles]];
  return <div className="sub-page growth-page"><div className="eyebrow">TOOLS FOR YOUR JOURNEY</div><h1>Growth <em>& tools.</em></h1><p className="page-lead">Learn, experiment and take action. Build a life that feels as good as it looks.</p>
    <div className="tool-chip-grid">{tools.map(([n,d,I])=><button className="tool-chip" key={n}><I size={16}/><span>{n}</span></button>)}</div>
    <div className="section-heading compact"><div><div className="eyebrow">IDEAS TO LIVE BY</div><h2>Lessons</h2></div></div><div className="horizontal-cards">{LESSONS.map(x=><article className="lesson-card" key={x.title} style={{backgroundImage:`linear-gradient(0deg,rgba(8,8,10,.94),rgba(8,8,10,.12)),url(${img(x.image,800)})`}}><span>{x.tag}</span><h3>{x.title}</h3><p>{x.desc}</p><button onClick={()=>{}}>Learn <ArrowUpRight size={14}/></button></article>)}</div>
    <div className="section-heading compact"><div><div className="eyebrow">COMMIT TO A STREAK</div><h2>Challenges</h2></div></div><div className="challenge-list">{CHALLENGES.map(c=><article className="challenge-card" key={c.id}><img src={img(c.image,900)} alt="" loading="lazy"/><div className="challenge-copy"><span>{c.days} DAY CHALLENGE</span><h3>{c.title}</h3><p>{c.desc}</p><button className={data.challengeProgress[c.id]?"is-done":""} onClick={()=>onToggleChallenge(c.id)}>{data.challengeProgress[c.id]?<><Check size={14}/> In progress</>: "Start challenge"}</button></div></article>)}</div>
  </div>;
}

function ProfilePage({data,setData,onExport,onImport,journalText,setJournalText,mood,setMood,onSaveJournal,onTheme}){
  const done=data.pillars.flatMap(p=>p.tasks).filter(t=>t.done).length+data.catalog.filter(x=>x.done).length;
  const streak=calculateStreak(data.days);
  return <div className="sub-page profile-page"><div className="profile-heading"><div><div className="eyebrow">YOUR JOURNEY SO FAR</div><h1>Me <em>& my growth.</em></h1><p className="page-lead">A personal record of your effort, energy and evolution.</p></div><span className="profile-crown"><Crown size={25}/></span></div>
    <div className="profile-hero"><div className="profile-avatar"><Crown size={30}/></div><div className="profile-name"><input value={data.displayName} onChange={e=>setData(d=>({...d,displayName:e.target.value}))}/><p>Every day is a new page.</p></div></div>
    <div className="profile-counts"><div><Sparkles/><b>{data.catalog.filter(x=>x.kind==="Habit"&&x.done).length}</b><span>Habits</span></div><div><Sun/><b>{data.catalog.filter(x=>x.kind==="Hobby"&&x.done).length}</b><span>Hobbies</span></div><div><Shield/><b>{data.catalog.filter(x=>x.kind==="Vice"&&x.done).length}</b><span>Vices</span></div><div><CalendarDays/><b>{data.days.length}</b><span>Days</span></div></div>
    <section className="streak-card"><div><h2>Streak</h2><p>You're building consistency, one day at a time.</p><div className="week-dots">{weekLabels.map((d,i)=><span key={d} className={i<streak%8?"lit":""}><i>{i<streak%8?"✓":""}</i><small>{d}</small></span>)}</div></div><div className="streak-number"><Flame size={27}/><b>{streak}x DAYS</b><small>STREAK</small></div></section>
    <div className="profile-pillar-grid">{data.pillars.map(p=>{const n=p.tasks.filter(t=>t.done).length,pc=p.tasks.length?Math.round(n/p.tasks.length*100):0;return <div className="profile-pillar" key={p.id}><h3>{p.name}</h3><b>{n}</b><span>{pc}% complete</span><i><em style={{width:`${pc}%`,background:p.color}}/></i></div>})}</div>
    <section className="profile-aura"><div><h3>Aura</h3><span>Your lifetime points</span></div><b>{nice(data.aura)}</b><div className="profile-xp"><i style={{width:`${Math.min(100,data.xp/data.xpGoal*100)}%`}}/></div><small>Level {data.level} · {nice(data.xp)} / {nice(data.xpGoal)} XP</small></section>
    <section className="journal-section"><div className="section-heading compact"><div><div className="eyebrow">SAVE YOUR PROGRESS</div><h2>Journal</h2></div><span className="journal-count">{data.journal.length} entries</span></div>
      <div className="journal-compose"><div className="mood-picker"><span>Today's mood</span>{["😞","😐","🙂","😊","🤩"].map(m=><button key={m} className={mood===m?"picked":""} onClick={()=>setMood(m)}>{m}</button>)}</div><textarea value={journalText} onChange={e=>setJournalText(e.target.value)} placeholder="What happened today? What did you learn? What do you want to remember?"/><button className="primary-btn" onClick={onSaveJournal}><Plus size={15}/> Save today's entry</button></div>
      <div className="journal-history">{data.journal.length===0?<div className="empty-state"><BookOpen size={24}/><p>Your journal is empty. Your first reflection will live here.</p></div>:data.journal.map(entry=><article className="journal-history-card" key={entry.id}><div className="journal-date">{new Date(entry.date).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}<span>{entry.mood||"✦"}</span></div><p>{entry.text}</p></article>)}</div>
    </section>
    <section className="settings-panel"><div><div className="eyebrow">PERSONALISE YOUR SPACE</div><h2>Settings & backup</h2></div><label>Theme<select value={data.theme} onChange={e=>onTheme(e.target.value)}>{Object.keys(THEMES).map(x=><option key={x}>{x}</option>)}</select></label><label>XP required per level<input type="number" min="100" step="100" value={data.xpGoal} onChange={e=>setData(d=>({...d,xpGoal:Math.max(100,Number(e.target.value)||100)}))}/></label><div className="backup-actions"><button className="secondary-btn" onClick={onExport}><Download size={15}/> Export data</button><button className="secondary-btn" onClick={onImport}><Upload size={15}/> Import data</button></div><p className="muted">Your data is saved locally in this browser. Export a backup before clearing browser data or changing devices.</p></section>
  </div>;
}
const weekLabels=["Mo","Tu","We","Th","Fr","Sa","Su"];
function calculateStreak(days){
  if(!days.length)return 0;const set=new Set(days.map(d=>d.date));let d=new Date();let key=d.toISOString().slice(0,10);if(!set.has(key)){d.setDate(d.getDate()-1);key=d.toISOString().slice(0,10);}let count=0;while(set.has(key)){count++;d.setDate(d.getDate()-1);key=d.toISOString().slice(0,10);}return count;
}
