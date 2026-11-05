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
const CHALLENGE_SEEDS = [
  ["Study with intention",21,"Mind","Read the topic, make notes, revise and test yourself.","photo-1434030216411-0b793f4b4173"],
  ["Language immersion",30,"Mind","Learn vocabulary, listen, speak and review daily.","photo-1543109740-4bdb38fda756"],
  ["Morning movement",21,"Body","Walk, stretch or train before the day gets busy.","photo-1476480862126-209bfaa8edc8"],
  ["Read every day",30,"Mind","Read, capture one idea and reflect on it.","photo-1519682337058-a94d519337bc"],
  ["Digital reset",7,"Personality","Reduce unnecessary screen time and protect attention.","photo-1516321318423-f06f85e504b3"],
  ["Hydration habit",21,"Body","Drink water at regular intervals and track it honestly.","photo-1548839140-29a749e1cf4d"],
  ["Consistent sleep",30,"Body","Keep a steady bedtime and wake-up routine.","photo-1505693416388-ac5ce068fe85"],
  ["Daily journaling",21,"Soul","Write what happened, what mattered and what you learned.","photo-1455390582262-044cno3d3e5"],
  ["Strength foundation",30,"Body","Train safely, recover and gradually improve technique.","photo-1534438327276-14e5300c3a48"],
  ["Creative practice",14,"Personality","Make something small each day: draw, write, design or play.","photo-1513364776144-60967b0f800f"],
  ["Mindful eating",21,"Body","Eat without rushing and notice hunger and fullness.","photo-1490645935967-10de6ba17061"],
  ["No impulse spending",30,"Personality","Pause before purchases and review what you truly need.","photo-1556742049-0cfed4f6a45d"],
  ["Kindness in action",14,"Soul","Do one thoughtful, practical thing for another person.","photo-1511632765486-a01980e01a18"],
  ["Deep work",14,"Mind","Complete one distraction-free focus session every day.","photo-1484480974693-6ca0a78fb36b"],
  ["Outdoor hours",21,"Soul","Spend time outside and notice your surroundings.","photo-1441974231531-c6227db76b6e"],
  ["Calligraphy basics",21,"Personality","Practise strokes, letterforms and a short composition.","photo-1455390582262-044cno3d3e5"],
  ["No procrastination",7,"Mind","Start the most important task within five minutes.","photo-1499750310107-5fef28a66643"],
  ["Gratitude practice",21,"Soul","Record three specific things you appreciate.","photo-1470252649378-9c29740c9fa8"],
  ["Cook at home",14,"Body","Prepare a balanced meal and learn one new technique.","photo-1556911220-e15b29be8c8f"],
  ["Personal finance",30,"Mind","Track spending, review goals and learn a money concept.","photo-1460925895917-afdab827c52f"]
]
const CHALLENGES = CHALLENGE_SEEDS.flatMap((seed,i)=>[0,1,2].map((v)=>({
  id:`challenge-${i*3+v+1}`, title:v===0?seed[0]:v===1?`${seed[0]} — ${seed[1]} day focus`:`${seed[0]} mastery`,
  days:v===0?seed[1]:v===1?Math.max(7,seed[1]+7):Math.max(30,seed[1]*2), pillar:seed[2],
  desc:seed[3], image:seed[4], steps:seed[0]==="Study with intention"
    ? ["Study one topic and make concise notes","Revise the notes using active recall","Practise with questions and record your score"]
    : [`Plan your ${seed[0].toLowerCase()} session`,`Practise the core skill for 20–30 minutes`,`Review what improved and prepare the next session`]
})))


const EXTRA_IDEAS = [
  ["Calligraphy","Hobby","Hard","Creative"],["Watercolour painting","Hobby","Medium","Creative"],["Digital illustration","Hobby","Hard","Creative"],["Photography walk","Hobby","Medium","Creative"],["Creative writing","Hobby","Medium","Creative"],["Poetry practice","Hobby","Medium","Creative"],["Pottery","Hobby","Hard","Creative"],["Origami","Hobby","Easy","Creative"],["Guitar practice","Hobby","Hard","Creative"],["Piano practice","Hobby","Hard","Creative"],["Chess tactics","Hobby","Medium","Mind"],["Learn Spanish","Hobby","Hard","Mind"],["Learn Japanese","Hobby","Hard","Mind"],["Learn French","Hobby","Hard","Mind"],["Learn coding","Hobby","Hard","Mind"],["Build a small website","Side Quest","Hard","Mind"],["Read nonfiction","Habit","Easy","Mind"],["Anki flashcards","Habit","Easy","Mind"],["Solve mathematics","Habit","Medium","Mind"],["Public speaking","Hobby","Hard","Personality"],["Debate practice","Hobby","Hard","Personality"],["Volunteer locally","Side Quest","Hard","Soul"],["Nature journaling","Hobby","Medium","Soul"],["Gardening","Hobby","Medium","Soul"],["Meal preparation","Habit","Medium","Body"],["Mobility routine","Habit","Easy","Body"],["Yoga","Hobby","Medium","Body"],["Swimming","Hobby","Hard","Body"],["Cycling route","Hobby","Medium","Body"],["Run 5K","Side Quest","Hard","Body"],["Avoid late-night scrolling","Vice","Medium","Digital"],["No sugary drinks today","Vice","Easy","Body"],["No unnecessary shopping","Vice","Medium","Life Skills"],["Avoid gossip","Vice","Medium","Personality"],["No snoozing","Vice","Easy","Personality"],["Tidy your workspace","Habit","Easy","Life Skills"],["Plan tomorrow tonight","Habit","Easy","Life Skills"],["Review weekly goals","Habit","Medium","Mind"],["Practice first aid","Hobby","Medium","Life Skills"],["Learn basic repair","Hobby","Medium","Life Skills"]
]
const EXTRA_IMAGES=["photo-1455390582262-044cno3d3e5","photo-1513364776144-60967b0f800f","photo-1519682337058-a94d519337bc","photo-1543109740-4bdb38fda756","photo-1534438327276-14e5300c3a48","photo-1470252649378-9c29740c9fa8"]
function expandedCatalog(){
 const rows=[...CATALOG];
 EXTRA_IDEAS.forEach((idea,i)=>{const [title,kind,difficulty,category]=idea;rows.push({id:`extra-${i}`,title,kind,difficulty,category,points:difficulty==="Easy"?120:difficulty==="Medium"?260:450,desc:`Build this skill through a repeatable practice. Start small, track consistency and improve one step at a time.`,images:[0,1,2,3].map(n=>EXTRA_IMAGES[(i+n)%EXTRA_IMAGES.length]),active:false,done:false,custom:false});});
 const bases=[...rows];
 const formats=["Beginner session","Focused practice","Weekly milestone","30-minute session","Reflection and review","Skill-building session","Consistency session","Advanced practice","Mini project","Progress check","Weekend practice","Skill checkpoint","Daily micro-session","Monthly review","Portfolio piece","Challenge day","Technique drill"];
 bases.forEach((item,i)=>formats.forEach((format,j)=>rows.push({...item,id:`${item.id}-set-${j}`,title:`${item.title}: ${format}`,desc:`${item.desc} ${format} — set a clear target and record your effort.`,points:Math.round(item.points*(j%3===0?0.55:j%3===1?0.8:1)),active:false,done:false,custom:false})));
 return rows;
}

const uid=()=>Math.random().toString(36).slice(2,10);
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
const freshState=()=>({
  aura:0,level:1,xp:0,xpGoal:1000,theme:"Original",displayName:"Your Aura",
  pillars:PILLARS.map(p=>({...p,tasks:p.tasks.map((title,i)=>({id:`${p.id}-${i}`,title,xp:[150,200,250][i]||150,done:false}))})),
  catalog:expandedCatalog(),
  journal:[],days:[],challengeProgress:{},customTools:[],nutrition:{water:0,waterDate:todayKey(),waterGoal:8,meals:[],vitamins:[]},createdAt:new Date().toISOString()
});
function readState(){
  try { const saved=JSON.parse(localStorage.getItem("aura-replica-v2")||"null"); if(!saved)return freshState(); const base=freshState(); const oldCatalog=saved.catalog||[]; const mergedCatalog=[...base.catalog.map(x=>({...x,...(oldCatalog.find(y=>y.id===x.id)||{})})),...oldCatalog.filter(x=>x.custom&&!base.catalog.some(y=>y.id===x.id))]; return {...base,...saved,catalog:mergedCatalog,nutrition:{...base.nutrition,...(saved.nutrition||{})}}; }
  catch { return freshState(); }
}
const fmtDate=(d)=>new Date(`${d}T12:00:00`).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short",year:"numeric"});
const nice=(n)=>Number(n||0).toLocaleString();
function withAuraDelta(state,delta){
  const aura=Math.max(0,(Number(state.aura)||0)+delta);
  let remaining=aura,level=1,xpGoal=1000;
  while(level<100&&remaining>=xpGoal){remaining-=xpGoal;level++;xpGoal=Math.round(xpGoal*1.13+250);}
  return {...state,aura,level,xp:remaining,xpGoal};
}

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
    setData(d=>withAuraDelta(d,points));
  }
  function togglePillar(pid,tid){
    const target=data.pillars.find(p=>p.id===pid)?.tasks.find(t=>t.id===tid);
    if(!target)return;
    setData(d=>{
      const pillars=d.pillars.map(p=>p.id!==pid?p:{...p,tasks:p.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)});
      const points=target.done?-target.xp:target.xp;
      return {...withAuraDelta(d,points),pillars};
    });
    if(!target.done)recordDay({points:target.xp,activity:target.title});
  }
  function recordDay(entry){
    const date=todayKey();
    setData(d=>{
      const existing=d.days.find(x=>x.date===date)||{date,mood:"",points:0,activities:[],journalPreview:"",photos:[]};
      const next={...existing,...(entry.mood?{mood:entry.mood}:{}),...(entry.journalPreview?{journalPreview:entry.journalPreview}:{}),points:(existing.points||0)+(entry.points||0),activities:[...(existing.activities||[]),...(entry.activity?[entry.activity]:[])]};
      return {...d,days:[next,...d.days.filter(x=>x.date!==date)]};
    });
  }
  function toggleCatalog(id){
    const item=data.catalog.find(x=>x.id===id); if(!item)return;
    const next=!item.done;
    setData(d=>({...d,catalog:d.catalog.map(x=>x.id===id?{...x,done:next}:x)}));
    if(next){award(item.points);recordDay({points:item.points,activity:item.title});notify(item.kind==="Vice"?"Resistance recorded — points earned":"Adventure completed — points earned");}
    else {setData(d=>withAuraDelta(d,-item.points));notify("Completion reversed");}
  }
  function toggleChallenge(id){
    const challenge=CHALLENGES.find(c=>c.id===id); if(!challenge)return;
    const active=!!data.challengeProgress[id];
    setData(d=>{
      const pillars=d.pillars.map(p=>p.id.toLowerCase()===challenge.pillar.toLowerCase()?{...p,tasks:active?p.tasks.filter(t=>!t.challengeId||t.challengeId!==id):[...p.tasks,...challenge.steps.map((title,i)=>({id:`${id}-${i}`,title:`${challenge.title}: ${title}`,xp:Math.round(80+i*25),done:false,challengeId:id,dueDays:challenge.days}))]}:p);
      return {...d,pillars,challengeProgress:{...d.challengeProgress,[id]:!active}};
    });
    notify(active?"Challenge removed from your daily profile":"Challenge added to your profile tasks");
  }
  function updateNutrition(patch){setData(d=>({...d,nutrition:{water:0,waterGoal:8,meals:[],vitamins:[],...(d.nutrition||{}),...patch}}));}
  function addMeal(text){if(!text.trim())return;updateNutrition({meals:[...(data.nutrition?.meals||[]),{id:uid(),text:text.trim(),date:todayKey()}]});}
  function toggleVitamin(name){const current=data.nutrition?.vitamins||[];const next=current.includes(name)?current.filter(x=>x!==name):[...current,name];updateNutrition({vitamins:next});}
  function missTask(pid,tid){const task=data.pillars.find(p=>p.id===pid)?.tasks.find(t=>t.id===tid);if(!task||task.done||task.penalized)return;setData(d=>({...withAuraDelta(d,-Math.round(task.xp*.25)),pillars:d.pillars.map(p=>p.id!==pid?p:{...p,tasks:p.tasks.map(t=>t.id===tid?{...t,penalized:true}:t)})}));recordDay({activity:`Missed: ${task.title}`,points:-Math.round(task.xp*.25)});notify(`Missed task penalty: −${Math.round(task.xp*.25)} aura`);}

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
      {tab==="Home"&&<HomePage data={data} onTab={setTab} onToggle={togglePillar} onMiss={missTask} onWater={()=>updateNutrition({waterDate:todayKey(),water:Math.min(((data.nutrition?.waterDate===todayKey()?data.nutrition?.water:0)||0)+1,data.nutrition?.waterGoal||8)})} onMeal={addMeal} onVitamin={toggleVitamin}/>}
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

function HomePage({data,onTab,onToggle,onMiss,onWater,onMeal,onVitamin}){
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
    <div className="category-stack">{data.pillars.map(p=>{const n=p.tasks.filter(t=>t.done).length,pc=p.tasks.length?Math.round(n/p.tasks.length*100):0;return <section className="category-card" key={p.id}><div className="category-header"><div className="category-title-wrap"><span className="category-orb" style={{"--tint":p.color}}><Flower2 size={17}/></span><div><h2>{p.name}</h2><span>{n}/{p.tasks.length} completed</span></div></div><div className="category-right"><div className="category-progress"><span style={{width:`${pc}%`,background:p.color}}/></div><strong>{pc}%</strong></div></div><div className="task-list">{p.tasks.map(t=><div className="task-line" key={t.id}><button className={`task-row ${t.done?"done":""}`} onClick={()=>onToggle(p.id,t.id)}><span className="check-circle">{t.done&&<Check size={14}/>}</span><span className="task-name">{t.title}</span><span className="task-xp">{nice(t.xp)} <Star size={12} fill="currentColor"/></span></button>{!t.done&&!t.penalized&&<button className="miss-task" onClick={()=>onMiss(p.id,t.id)} title="Mark as missed">Miss</button>}</div>)}</div></section>})}</div>
    <NutritionPanel data={data} onWater={onWater} onMeal={onMeal} onVitamin={onVitamin}/>
    <div className="bottom-note"><Sparkles size={15}/> Small steps create a life you love.</div>
  </div>;
}

function NutritionPanel({data,onWater,onMeal,onVitamin}){
 const [meal,setMeal]=useState(""); const raw=data.nutrition||{water:0,waterGoal:8,meals:[],vitamins:[]}; const n={...raw,water:raw.waterDate===todayKey()?raw.water||0:0};
 return <section className="nutrition-panel"><div className="section-heading compact"><div><div className="eyebrow">CARE FOR YOUR BODY</div><h2>Daily nourishment</h2></div></div><div className="nutrition-grid"><div className="nutrition-tile"><div className="nutrition-title">💧 Water</div><b>{n.water||0} / {n.waterGoal||8}</b><div className="water-glasses">{Array.from({length:n.waterGoal||8},(_,i)=><i key={i} className={i<(n.water||0)?"filled":""}/>)}</div><button onClick={onWater}>＋ Add a glass</button></div><div className="nutrition-tile"><div className="nutrition-title">🥗 Meals & diet</div><form onSubmit={e=>{e.preventDefault();onMeal(meal);setMeal("")}}><input value={meal} onChange={e=>setMeal(e.target.value)} placeholder="Log a meal"/><button>Add meal</button></form><small>{(n.meals||[]).filter(x=>x.date===todayKey()).map(x=>x.text).join(" · ")||"No meals logged today"}</small></div><div className="nutrition-tile vitamins-tile"><div className="nutrition-title">☼ Vitamins / supplements</div>{["Vitamin D","B12","Omega-3","Other prescribed supplement"].map(v=><label key={v}><input type="checkbox" checked={(n.vitamins||[]).includes(v)} onChange={()=>onVitamin(v)}/>{v}</label>)}<small>Track only what is appropriate for you; follow clinician or label guidance.</small></div></div></section>
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
 const firstDate=data.createdAt?.slice(0,10)||(sorted.length?sorted[sorted.length-1].date:todayKey());
 const dayNumber=d=>Math.max(1,Math.floor((new Date(d+"T12:00:00")-new Date(firstDate+"T12:00:00"))/86400000)+1);
 return <div className="sub-page days-page pdf-days"><h1>Days</h1>
 {sorted.length===0?<div className="empty-state"><CalendarDays size={28}/><h3>Your first day is waiting.</h3><p>Complete an action or write a journal entry. Your timeline will grow here.</p></div>:<div className="day-timeline">{sorted.map((day,i)=><article className="day-entry" key={day.date}><div className="timeline-marker"><span>{day.photo?"✦":""}</span><i/></div><div className="day-body"><div className="day-heading"><div><h2>Day {dayNumber(day.date)}</h2><span>{fmtDate(day.date)}</span></div></div><div className="day-mood"><span>Today’s mood</span><strong>{day.mood||"😐　🙂　😊"}</strong></div><div className="pdf-day-grid"><div className="pdf-day-tile"><span className="activity-thumb">{day.activities?.length?"✦":"　"}</span><b>×{day.activities?.length||0}</b><small>Activities</small></div><div className="pdf-day-tile"><div className="pillar-symbols">✦　☼　♙</div><small>Personality · Body · Mind · Soul</small></div><div className="pdf-day-tile"><span>Points</span><b className={(day.points||0)<0?"negative":""}>{(day.points||0)>0?"+":""}{nice(day.points||0)}</b></div><div className="pdf-day-tile journal-tile"><span>Journal</span><p>{day.journalPreview||"No entry yet"}</p></div></div>{day.activities?.length>0&&<div className="day-activity-list">{day.activities.map((a,j)=><span key={j}><Check size={12}/>{a}</span>)}</div>}</div></article>)}</div>}
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
    <section className="profile-aura"><div><h3>Aura</h3><span>Your lifetime points</span></div><b>{nice(data.aura)}</b><div className="profile-xp"><i style={{width:`${Math.min(100,data.xp/data.xpGoal*100)}%`}}/></div><small>{levelTitle(data.level)} · Level {data.level} / 100 · {nice(data.xp)} / {nice(data.xpGoal)} XP</small></section>
    <section className="journal-section pdf-journal"><div className="journal-topline"><span>▦</span><h2>Journal</h2><span>＋</span></div><div className="journal-calendar">{Array.from({length:84},(_,i)=><i key={i} className={i<data.journal.length?"filled":""}/>)}</div><p className="journal-year-note">{Math.round(((Date.now()-new Date(new Date().getFullYear(),0,1).getTime())/(new Date(new Date().getFullYear()+1,0,1).getTime()-new Date(new Date().getFullYear(),0,1).getTime()))*100)}% of {new Date().getFullYear()} has already passed!</p><div className="section-heading compact"><div><div className="eyebrow">SAVE YOUR PROGRESS</div><h2>New entry</h2></div><span className="journal-count">{data.journal.length} entries</span></div>
      <div className="journal-compose"><div className="mood-picker"><span>Today's mood</span>{["😞","😐","🙂","😊","🤩"].map(m=><button key={m} className={mood===m?"picked":""} onClick={()=>setMood(m)}>{m}</button>)}</div><textarea value={journalText} onChange={e=>setJournalText(e.target.value)} placeholder="What happened today? What did you learn? What do you want to remember?"/><button className="primary-btn" onClick={onSaveJournal}><Plus size={15}/> Save today's entry</button></div>
      <div className="journal-history">{data.journal.length===0?<div className="empty-state"><BookOpen size={24}/><p>Your journal is empty. Your first reflection will live here.</p></div>:data.journal.map(entry=><article className="journal-history-card" key={entry.id}><div className="journal-date">{new Date(entry.date).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}<span>{entry.mood||"✦"}</span></div><p>{entry.text}</p></article>)}</div>
    </section>
    <section className="settings-panel"><div><div className="eyebrow">PERSONALISE YOUR SPACE</div><h2>Settings & backup</h2></div><label>Theme<select value={data.theme} onChange={e=>onTheme(e.target.value)}>{Object.keys(THEMES).map(x=><option key={x}>{x}</option>)}</select></label><div className="level-rules"><b>Progression ladder</b><p>100 levels · each level requires more XP than the last. Missed scheduled tasks cost 25% of their task XP. Level titles reflect sustained consistency, not a single high score.</p></div><div className="backup-actions"><button className="secondary-btn" onClick={onExport}><Download size={15}/> Export data</button><button className="secondary-btn" onClick={onImport}><Upload size={15}/> Import data</button></div><p className="muted">Your data is saved locally in this browser. Export a backup before clearing browser data or changing devices.</p></section>
  </div>;
}
function levelTitle(level){if(level>=100)return "Apex — top-tier consistency";if(level>=90)return "Legend";if(level>=75)return "Virtuoso";if(level>=60)return "Elite";if(level>=45)return "Master";if(level>=30)return "Expert";if(level>=20)return "Disciplined";if(level>=10)return "Rising";if(level>=5)return "Focused";return "Beginner";}
const weekLabels=["Mo","Tu","We","Th","Fr","Sa","Su"];
function calculateStreak(days){
  if(!days.length)return 0;const set=new Set(days.map(d=>d.date));let d=new Date();let key=d.toISOString().slice(0,10);if(!set.has(key)){d.setDate(d.getDate()-1);key=d.toISOString().slice(0,10);}let count=0;while(set.has(key)){count++;d.setDate(d.getDate()-1);key=d.toISOString().slice(0,10);}return count;
}
