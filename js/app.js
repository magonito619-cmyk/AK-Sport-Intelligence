"use strict";
/* ===================== Constantes ===================== */
const SCHEMA=4,KEY="ak_sports_v4_state",OLD_KEY="ak_sports_v3_state",SESSION_KEY="ak_sports_v4_session",EXPORT_KEY="ak_sports_v4_lastExport";
// Opcional: URL de TU backend que reciba {message, context} y devuelva {reply:"texto"}. Nunca pongas API keys en este archivo.
const AI_ENDPOINT="";
const DIMS=[{k:"tec",label:"Técnica"},{k:"tac",label:"Táctica"},{k:"fis",label:"Físico"},{k:"psi",label:"Psicológico"}];
const POSITIONS=["Portero","Defensa","Mediocampista","Extremo","Delantero"];
const STATUSES=["Activo","Lesionado","Suspendido","Baja"];
const TOKEN_TYPES=["home","away","ball","cone"];
const PAGES=["dashboard","players","evaluations","training","matches","tactics","assistant","club","data"];
const FORMS={
 "4-4-2":[[1,6,50],[2,22,85],[4,22,62],[5,22,38],[3,22,15],[7,46,85],[8,46,62],[6,46,38],[11,46,15],[9,70,62],[10,70,38]],
 "4-3-3":[[1,6,50],[2,22,85],[4,22,62],[5,22,38],[3,22,15],[6,44,50],[8,46,72],[10,46,28],[7,70,82],[9,74,50],[11,70,18]],
 "3-5-2":[[1,6,50],[4,22,72],[5,22,50],[3,22,28],[2,44,90],[8,44,66],[6,42,50],[10,44,34],[11,44,10],[9,70,62],[7,70,38]],
 "4-2-3-1":[[1,6,50],[2,22,85],[4,22,62],[5,22,38],[3,22,15],[6,38,62],[8,38,38],[7,56,82],[10,56,50],[11,56,18],[9,74,50]]
};

/* ===================== Deportes y planes ===================== */
const SPORTS={
 futbol:{name:"Fútbol",min:0,forms:FORMS},
 baloncesto:{name:"Baloncesto",min:1,forms:{"1-3-1":[[1,38,50],[2,26,18],[3,22,50],[4,26,82],[5,10,50]],"2-1-2":[[1,36,32],[2,36,68],[3,24,50],[4,12,30],[5,12,70]],"2-3":[[1,36,35],[2,36,65],[3,16,15],[4,14,50],[5,16,85]],"4-1":[[1,38,50],[2,22,12],[3,22,38],[4,22,62],[5,22,88]]}},
 voleibol:{name:"Voleibol",min:1,forms:{Base:[[1,26,70],[2,45,70],[3,45,50],[4,45,30],[5,26,30],[6,26,50]],W:[[1,24,66],[2,38,72],[3,45,50],[4,38,28],[5,24,34],[6,28,50]],U:[[1,24,70],[2,45,66],[3,45,50],[4,45,34],[5,24,30],[6,22,50]]}},
 balonmano:{name:"Balonmano",min:2,forms:{"6-0":[[1,5,50],[2,20,14],[3,20,28],[4,20,42],[5,20,58],[6,20,72],[7,20,86]],"5-1":[[1,5,50],[2,20,18],[3,20,34],[4,20,50],[5,20,66],[6,20,82],[7,34,50]],"3-2-1":[[1,5,50],[2,18,28],[3,18,50],[4,18,72],[5,28,38],[6,28,62],[7,38,50]]}},
 americano:{name:"Fútbol americano",min:2,forms:{"I-Form":[[1,38,50],[2,44,50],[3,44,43],[4,44,57],[5,44,36],[6,44,64],[7,44,20],[8,44,80],[9,32,50],[10,26,50],[11,38,30]],Shotgun:[[1,34,50],[2,44,50],[3,44,43],[4,44,57],[5,44,36],[6,44,64],[7,44,18],[8,44,82],[9,36,38],[10,44,28],[11,44,72]],"4-3":[[1,46,30],[2,46,43],[3,46,57],[4,46,70],[5,38,35],[6,38,50],[7,38,65],[8,26,20],[9,26,80],[10,22,40],[11,22,60]]}},
 rugby:{name:"Rugby",min:3,forms:{Base:[[1,44,40],[2,44,50],[3,44,60],[4,40,45],[5,40,55],[6,38,35],[7,38,65],[8,36,50],[9,32,50],[10,26,45],[11,18,12],[12,22,38],[13,20,32],[14,18,88],[15,10,50]],Open:[[1,44,18],[2,44,50],[3,44,82],[4,40,32],[5,40,68],[6,36,12],[7,36,88],[8,36,50],[9,30,50],[10,22,44],[11,12,10],[12,16,32],[13,14,56],[14,12,90],[15,6,50]]}},
 hockey:{name:"Hockey",min:3,forms:{"2-1-2":[[1,6,50],[2,18,35],[3,18,65],[4,32,50],[5,44,30],[6,44,70]],"1-2-2":[[1,6,50],[2,18,50],[3,32,35],[4,32,65],[5,44,30],[6,44,70]]}},
 futsal:{name:"Fútbol sala",min:3,forms:{"2-2":[[1,6,50],[2,22,30],[3,22,70],[4,40,30],[5,40,70]],"3-1":[[1,6,50],[2,20,22],[3,20,78],[4,28,50],[5,44,50]],"4-0":[[1,6,50],[2,24,15],[3,24,38],[4,24,62],[5,24,85]]}}
};
const PLAN_NAMES=["Free","Premium","Pro","Ultra Pro"],PLAN_RANK={"Free Trial":0,Premium:1,Pro:2,"Ultra Pro":3};
const BALLS={baloncesto:"🏀",voleibol:"🏐",americano:"🏈",rugby:"🏉",hockey:"⚫"};
const trialOn=()=>state.plan==="Free Trial"&&trialDays()>0;
const sportAllowed=sp=>!!SPORTS[sp]&&(trialOn()||(PLAN_RANK[state.plan]??0)>=SPORTS[sp].min);
const sportName=sp=>tr(SPORTS[SPORTS[sp]?sp:"futbol"].name);
const LN='stroke="rgba(255,255,255,.85)" stroke-width=".35" fill="none"',pbg=c=>`<rect width="105" height="68" fill="${c}"/>`;
const hall=(out,floor,mid)=>pbg(out)+`<rect x="2" y="8.75" width="101" height="50.5" fill="${floor}"/><g ${LN}><rect x="2" y="8.75" width="101" height="50.5"/><line x1="52.5" y1="8.75" x2="52.5" y2="59.25"/>${mid}<path d="M2 19A15 15 0 0 1 17 34A15 15 0 0 1 2 49"/><path d="M103 19A15 15 0 0 0 88 34A15 15 0 0 0 103 49"/></g>`;
const PITCH={
 futbol:()=>pitchFutbol(),
 baloncesto:()=>pbg("#7a4a1e")+`<rect x="2" y="2" width="101" height="64" fill="#c98a4b"/><g ${LN}><rect x="2" y="2" width="101" height="64"/><line x1="52.5" y1="2" x2="52.5" y2="66"/><circle cx="52.5" cy="34" r="6"/><rect x="2" y="24" width="19" height="20"/><rect x="84" y="24" width="19" height="20"/><circle cx="21" cy="34" r="6"/><circle cx="84" cy="34" r="6"/><path d="M2 8H13A26 26 0 0 1 13 60H2"/><path d="M103 8H92A26 26 0 0 0 92 60H103"/><circle cx="5.5" cy="34" r=".8"/><circle cx="99.5" cy="34" r=".8"/></g>`,
 voleibol:()=>pbg("#17476e")+`<rect x="17.5" y="16.5" width="70" height="35" fill="#d9894a"/><g ${LN}><rect x="17.5" y="16.5" width="70" height="35"/><line x1="40.8" y1="16.5" x2="40.8" y2="51.5"/><line x1="64.2" y1="16.5" x2="64.2" y2="51.5"/></g><line x1="52.5" y1="13" x2="52.5" y2="55" stroke="#fff" stroke-width=".8"/>`,
 balonmano:()=>hall("#1f4f8f","#d99c5b",`<path d="M2 11.3A22.7 22.7 0 0 1 24.7 34A22.7 22.7 0 0 1 2 56.7" stroke-dasharray="1.2 1"/><path d="M103 11.3A22.7 22.7 0 0 0 80.3 34A22.7 22.7 0 0 0 103 56.7" stroke-dasharray="1.2 1"/>`),
 futsal:()=>hall("#0f3d52","#2a86a8",`<circle cx="52.5" cy="34" r="7.6"/><circle cx="14" cy="34" r=".5" fill="#fff"/><circle cx="91" cy="34" r=".5" fill="#fff"/>`),
 americano:()=>{let s=pbg("#0d5a33")+`<rect x="2" y="2" width="8.6" height="64" fill="#7a1f1f" opacity=".6"/><rect x="94.4" y="2" width="8.6" height="64" fill="#1f3a7a" opacity=".6"/><g ${LN}><rect x="2" y="2" width="101" height="64"/>`;for(let i=0;i<=10;i++){const x=(10.6+i*8.38).toFixed(2);s+=`<line x1="${x}" y1="2" x2="${x}" y2="66"/>`}return s+"</g>"},
 rugby:()=>pbg("#0e5f35")+`<g ${LN}><rect x="2" y="2" width="101" height="64"/>${[10,95,52.5,28.7,76.3].map(x=>`<line x1="${x}" y1="2" x2="${x}" y2="66"/>`).join("")}<line x1="44" y1="2" x2="44" y2="66" stroke-dasharray="1.5 1.5"/><line x1="61" y1="2" x2="61" y2="66" stroke-dasharray="1.5 1.5"/></g>`,
 hockey:()=>pbg("#0c2233")+`<rect x="2" y="8" width="101" height="52" rx="14" fill="#d6edf5"/><g fill="none"><line x1="52.5" y1="8" x2="52.5" y2="60" stroke="#c0392b" stroke-width=".7"/><line x1="35.7" y1="8" x2="35.7" y2="60" stroke="#2563eb" stroke-width=".7"/><line x1="69.3" y1="8" x2="69.3" y2="60" stroke="#2563eb" stroke-width=".7"/><line x1="9" y1="9" x2="9" y2="59" stroke="#c0392b" stroke-width=".3"/><line x1="96" y1="9" x2="96" y2="59" stroke="#c0392b" stroke-width=".3"/><circle cx="52.5" cy="34" r="7.5" stroke="#2563eb" stroke-width=".35"/>${[[24,22],[24,46],[81,22],[81,46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" stroke="#c0392b" stroke-width=".3"/>`).join("")}</g>`
};
const pitchSVG=sp=>(PITCH[sp]||PITCH.futbol)();
function stashBoard(){state.boards[state.board.sp]=clone(state.board)}
function setSport(sp){stashBoard();state.board=normBoard(state.boards[sp]||{sp});renderTactics();persist()}

/* ===================== Utilidades ===================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const uid=()=>(window.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2,8));
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const toNum=(v,d=0)=>{const n=Number(v);return Number.isFinite(n)?n:d};
const arr=a=>Array.isArray(a)?a:[];
const str=(v,d="")=>typeof v==="string"?(v.trim()||d):(typeof v==="number"&&Number.isFinite(v)?String(v):d);
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const today=()=>iso(new Date());
const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return iso(d)};
const daysBetween=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const validDate=s=>typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s));
const fmtDate=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||"");return m?new Date(+m[1],+m[2]-1,+m[3]).toLocaleDateString(window.AK_LOCALE||undefined,{day:"2-digit",month:"2-digit",year:"numeric"}):esc(s||"—")};
const hex=c=>typeof c==="string"&&/^#[0-9a-f]{6}$/i.test(c);
const uniq=()=>{const seen=new Set();return id=>{let x=str(id,"")||uid();while(seen.has(x))x=uid();seen.add(x);return x}};
const clone=o=>JSON.parse(JSON.stringify(o));
const safeLogo=u=>(typeof u==="string"&&u.length<250000&&(/^https:\/\//i.test(u)||/^data:image\/(png|jpeg|webp);base64,/i.test(u)))?u:"";
const onColor=h=>{const n=parseInt(h.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;const lin=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return (.2126*lin(r)+.7152*lin(g)+.0722*lin(b))>.179?"#04110c":"#ffffff"};

const store={ok:true,mem:{},
 get(k){try{return localStorage.getItem(k)}catch(_){this.ok=false;return this.mem[k]??null}},
 set(k,v){try{localStorage.setItem(k,v);return true}catch(_){this.ok=false;this.mem[k]=v;return false}},
 del(k){try{localStorage.removeItem(k)}catch(_){}delete this.mem[k]}
};

/* ===================== Modelo de datos ===================== */
function buildTokens(hf,af,sp){
 const F=(SPORTS[sp]||SPORTS.futbol).forms,k0=Object.keys(F)[0],t=[];
 (F[hf]||F[k0]).forEach((f,i)=>t.push({id:"h"+i,type:"home",label:String(f[0]),x:f[1],y:f[2]}));
 (F[af]||F[k0]).forEach((f,i)=>t.push({id:"a"+i,type:"away",label:String(f[0]),x:100-f[1],y:100-f[2]}));
 return t;
}
function normKF(x){return Array.isArray(x)?x.slice(0,80).map(o=>({id:str(o&&o.id),x:clamp(toNum(o&&o.x,50),0,100),y:clamp(toNum(o&&o.y,50),0,100)})):null}
function normBoard(b){
 b=b&&typeof b==="object"?b:{};
 const sp=SPORTS[b.sp]?b.sp:"futbol",F=SPORTS[sp].forms,k0=Object.keys(F)[0],hf=F[b.hf]?b.hf:k0,af=F[b.af]?b.af:k0,tid=uniq();
 let tokens=arr(b.tokens).filter(t=>t&&TOKEN_TYPES.includes(t.type)).slice(0,80).map(t=>({id:tid(t.id),type:t.type,label:str(t.label).slice(0,3),x:clamp(toNum(t.x,50),0,100),y:clamp(toNum(t.y,50),0,100)}));
 if(!tokens.some(t=>t.type==="home"))tokens=buildTokens(hf,af,sp).concat(tokens.filter(t=>t.type==="ball"||t.type==="cone"));
 const strokes=arr(b.strokes).slice(0,300).map(s=>({t:s&&s.t==="arrow"?"arrow":"free",c:hex(s&&s.c)?s.c:"#f5b942",pts:arr(s&&s.pts).slice(0,800).map(p=>[clamp(toNum(p&&p[0]),0,1),clamp(toNum(p&&p[1]),0,1)])})).filter(s=>s.pts.length>0);
 return{sp,hf,af,tokens,strokes,rivals:b.rivals!==false,kf:{a:normKF(b.kf&&b.kf.a),b:normKF(b.kf&&b.kf.b),m:arr(b.kf&&b.kf.m).slice(0,20).map(normKF).filter(Boolean)}};
}
function normBoards(o){o=o&&typeof o==="object"?o:{};const r={};Object.keys(o).forEach(k=>{if(SPORTS[k])r[k]=normBoard({...o[k],sp:k})});return r}
function normalize(s){
 s=s&&typeof s==="object"?s:{};
 const pid=uniq(),players=arr(s.players).filter(p=>p&&typeof p==="object").map(p=>({id:pid(p.id),num:clamp(Math.round(toNum(p.num)),0,99),name:str(p.name,"Jugador").slice(0,60),pos:POSITIONS.includes(p.pos)?p.pos:"Mediocampista",age:clamp(Math.round(toNum(p.age,18)),5,60),status:STATUSES.includes(p.status)?p.status:"Activo",notes:str(p.notes).slice(0,500)}));
 const ids=new Set(players.map(p=>p.id)),eid=uniq(),dim=v=>clamp(Math.round(toNum(v,0)),0,100);
 const evaluations=arr(s.evaluations).filter(e=>e&&ids.has(str(e.playerId))).map(e=>({id:eid(e.id),playerId:str(e.playerId),date:validDate(e.date)?e.date:today(),tec:dim(e.tec),tac:dim(e.tac),fis:dim(e.fis),psi:dim(e.psi)}));
 const trid=uniq(),trainings=arr(s.trainings).filter(t=>t&&typeof t==="object").map(t=>({id:trid(t.id),name:str(t.name,"Sesión").slice(0,80),date:validDate(t.date)?t.date:today(),duration:clamp(Math.round(toNum(t.duration,60)),5,300),rpe:clamp(Math.round(toNum(t.rpe,5)),1,10),category:str(t.category,"General").slice(0,30),objective:str(t.objective).slice(0,160),blocks:str(t.blocks).slice(0,1500)}));
 const mid=uniq(),matches=arr(s.matches).filter(m=>m&&typeof m==="object").map(m=>({id:mid(m.id),date:validDate(m.date)?m.date:today(),rival:str(m.rival,"Rival").slice(0,60),venue:["Local","Visitante","Neutral"].includes(m.venue)?m.venue:"Local",gf:clamp(Math.round(toNum(m.gf)),0,99),ga:clamp(Math.round(toNum(m.ga)),0,99),comp:str(m.comp,"Amistoso").slice(0,40),notes:str(m.notes).slice(0,500)}));
 const plid=uniq(),plays=arr(s.plays).slice(0,50).filter(p=>p&&typeof p==="object").map(p=>({id:plid(p.id),name:str(p.name,"Jugada").slice(0,60),created:validDate(p.created)?p.created:today(),...normBoard(p)}));
 return{v:SCHEMA,user:str(s.user,"Entrenador").slice(0,60),club:str(s.club,"Mi Club").slice(0,60),color:hex(s.color)?s.color:"#19d391",logo:safeLogo(s.logo),plan:str(s.plan,"Free Trial").slice(0,20),trialStart:toNum(s.trialStart,Date.now()),demo:!!s.demo,players,evaluations,trainings,matches,plays,board:normBoard(s.board),boards:normBoards(s.boards)};
}
function migrateV3(o){
 const players=arr(o.players).filter(p=>p&&typeof p==="object").map(p=>({id:str(p.id,uid()),num:p.num,name:p.name,pos:p.pos,age:p.age,status:p.status}));
 const evaluations=[];
 const toIso=d=>{const m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(d||"");return m?`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`:today()};
 arr(o.evaluations).forEach(e=>{const p=players.find(x=>x.name===e.player);if(p){const a=clamp(toNum(e.avg,80),0,100);evaluations.push({id:uid(),playerId:p.id,date:toIso(e.date),tec:a,tac:a,fis:a,psi:a})}});
 arr(o.players).forEach((old,i)=>{const p=players[i];if(p&&!evaluations.some(e=>e.playerId===p.id)){const a=clamp(toNum(old&&old.performance,80),0,100);evaluations.push({id:uid(),playerId:p.id,date:today(),tec:a,tac:a,fis:a,psi:a})}});
 const trainings=arr(o.trainings).map(t=>({name:t.name,duration:parseInt(t.duration)||60,objective:t.objective,category:t.category,date:today(),rpe:6}));
 const matches=arr(o.matches).map(m=>{const r=/(\d+)\s*[-–]\s*(\d+)/.exec(m.result||"");return{date:m.date,rival:m.rival,gf:r?+r[1]:0,ga:r?+r[2]:0,comp:m.comp,notes:m.notes,venue:"Local"}});
 return normalize({user:o.user,club:o.club,color:o.color,logo:o.logo,trialStart:o.trialStart,players,evaluations,trainings,matches,demo:players.some(p=>/^Jugador Demo/.test(str(p.name)))});
}
function migrate(raw){return raw&&toNum(raw.v)>=4?normalize(raw):migrateV3(raw||{})}
function makeDemo(){
 const base=[["Jugador Demo 01",10,"Delantero",88],["Jugador Demo 02",1,"Portero",84],["Jugador Demo 03",4,"Defensa",82],["Jugador Demo 04",8,"Mediocampista",85],["Jugador Demo 05",7,"Extremo",80]];
 const players=base.map((b,i)=>({id:"p"+(i+1),num:b[1],name:b[0],pos:b[2],age:18,status:"Activo",notes:""}));
 const evaluations=[];
 base.forEach((b,i)=>[28,14,2].forEach((d,j)=>{const v=k=>clamp(b[3]-6+j*3+((i*3+k*5+j)%6)-2,40,99);evaluations.push({id:"e"+i+"_"+j,playerId:players[i].id,date:daysAgo(d),tec:v(1),tac:v(2),fis:v(3),psi:v(4)})}));
 return{v:SCHEMA,user:"Entrenador Demo",club:"AK Sports Intelligence",color:"#19d391",trialStart:Date.now(),demo:true,plan:"Free Trial",players,evaluations,
  trainings:[{id:"t1",name:"Coordinación y velocidad",date:daysAgo(5),duration:90,rpe:7,category:"Sub-18",objective:"Mejorar reacción y coordinación",blocks:"10' Activación\n25' Escalera y reacción\n30' Aceleraciones 10-15 m\n25' Juego reducido"},{id:"t2",name:"Definición y tiros",date:daysAgo(2),duration:80,rpe:6,category:"Sub-18",objective:"Mejorar la finalización",blocks:"10' Activación\n30' Remates desde diferentes ángulos\n30' Juego 5v5 con porterías pequeñas\n10' Feedback"}],
  matches:[{id:"m1",date:daysAgo(21),rival:"Rival Demo A",venue:"Local",gf:2,ga:1,comp:"Liga",notes:"Buen inicio y presión alta."},{id:"m2",date:daysAgo(14),rival:"Rival Demo B",venue:"Visitante",gf:1,ga:1,comp:"Liga",notes:""},{id:"m3",date:daysAgo(7),rival:"Rival Demo C",venue:"Local",gf:3,ga:0,comp:"Amistoso",notes:""}],
  plays:[],board:{}};
}
function loadState(){
 try{
  const raw=store.get(KEY);if(raw)return migrate(JSON.parse(raw));
  const old=store.get(OLD_KEY);if(old)return migrate(JSON.parse(old));
 }catch(e){console.warn("Datos locales ilegibles; se conserva copia y se inicia demo.",e);try{store.set(KEY+"_corrupt",store.get(KEY)||"")}catch(_){}}
 return normalize(makeDemo());
}
let state=loadState();
const ui={page:"dashboard",profileId:null,tacInit:false,mode:"move",color:"#f5b942",aiList:[]};

/* ===================== Persistencia ===================== */
let saveTimer;
function persist(){clearTimeout(saveTimer);saveTimer=setTimeout(flush,200)}
function flush(){clearTimeout(saveTimer);const ok=store.set(KEY,JSON.stringify(state));if(!ok&&!$("#app").hidden)renderBanner();return ok}
function commit(){persist();renderCurrent()}
addEventListener("pagehide",flush);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush()});

/* ===================== Derivados ===================== */
const byDate=(a,b)=>a.date<b.date?-1:a.date>b.date?1:0;
const getPlayer=id=>state.players.find(p=>p.id===id);
const evalsOf=pid=>state.evaluations.filter(e=>e.playerId===pid).sort(byDate);
const avgOf=e=>Math.round((e.tec+e.tac+e.fis+e.psi)/4);
const latest=pid=>{const l=evalsOf(pid);return l[l.length-1]||null};
const perfOf=p=>{const e=latest(p.id);return e?avgOf(e):null};
function teamDims(){const ls=state.players.map(p=>latest(p.id)).filter(Boolean);return DIMS.map(d=>({...d,value:ls.length?Math.round(ls.reduce((a,e)=>a+e[d.k],0)/ls.length):null}))}
function teamTrend(){const by={};state.evaluations.forEach(e=>{(by[e.date]??=[]).push(avgOf(e))});return Object.keys(by).sort().slice(-8).map(d=>({label:d.slice(8)+"/"+d.slice(5,7),value:Math.round(by[d].reduce((a,b)=>a+b,0)/by[d].length*10)/10}))}
function record(){const r={w:0,d:0,l:0,gf:0,ga:0,n:0};state.matches.forEach(m=>{r.n++;r.gf+=m.gf;r.ga+=m.ga;if(m.gf>m.ga)r.w++;else if(m.gf===m.ga)r.d++;else r.l++});return r}
const outcome=m=>m.gf>m.ga?["G","ok"]:m.gf===m.ga?["E","warn"]:["P","bad"];
const trialDays=()=>Math.max(0,7-Math.floor((Date.now()-state.trialStart)/864e5));
const sessionLoad=t=>t.duration*t.rpe;

/* ===================== Gráficas SVG ===================== */
function radar(vals){
 const cx=160,cy=115,R=78,ang=[-90,0,90,180].map(a=>a*Math.PI/180);
 const pt=(i,v)=>[cx+Math.cos(ang[i])*R*v/100,cy+Math.sin(ang[i])*R*v/100];
 const poly=vs=>vs.map((v,i)=>pt(i,v??0).map(n=>n.toFixed(1)).join(",")).join(" ");
 const grid=[25,50,75,100].map(l=>`<polygon points="${poly([l,l,l,l])}" fill="none" stroke="var(--line)"/>`).join("");
 const axes=ang.map((_,i)=>{const p=pt(i,100);return `<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="var(--line)"/>`}).join("");
 const labels=DIMS.map((d,i)=>{const p=pt(i,124);const a=i===1?"start":i===3?"end":"middle";return `<text x="${p[0].toFixed(1)}" y="${(p[1]+4).toFixed(1)}" text-anchor="${a}" fill="var(--muted)" font-size="11">${d.label} ${vals[i]??"–"}</text>`}).join("");
 const desc=DIMS.map((d,i)=>d.label+" "+(vals[i]??"sin dato")).join(", ");
 return `<svg class="chart" viewBox="0 0 320 230" role="img" aria-label="Radar de capacidades: ${desc}">${grid}${axes}<polygon points="${poly(vals)}" fill="var(--green)" fill-opacity=".25" stroke="var(--green)" stroke-width="2"/>${labels}</svg>`;
}
function lineChart(pts,label){
 if(!pts.length)return `<p class="muted" style="font-size:13px">Aún no hay evaluaciones suficientes para graficar.</p>`;
 const W=520,H=210,L=34,B=28,T=12,Rm=16,vs=pts.map(p=>p.value);
 let lo=Math.max(0,Math.floor(Math.min(...vs)-5)),hi=Math.min(100,Math.ceil(Math.max(...vs)+5));
 if(hi-lo<10){hi=Math.min(100,lo+10);lo=Math.max(0,hi-10)}
 const x=i=>pts.length===1?L+(W-L-Rm)/2:L+i*(W-L-Rm)/(pts.length-1),y=v=>T+(H-T-B)*(1-(v-lo)/(hi-lo));
 const ticks=[lo,Math.round((lo+hi)/2),hi];
 const grid=ticks.map(t=>`<line x1="${L}" x2="${W-Rm}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}" stroke="var(--line)"/><text x="${L-6}" y="${(y(t)+4).toFixed(1)}" text-anchor="end" fill="var(--muted)" font-size="11">${t}</text>`).join("");
 const line=pts.length>1?`<polyline fill="none" stroke="var(--green)" stroke-width="2.5" points="${pts.map((p,i)=>x(i).toFixed(1)+","+y(p.value).toFixed(1)).join(" ")}"/>`:"";
 const dots=pts.map((p,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" fill="var(--green)"><title>${esc(p.label)}: ${p.value}%</title></circle><text x="${x(i).toFixed(1)}" y="${H-8}" text-anchor="middle" fill="var(--muted)" font-size="10">${esc(p.label)}</text>`).join("");
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label||"Evolución")}: ${pts.map(p=>p.label+" "+p.value+"%").join(", ")}">${grid}${line}${dots}</svg>`;
}

/* ===================== Plantillas de render ===================== */
const statusCls={Activo:"ok",Lesionado:"bad",Suspendido:"warn",Baja:"warn"};
const pill=s=>`<span class="status ${statusCls[s]||"ok"}">${esc(s)}</span>`;
const perfBar=v=>v==null?`<span class="muted">Sin evaluar</span>`:`<div class="perf"><b>${v}%</b><div class="progress" aria-hidden="true"><span style="width:${v}%"></span></div></div>`;
const dimBar=(l,v)=>`<div class="kpi"><span>${esc(l)}</span><span>${v==null?"Sin datos":v+"%"}</span></div><div class="progress" role="progressbar" aria-label="${esc(l)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v??0}"><span style="width:${v??0}%"></span></div>`;
const stat=(l,v,s,c="up")=>`<div class="stat"><small>${esc(l)}</small><strong>${v}</strong><span class="${c}">${s}</span></div>`;
const empty=(msg,btn)=>`<div class="empty">${msg}${btn||""}</div>`;
const chipHtml=m=>{const o=outcome(m);return `<span class="chip ${o[1]}" title="${esc(m.rival)} ${m.gf}-${m.ga}">${o[0]}</span>`};

function insights(){
 const out=[];
 if(!state.players.length)return ["Agrega jugadores para empezar a generar análisis."];
 const td=teamDims().filter(d=>d.value!=null);
 if(td.length){const w=td.reduce((a,b)=>b.value<a.value?b:a),b=td.reduce((a,c)=>c.value>a.value?c:a);out.push(`Área a reforzar: <b>${w.label}</b> (${w.value}%). Fortaleza: <b>${b.label}</b> (${b.value}%).`)}
 const stale=state.players.filter(p=>{const l=latest(p.id);return !l||daysBetween(l.date,today())>30});
 if(stale.length)out.push(`<b>${stale.length}</b> jugador(es) sin evaluación en 30 días: ${stale.slice(0,3).map(p=>esc(p.name)).join(", ")}${stale.length>3?"…":""}.`);
 const inj=state.players.filter(p=>p.status==="Lesionado");
 if(inj.length)out.push(`<b>${inj.length}</b> lesionado(s): ${inj.slice(0,3).map(p=>esc(p.name)).join(", ")}${inj.length>3?"…":""}.`);
 const low=state.players.filter(p=>{const v=perfOf(p);return v!=null&&v<70});
 if(low.length)out.push(`${low.length} jugador(es) por debajo de 70%: considera un plan individual.`);
 const last=state.matches.slice().sort(byDate).slice(-5);
 if(last.length>=3){const w=last.filter(m=>m.gf>m.ga).length;out.push(`Últimos ${last.length} partidos: <b>${w}</b> victoria(s).`)}
 const wk=state.trainings.filter(t=>t.date>=daysAgo(7)&&t.date<=today()).length;
 if(!wk)out.push("No hay sesiones registradas en los últimos 7 días.");
 return out.length?out:["Sin alertas. Mantén el ritmo de evaluaciones."];
}

/* ===================== Render de páginas ===================== */
function renderHeader(){
 $("#clubName").textContent=state.club;
 $("#planText").textContent=(state.demo?"DEMO · ":"")+state.plan.toUpperCase();
 $("#userPill").textContent="👤 "+state.user;
 const r=document.documentElement.style;r.setProperty("--green",state.color);r.setProperty("--on-green",onColor(state.color));
 const img=$("#clubLogo");img.onerror=()=>{img.onerror=null;img.src=defaultLogo()};
 const want=state.logo||defaultLogo();if(img.getAttribute("src")!==want)img.src=want;
 const d=trialDays();$("#trialBadge").textContent=d>0?d+" días de prueba":"Prueba finalizada";
}
function defaultLogo(){
 const t=(state.club||"AK").replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g,"").trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase()||"AK";
 return "data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><circle cx='30' cy='30' r='28' fill='${state.color}'/><text x='30' y='38' text-anchor='middle' font-size='20' font-family='Arial' font-weight='bold' fill='${onColor(state.color)}'>${t}</text></svg>`);
}
function renderBanner(){
 const b=[];
 if(!store.ok)b.push(["warn","⚠️ Tu navegador no permite guardar datos locales (modo privado o bloqueado). Exporta un respaldo antes de cerrar."]);
 if(trialDays()===0)b.push(["info","⏳ Terminó el periodo de prueba demo. Esta versión es un prototipo local: tus datos siguen disponibles y puedes exportarlos."]);
 const last=store.get(EXPORT_KEY);
 if(!state.demo&&state.players.length>0&&(!last||daysBetween(last,today())>30))b.push(["info",`💾 Hace más de 30 días que no exportas un respaldo. <button class="linkbtn" data-action="exportData">Exportar ahora</button>`]);
 $("#banner").innerHTML=b.map(x=>`<div class="banner ${x[0]}" role="status">${x[1]}</div>`).join("");
}
function renderDashboard(){
 const ps=state.players,perfs=ps.map(perfOf).filter(v=>v!=null);
 const avg=perfs.length?Math.round(perfs.reduce((a,b)=>a+b,0)/perfs.length):null;
 const tr=teamTrend(),delta=tr.length>1?+(tr[tr.length-1].value-tr[tr.length-2].value).toFixed(1):null;
 const rec=record(),wl=state.trainings.filter(t=>t.date>=daysAgo(7)&&t.date<=today());
 const dg=rec.gf-rec.ga;
 $("#dashStats").innerHTML=
  stat("Jugadores activos",ps.filter(p=>p.status==="Activo").length,`de ${ps.length} en plantilla`)+
  stat("Rendimiento medio",avg==null?"—":avg+"%",delta==null?"Evalúa para ver tendencia":(delta>=0?"↑ +":"↓ ")+delta+" pts vs. evaluación previa",delta!=null&&delta<0?"down":"up")+
  stat("Carga últimos 7 días",wl.reduce((a,t)=>a+sessionLoad(t),0),`${wl.length} sesión(es) · min × RPE`)+
  stat("Partidos",rec.n?`${rec.w}-${rec.d}-${rec.l}`:"—",rec.n?`G-E-P · DG ${dg>0?"+":""}${dg}`:"Sin partidos",dg<0?"down":"up");
 $("#dashDims").innerHTML=teamDims().map(d=>dimBar(d.label,d.value)).join("")+(perfs.length?"":`<p class="muted" style="font-size:12px;margin-top:12px">Registra evaluaciones para ver el perfil real del equipo.</p>`);
 $("#dashTrend").innerHTML=lineChart(tr,"Evolución del rendimiento del equipo");
 const top=ps.map(p=>({p,v:perfOf(p)})).filter(x=>x.v!=null).sort((a,b)=>b.v-a.v).slice(0,5);
 $("#dashTop").innerHTML=top.length?top.map(x=>`<div class="kpi"><button class="linkbtn" data-action="viewPlayer" data-id="${esc(x.p.id)}">${esc(x.p.name)}</button><span>${x.v}%</span></div>`).join(""):empty("Sin jugadores evaluados.");
 const pos={};ps.forEach(p=>pos[p.pos]=(pos[p.pos]||0)+1);
 $("#dashPos").innerHTML=Object.keys(pos).length?Object.entries(pos).map(([k,v])=>`<div class="kpi"><span style="color:var(--text)">${esc(k)}</span><span>${v}</span></div>`).join(""):empty("Sin datos.");
 $("#dashInsights").innerHTML=insights().map(i=>`<li>${i}</li>`).join("");
 const last=state.matches.slice().sort(byDate).slice(-5);
 $("#dashForm").innerHTML=last.length?`<div class="chips">${last.map(chipHtml).join("")}</div>`:empty("Registra partidos para ver la forma reciente.");
}
function renderPlayers(){
 const q=$("#playerSearch").value.trim().toLowerCase(),pos=$("#playerPos").value,sort=$("#playerSort").value;
 const cmp={num:(a,b)=>a.num-b.num,name:(a,b)=>a.name.localeCompare(b.name,"es"),perf:(a,b)=>(perfOf(b)??-1)-(perfOf(a)??-1),age:(a,b)=>a.age-b.age}[sort]||((a,b)=>a.num-b.num);
 const rows=state.players.filter(p=>(!q||p.name.toLowerCase().includes(q)||String(p.num)===q)&&(!pos||p.pos===pos)).sort(cmp);
 $("#playersBody").innerHTML=rows.map(p=>{const id=esc(p.id);return `<tr><td>#${p.num}</td><td><button class="linkbtn" data-action="viewPlayer" data-id="${id}">${esc(p.name)}</button></td><td>${esc(p.pos)}</td><td>${p.age}</td><td>${perfBar(perfOf(p))}</td><td>${pill(p.status)}</td><td><div class="rowactions"><button class="btn btn-dark btn-sm" data-action="newEval" data-id="${id}" aria-label="Evaluar a ${esc(p.name)}">📊</button><button class="btn btn-dark btn-sm" data-action="editPlayer" data-id="${id}" aria-label="Editar a ${esc(p.name)}">✏️</button><button class="btn btn-dark btn-sm" data-action="deletePlayer" data-id="${id}" aria-label="Eliminar a ${esc(p.name)}">🗑️</button></div></td></tr>`}).join("")||`<tr><td colspan="7">${empty(state.players.length?"Ningún jugador coincide con el filtro.":"Aún no hay jugadores.",state.players.length?"":`<br><button class="btn btn-primary" data-action="newPlayer">+ Agregar jugador</button>`)}</td></tr>`;
}
function renderEvaluations(){
 const td=teamDims();
 $("#evRadar").innerHTML=radar(td.map(d=>d.value));
 $("#evDims").innerHTML=td.map(d=>dimBar(d.label,d.value)).join("");
 $("#evTrend").innerHTML=lineChart(teamTrend(),"Evolución del equipo");
 const rows=state.evaluations.slice().sort(byDate).reverse();
 $("#evBody").innerHTML=rows.map(e=>{const p=getPlayer(e.playerId);return `<tr><td>${fmtDate(e.date)}</td><td>${p?`<button class="linkbtn" data-action="viewPlayer" data-id="${esc(p.id)}">${esc(p.name)}</button>`:"—"}</td><td>${e.tec}</td><td>${e.tac}</td><td>${e.fis}</td><td>${e.psi}</td><td><b>${avgOf(e)}%</b></td><td><div class="rowactions"><button class="btn btn-dark btn-sm" data-action="deleteEval" data-id="${esc(e.id)}" aria-label="Eliminar evaluación">🗑️</button></div></td></tr>`}).join("")||`<tr><td colspan="8">${empty("Todavía no hay evaluaciones.",`<br><button class="btn btn-primary" data-action="newEval">+ Nueva evaluación</button>`)}</td></tr>`;
}
function renderTraining(){
 const list=state.trainings.slice().sort((a,b)=>b.date.localeCompare(a.date));
 const wl=state.trainings.filter(t=>t.date>=daysAgo(7)&&t.date<=today());
 const load=wl.reduce((a,t)=>a+sessionLoad(t),0),mins=wl.reduce((a,t)=>a+t.duration,0);
 $("#trainSummary").innerHTML=stat("Sesiones (7 días)",wl.length,"registradas")+stat("Minutos (7 días)",mins,"tiempo total")+stat("Carga semanal",load,"min × RPE")+stat("Total sesiones",state.trainings.length,"en tu historial");
 $("#trainingList").innerHTML=list.length?list.map(t=>{const id=esc(t.id);return `<article class="panel trcard"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="badge">${esc(t.category)}</span><span class="muted" style="font-size:12px">${fmtDate(t.date)}</span></div><h3 style="margin:0">${esc(t.name)}</h3><p class="muted" style="font-size:13px">${esc(t.objective)||"Sin objetivo definido"}</p><div class="meta"><span>⏱ ${t.duration} min</span><span>💪 RPE ${t.rpe}</span><span>📈 Carga ${sessionLoad(t)}</span></div>${t.blocks?`<pre>${esc(t.blocks)}</pre>`:""}<div class="rowactions" style="justify-content:flex-start"><button class="btn btn-dark btn-sm" data-action="editTraining" data-id="${id}">✏️ Editar</button><button class="btn btn-dark btn-sm" data-action="dupTraining" data-id="${id}">📄 Duplicar</button><button class="btn btn-dark btn-sm" data-action="deleteTraining" data-id="${id}" aria-label="Eliminar sesión">🗑️</button></div></article>`}).join(""):empty("Aún no hay sesiones.",`<br><button class="btn btn-primary" data-action="newTraining">+ Crear sesión</button>`);
}
function renderMatches(){
 const r=record();
 $("#matchSummary").innerHTML=stat("Partidos",r.n,"jugados")+stat("Balance G-E-P",r.n?`${r.w}-${r.d}-${r.l}`:"—",r.n?Math.round(r.w/r.n*100)+"% victorias":"Sin partidos")+stat("Goles a favor",r.gf,r.n?(r.gf/r.n).toFixed(1)+" por partido":"—")+stat("Goles en contra",r.ga,r.n?(r.ga/r.n).toFixed(1)+" por partido":"—",r.ga>r.gf?"down":"up");
 const rows=state.matches.slice().sort(byDate).reverse();
 $("#matchesBody").innerHTML=rows.map(m=>{const o=outcome(m),id=esc(m.id);return `<tr><td>${fmtDate(m.date)}</td><td>${esc(m.rival)}</td><td>${esc(m.venue)}</td><td><span class="status ${o[1]}">${o[0]}</span> <b>${m.gf} - ${m.ga}</b></td><td>${esc(m.comp)}</td><td>${esc(m.notes)}</td><td><div class="rowactions"><button class="btn btn-dark btn-sm" data-action="editMatch" data-id="${id}" aria-label="Editar partido">✏️</button><button class="btn btn-dark btn-sm" data-action="deleteMatch" data-id="${id}" aria-label="Eliminar partido">🗑️</button></div></td></tr>`}).join("")||`<tr><td colspan="7">${empty("Aún no hay partidos.",`<br><button class="btn btn-primary" data-action="newMatch">+ Registrar partido</button>`)}</td></tr>`;
}
function renderClubForm(){$("#clubInput").value=state.club;$("#coachInput").value=state.user;$("#colorInput").value=state.color;$("#logoInput").value=state.logo&&state.logo.startsWith("https")?state.logo:""}
function renderData(){
 const kb=(JSON.stringify(state).length/1024).toFixed(1);
 $("#storageInfo").textContent=store.ok?`Tus datos se guardan automáticamente en este navegador (${kb} KB usados).`:`⚠️ El navegador bloquea el guardado local. Tus datos solo viven mientras la pestaña esté abierta: exporta un respaldo.`;
 const l=store.get(EXPORT_KEY);$("#lastExport").textContent=l?"Último respaldo: "+fmtDate(l):"Aún no has exportado un respaldo.";
}
const renderers={dashboard:renderDashboard,players:renderPlayers,evaluations:renderEvaluations,training:renderTraining,matches:renderMatches,tactics:renderTactics,assistant:()=>{},club:renderClubForm,data:renderData};
function renderCurrent(){
 renderHeader();renderBanner();
 try{(renderers[ui.page]||(()=>{}))()}catch(e){console.error("Error al renderizar",ui.page,e);toast("Ocurrió un error al mostrar esta sección.")}
 if($("#profileDlg").open&&ui.profileId)renderProfile();
}

/* ===================== Perfil de jugador ===================== */
function openProfile(id){if(!getPlayer(id))return;ui.profileId=id;renderProfile();openDlg("profileDlg")}
function renderProfile(){
 const p=getPlayer(ui.profileId);if(!p){closeDlg("profileDlg");return}
 const es=evalsOf(p.id),l=es[es.length-1],id=esc(p.id);
 const pts=es.map(e=>({label:e.date.slice(8)+"/"+e.date.slice(5,7),value:avgOf(e)})).slice(-10);
 $("#profileBody").innerHTML=`<div class="modalhead"><div class="profilehead"><h3 id="profileName">#${p.num} ${esc(p.name)}</h3>${pill(p.status)}<span class="muted">${esc(p.pos)} · ${p.age} años</span></div><button class="close noprint" data-action="closeDlg" aria-label="Cerrar">✕</button></div>
 <div class="profilegrid"><div class="panel"><h3>Perfil actual${l?` <small class="muted">(${fmtDate(l.date)})</small>`:""}</h3>${radar(DIMS.map(d=>l?l[d.k]:null))}<p style="margin-top:8px">Rendimiento: <b>${l?avgOf(l)+"%":"Sin evaluar"}</b></p></div><div class="panel"><h3>Evolución</h3>${lineChart(pts,"Evolución de "+p.name)}</div></div>
 ${p.notes?`<div class="panel" style="margin-top:14px"><h3>Notas</h3><p class="muted" style="white-space:pre-wrap;font-size:13px;line-height:1.6">${esc(p.notes)}</p></div>`:""}
 <div class="panel tablewrap" style="margin-top:14px"><h3>Historial de evaluaciones</h3><table class="table"><thead><tr><th>Fecha</th><th>Téc.</th><th>Tác.</th><th>Fís.</th><th>Psi.</th><th>General</th><th></th></tr></thead><tbody>${es.slice().reverse().map(e=>`<tr><td>${fmtDate(e.date)}</td><td>${e.tec}</td><td>${e.tac}</td><td>${e.fis}</td><td>${e.psi}</td><td><b>${avgOf(e)}%</b></td><td class="noprint"><button class="btn btn-dark btn-sm" data-action="deleteEval" data-id="${esc(e.id)}" aria-label="Eliminar evaluación">🗑️</button></td></tr>`).join("")||`<tr><td colspan="7">Sin evaluaciones.</td></tr>`}</tbody></table></div>
 <div class="modalfoot noprint"><button class="btn btn-dark" data-action="print">🖨️ Imprimir informe</button><button class="btn btn-dark" data-action="editPlayer" data-id="${id}">✏️ Editar</button><button class="btn btn-primary" data-action="newEval" data-id="${id}">+ Evaluar</button></div>`;
}

/* ===================== Diálogos y toasts ===================== */
function openDlg(id){const d=$("#"+id);if(d.open)return;if(typeof d.showModal==="function")d.showModal();else d.setAttribute("open","")}
function closeDlg(id){const d=$("#"+id);if(!d)return;if(typeof d.close==="function")d.close();else d.removeAttribute("open")}
function askConfirm(msg,okLabel="Continuar"){
 return new Promise(res=>{const d=$("#confirmDlg");$("#confirmMsg").textContent=msg;$("#confirmOk").textContent=okLabel;
  d.addEventListener("close",()=>res(d.returnValue==="yes"),{once:true});d.returnValue="";openDlg("confirmDlg")});
}
let toastTimer;
function toast(msg,opt={}){
 const t=$("#toast");t.textContent=msg;
 if(opt.undo){const b=document.createElement("button");b.type="button";b.textContent="Deshacer";b.onclick=()=>{opt.undo();t.classList.remove("show")};t.appendChild(b)}
 t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),opt.undo?6000:2600);
}
function destructive(fn,msg){
 const snap=JSON.stringify(state);fn();commit();
 toast(msg,{undo:()=>{state=normalize(JSON.parse(snap));commit()}});
}
function download(name,text,type){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([text],{type}));a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}

/* ===================== Formularios ===================== */
const nextNum=()=>{const used=new Set(state.players.map(p=>p.num));for(let i=1;i<100;i++)if(!used.has(i))return i;return 0};
function openPlayerForm(id){
 const p=id?getPlayer(id):null;
 $("#playerTitle").textContent=p?"Editar jugador":"Nuevo jugador";$("#pId").value=p?p.id:"";
 $("#pNum").value=p?p.num:nextNum();$("#pName").value=p?p.name:"";$("#pPos").value=p?p.pos:"Mediocampista";$("#pAge").value=p?p.age:18;$("#pStatus").value=p?p.status:"Activo";$("#pNotes").value=p?p.notes:"";
 openDlg("playerDlg");setTimeout(()=>$("#pName").focus(),0);
}
function openEvalForm(pid){
 if(!state.players.length){toast("Primero agrega un jugador");return}
 $("#evPlayer").innerHTML=state.players.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
 if(pid&&getPlayer(pid))$("#evPlayer").value=pid;
 $("#evDate").value=today();fillEvalDefaults();openDlg("evalDlg");
}
function fillEvalDefaults(){
 const l=latest($("#evPlayer").value);
 [["evTec","tec"],["evTac","tac"],["evFis","fis"],["evPsi","psi"]].forEach(([i,k])=>{const el=$("#"+i);el.value=l?l[k]:70;el.parentElement.querySelector("output").textContent=el.value});
}
function openTrainingForm(id,dup){
 const t=id?state.trainings.find(x=>x.id===id):null;
 $("#trainTitle").textContent=t&&!dup?"Editar sesión":"Nueva sesión";$("#tId").value=t&&!dup?t.id:"";
 $("#tName").value=t?t.name+(dup?" (copia)":""):"";$("#tDate").value=t&&!dup?t.date:today();$("#tDur").value=t?t.duration:90;$("#tRpe").value=t?t.rpe:6;$("#tCat").value=t?t.category:"";$("#tObj").value=t?t.objective:"";$("#tBlocks").value=t?t.blocks:"";
 openDlg("trainingDlg");setTimeout(()=>$("#tName").focus(),0);
}
function openMatchForm(id){
 const m=id?state.matches.find(x=>x.id===id):null;
 $("#matchTitle").textContent=m?"Editar partido":"Registrar partido";$("#mId").value=m?m.id:"";
 $("#mDate").value=m?m.date:today();$("#mRival").value=m?m.rival:"";$("#mVenue").value=m?m.venue:"Local";$("#mComp").value=m?m.comp:"";$("#mGf").value=m?m.gf:0;$("#mGa").value=m?m.ga:0;$("#mNotes").value=m?m.notes:"";
 openDlg("matchDlg");setTimeout(()=>$("#mRival").focus(),0);
}

/* ===================== CSV ===================== */
function parseCSV(text,d){
 const rows=[];let row=[],cur="",q=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}else cur+=c}
  else if(c==='"')q=true;else if(c===d){row.push(cur);cur=""}
  else if(c==="\n"||c==="\r"){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cur);rows.push(row);row=[];cur=""}else cur+=c}
 if(cur!==""||row.length){row.push(cur);rows.push(row)}
 return rows.filter(r=>r.some(x=>x.trim()));
}
const plain=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
function importCSVText(text){
 text=text.replace(/^\uFEFF/,"");
 const first=text.split(/\r?\n/)[0]||"";const delim=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?";":",";
 let rows=parseCSV(text,delim);
 if(rows.length&&isNaN(Number(rows[0][0])))rows=rows.slice(1);
 let ok=0,skip=0;const posMap={};POSITIONS.forEach(p=>posMap[plain(p)]=p);Object.entries({goalkeeper:"Portero",keeper:"Portero",goleiro:"Portero",defender:"Defensa",defensor:"Defensa",zagueiro:"Defensa",midfielder:"Mediocampista",meio:"Mediocampista",winger:"Extremo",forward:"Delantero",striker:"Delantero",atacante:"Delantero"}).forEach(([k,v])=>posMap[k]=v);
 rows.forEach(c=>{
  const name=str(c[1]).slice(0,60);if(!name){skip++;return}
  const p={id:uid(),num:clamp(Math.round(toNum(c[0])),0,99),name,pos:posMap[plain(c[2])]||"Mediocampista",age:clamp(Math.round(toNum(c[3],18)),5,60),status:"Activo",notes:""};
  state.players.push(p);ok++;
  if(c[4]!==undefined&&String(c[4]).trim()!==""){const v=clamp(Math.round(toNum(c[4],0)),0,100);state.evaluations.push({id:uid(),playerId:p.id,date:today(),tec:v,tac:v,fis:v,psi:v})}
 });
 commit();toast(`CSV importado: ${ok} jugador(es)${skip?`, ${skip} omitido(s)`:""}`);
}
const csvCell=v=>{let s=String(v??"");if(/^[=+\-@\t\r]/.test(s))s="'"+s;return /[",;\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
function pickFile(accept,cb){const i=document.createElement("input");i.type="file";i.accept=accept;i.onchange=()=>{const f=i.files&&i.files[0];if(f)cb(f)};i.click()}

/* ===================== Pizarra táctica ===================== */
const tac=()=>state.board;
function pitchFutbol(){
 let s="";for(let i=0;i<10;i++)s+=`<rect x="${i*10.5}" y="0" width="10.5" height="68" fill="${i%2?"#0f5d38":"#11663f"}"/>`;
 const L='stroke="rgba(255,255,255,.8)" stroke-width=".35" fill="none"';
 return s+`<g ${L}><rect x="2" y="2" width="101" height="64"/><line x1="52.5" y1="2" x2="52.5" y2="66"/><circle cx="52.5" cy="34" r="9.15"/><rect x="2" y="13.84" width="16.5" height="40.32"/><rect x="2" y="24.84" width="5.5" height="18.32"/><rect x="86.5" y="13.84" width="16.5" height="40.32"/><rect x="97.5" y="24.84" width="5.5" height="18.32"/></g><circle cx="52.5" cy="34" r=".6" fill="#fff"/>`;
}
const tokenText=t=>t.type==="ball"?(BALLS[tac().sp]||"⚽"):t.type==="cone"?"🔶":esc(t.label);
const tokenAria=t=>t.type==="home"?"Jugador local "+t.label:t.type==="away"?"Jugador rival "+t.label:t.type==="ball"?"Balón":"Cono";
function renderBoard(){
 const b=tac();
 $("#tokens").innerHTML=b.tokens.map(t=>`<div class="token ${t.type}${t.type==="away"&&!b.rivals?" hidden":""}" tabindex="0" role="button" aria-label="${tokenAria(t)}" data-id="${esc(t.id)}" style="left:${t.x}%;top:${t.y}%">${tokenText(t)}</div>`).join("");
 renderStrokes();
}
function renderStrokes(){
 $("#strokes").innerHTML=tac().strokes.map(s=>{
  const P=s.pts.map(p=>[p[0]*105,p[1]*68]),pts=P.map(p=>p[0].toFixed(2)+","+p[1].toFixed(2)).join(" ");
  let head="";
  if(s.t==="arrow"&&P.length>1){const a=P[0],b=P[P.length-1],an=Math.atan2(b[1]-a[1],b[0]-a[0]),L=3;
   const p1=[b[0]-L*Math.cos(an-.5),b[1]-L*Math.sin(an-.5)],p2=[b[0]-L*Math.cos(an+.5),b[1]-L*Math.sin(an+.5)];
   head=`<polygon points="${b[0].toFixed(2)},${b[1].toFixed(2)} ${p1[0].toFixed(2)},${p1[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}" fill="${s.c}"/>`}
  return `<polyline points="${pts}" fill="none" stroke="${s.c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${head}`;
 }).join("");
}
function renderPlays(){
 $("#playsList").innerHTML=state.plays.length?state.plays.map(p=>`<div class="playitem"><span><b>${esc(p.name)}</b> <span class="muted">· ${esc(sportName(p.sp))} · ${esc(p.hf)} vs ${esc(p.af)} · ${fmtDate(p.created)}${p.kf&&p.kf.a&&p.kf.b?" · con animación":""}</span></span><span class="rowactions"><button class="btn btn-dark btn-sm" data-action="loadPlay" data-id="${esc(p.id)}">Cargar</button><button class="btn btn-dark btn-sm" data-action="deletePlay" data-id="${esc(p.id)}" aria-label="Eliminar jugada">🗑️</button></span></div>`).join(""):empty("Aún no has guardado jugadas.");
}
function renderTactics(){
 initTactics();
 if(!sportAllowed(tac().sp)){stashBoard();state.board=normBoard(state.boards.futbol||{sp:"futbol"})}
 const b=tac(),fo=Object.keys(SPORTS[b.sp].forms).map(f=>`<option value="${f}">${f}</option>`).join("");
 $("#pitch").innerHTML=pitchSVG(b.sp);$("#formHome").innerHTML=fo;$("#formAway").innerHTML=fo;$("#formHome").value=b.hf;$("#formAway").value=b.af;
 $("#sportSel").innerHTML=Object.keys(SPORTS).map(k=>`<option value="${k}">${esc(tr(SPORTS[k].name))}${sportAllowed(k)?"":" 🔒"}</option>`).join("");$("#sportSel").value=b.sp;
 $("#board").classList.toggle("mode-draw",ui.mode!=="move");
 $$('[data-action="setMode"]').forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.mode===ui.mode)));
 $$('[data-action="setColor"]').forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.c===ui.color)));
 renderBoard();renderPlays();updateAnimInfo();
}
function moveToken(id,x,y,el){
 const t=tac().tokens.find(k=>k.id===id);if(!t)return;t.x=x;t.y=y;
 el=el||$(`#tokens [data-id="${CSS.escape(id)}"]`);if(el){el.style.left=x+"%";el.style.top=y+"%"}persist();
}
function applyPositions(list){(list||[]).forEach(o=>{if(tac().tokens.some(t=>t.id===o.id))moveToken(o.id,o.x,o.y)})}
function initTactics(){
 if(ui.tacInit)return;ui.tacInit=true;
 $("#pitch").innerHTML=pitchSVG();
 const opts=Object.keys(FORMS).map(f=>`<option>${f}</option>`).join("");$("#formHome").innerHTML=opts;$("#formAway").innerHTML=opts;
 const layer=$("#tokens"),board=$("#board");let drag=null;
 layer.addEventListener("pointerdown",e=>{const el=e.target.closest(".token");if(!el||ui.mode!=="move")return;e.preventDefault();drag=el;el.setPointerCapture(e.pointerId);el.classList.add("dragging")});
 layer.addEventListener("pointermove",e=>{if(!drag)return;const r=board.getBoundingClientRect();moveToken(drag.dataset.id,clamp((e.clientX-r.left)/r.width*100,1,99),clamp((e.clientY-r.top)/r.height*100,1,99),drag)});
 const end=()=>{if(drag){drag.classList.remove("dragging");drag=null;persist()}};
 layer.addEventListener("pointerup",end);layer.addEventListener("pointercancel",end);
 layer.addEventListener("dblclick",e=>{const el=e.target.closest(".token");if(!el)return;const t=tac().tokens.find(k=>k.id===el.dataset.id);if(t&&(t.type==="ball"||t.type==="cone"))removeToken(t.id)});
 layer.addEventListener("keydown",e=>{
  const el=e.target.closest(".token");if(!el)return;const t=tac().tokens.find(k=>k.id===el.dataset.id);if(!t)return;
  const s=e.shiftKey?5:1,mv={ArrowLeft:[-s,0],ArrowRight:[s,0],ArrowUp:[0,-s],ArrowDown:[0,s]}[e.key];
  if(mv){e.preventDefault();moveToken(t.id,clamp(t.x+mv[0],1,99),clamp(t.y+mv[1],1,99),el)}
  else if((e.key==="Delete"||e.key==="Backspace")&&(t.type==="ball"||t.type==="cone")){e.preventDefault();removeToken(t.id)}
 });
 const draw=$("#drawlayer");let cur=null;
 const pt=e=>{const r=draw.getBoundingClientRect();return [clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1)]};
 draw.addEventListener("pointerdown",e=>{if(ui.mode==="move")return;e.preventDefault();draw.setPointerCapture(e.pointerId);cur={t:ui.mode==="arrow"?"arrow":"free",c:ui.color,pts:[pt(e)]};tac().strokes.push(cur);renderStrokes()});
 draw.addEventListener("pointermove",e=>{if(!cur)return;const p=pt(e);if(cur.t==="arrow")cur.pts=[cur.pts[0],p];else{const l=cur.pts[cur.pts.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>.004)cur.pts.push(p)}renderStrokes()});
 const stop=()=>{if(cur){if(cur.pts.length<2&&cur.t==="arrow")tac().strokes.pop();cur=null;renderStrokes();persist()}};
 draw.addEventListener("pointerup",stop);draw.addEventListener("pointercancel",stop);
 const regen=()=>{const b=tac();b.hf=$("#formHome").value;b.af=$("#formAway").value;b.tokens=buildTokens(b.hf,b.af,b.sp).concat(b.tokens.filter(t=>t.type==="ball"||t.type==="cone"));b.kf={a:null,b:null,m:[]};renderBoard();persist()};
 $("#sportSel").addEventListener("change",e=>{const sp=e.target.value;if(!sportAllowed(sp)){toast(tr("Disponible desde el plan ")+PLAN_NAMES[SPORTS[sp].min]);e.target.value=tac().sp;return}setSport(sp)});
 $("#formHome").addEventListener("change",regen);$("#formAway").addEventListener("change",regen);
}
function removeToken(id){const b=tac();b.tokens=b.tokens.filter(t=>t.id!==id);renderBoard();persist();toast("Material quitado")}
const reduceMotion=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
let animTimers=[];
function updateAnimInfo(){const k=tac().kf,el=$("#animInfo");if(!el)return;el.textContent=tr("Inicio")+": "+(k.a?"✔":"—")+" · "+tr("Pasos")+": "+((k.m||[]).length)+" · "+tr("Final")+": "+(k.b?"✔":"—")}
function playAnim(){
 const b=tac();if(!b.kf.a||!b.kf.b){toast("Fija primero el inicio y el final");return}
 animTimers.forEach(clearTimeout);animTimers=[];
 const frames=[b.kf.a].concat(b.kf.m||[],[b.kf.b]),board=$("#board"),STEP=1600;
 board.classList.remove("animating");applyPositions(frames[0]);void board.offsetWidth;board.classList.add("animating");
 frames.slice(1).forEach((f,i)=>animTimers.push(setTimeout(()=>applyPositions(f),80+i*STEP)));
 animTimers.push(setTimeout(()=>board.classList.remove("animating"),80+(frames.length-1)*STEP+200));
}
const snapshotPositions=()=>tac().tokens.map(t=>({id:t.id,x:t.x,y:t.y}));

/* ===================== Asistente (modo reglas) ===================== */
const SESSIONS=[
 {re:/presi[oó]n|recuper|p[eé]rdida/i,name:"Presión tras pérdida",category:"Táctico",duration:90,rpe:7,objective:"Recuperar el balón en los primeros 5 segundos tras perderlo",blocks:["10' Activación con balón y movilidad","20' Rondo 5v2 con regla de 5 segundos para presionar","30' Juego reducido 6v6: gol doble si se recupera arriba","20' Juego condicionado 8v8: puntos por recuperación en campo rival","10' Vuelta a la calma y feedback"],tip:"Evalúa: recuperaciones en campo rival, distancia entre líneas y decisión del primer pase."},
 {re:/velocidad|r[aá]pid|aceler/i,name:"Velocidad y reacción",category:"Físico",duration:80,rpe:7,objective:"Mejorar aceleración, cambios de dirección y reacción",blocks:["15' Movilidad y activación neuromuscular","20' Aceleraciones de 10-15 m con recuperación completa","20' Cambios de dirección y reacción a estímulo visual","15' Juego reducido de transiciones rápidas","10' Vuelta a la calma"],tip:"Registra tiempo, repeticiones y calidad técnica para comparar la evolución."},
 {re:/finaliz|tiro|remate|gol/i,name:"Definición y finalización",category:"Técnico",duration:80,rpe:6,objective:"Aumentar la eficacia de remate en distintos contextos",blocks:["10' Activación","25' Remates desde distintos ángulos y distancias","25' Centros y remate en 1 toque","15' Juego 5v5 con porterías pequeñas","5' Feedback"],tip:"Mide remates a puerta / remates totales por sesión."},
 {re:/resisten|f[ií]sic|aer[oó]bic|condici[oó]n/i,name:"Resistencia con balón",category:"Físico",duration:90,rpe:7,objective:"Desarrollar la resistencia aeróbica de forma específica",blocks:["10' Activación","40' Juegos de posesión de gran espacio (4×8' con pausa de 2')","25' Juego 9v9 de intensidad media","15' Movilidad y regeneración"],tip:"Controla percepción de esfuerzo (RPE) al final de la sesión."},
 {re:/bal[oó]n parado|corner|tiro libre|set piece/i,name:"Balón parado",category:"Táctico",duration:70,rpe:5,objective:"Automatizar jugadas de córner y tiros libres",blocks:["10' Activación","25' Córners ofensivos: movimientos y bloqueos","20' Defensa de balón parado: marca mixta","15' Tiros libres directos e indirectos"],tip:"Registra goles y ocasiones generadas desde balón parado."},
 {re:/salida|construcci|posesi[oó]n|pase/i,name:"Salida de balón y construcción",category:"Técnico-táctico",duration:90,rpe:6,objective:"Superar la primera línea de presión con pases verticales",blocks:["10' Activación con pases","20' Rondo 4v2 con cambios de orientación","30' Juego de posición 7v5 con zonas","20' Partido 9v9 con salida obligatoria desde el portero","10' Feedback"],tip:"Evalúa: pases que rompen líneas, pérdidas en campo propio y apoyos del portero."}
];
const DEF_CHIPS=["Presión tras pérdida","Velocidad","Finalización","Resistencia","Balón parado","Salida de balón","Resumen del equipo"];
function summaryReply(){
 const td=teamDims(),r=record();
 const dims=td.every(d=>d.value==null)?"Aún no hay evaluaciones.":td.map(d=>`${d.label} ${d.value}%`).join(" · ");
 const perfs=state.players.map(perfOf).filter(v=>v!=null);
 return `<b>Resumen del equipo</b><br>Plantilla: ${state.players.length} jugadores (${state.players.filter(p=>p.status==="Activo").length} activos).<br>Rendimiento medio: ${perfs.length?Math.round(perfs.reduce((a,b)=>a+b,0)/perfs.length)+"%":"—"}.<br>Perfil: ${dims}.<br>Partidos: ${r.n?`${r.w}G ${r.d}E ${r.l}P, goles ${r.gf}-${r.ga}`:"sin registro"}.<br><br>${insights().map(i=>"• "+i).join("<br>")}`;
}
function botReply(t){
 if(/resumen|estado del equipo|c[oó]mo (est[aá]|va)|diagn[oó]stic/i.test(t))return{html:summaryReply()};
 if(/lesi[oó]n|lesionad/i.test(t)){const l=state.players.filter(p=>p.status==="Lesionado");return{html:l.length?"Jugadores lesionados: "+l.map(p=>`${esc(p.name)} (#${p.num})`).join(", ")+".":"No hay jugadores marcados como lesionados."}}
 if(/mejor|top|destac/i.test(t)){const top=state.players.map(p=>({p,v:perfOf(p)})).filter(x=>x.v!=null).sort((a,b)=>b.v-a.v).slice(0,3);return{html:top.length?"Mejor rendimiento actual: "+top.map(x=>`${esc(x.p.name)} (${x.v}%)`).join(", ")+".":"Aún no hay evaluaciones para decirlo."}}
 const s=SESSIONS.find(x=>x.re.test(t));
 if(s)return{html:`<b>${esc(s.name)}</b> · ${s.duration} min · RPE ${s.rpe}<br>Objetivo: ${esc(s.objective)}<pre>${esc(s.blocks.join("\n"))}</pre>${esc(s.tip)}<br><button class="btn btn-primary btn-sm" style="margin-top:8px" data-action="saveAiSession" data-i="${ui.aiList.push(s)-1}">💾 Guardar como sesión</button>`};
 return{html:`Aún no tengo una plantilla para eso. Prueba con alguno de estos temas:<div class="chips" style="margin-top:8px">${DEF_CHIPS.map(c=>`<button class="btn btn-dark btn-sm" data-action="askChip" data-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>`};
}
async function sendMessage(text){
 text=text.trim();if(!text)return;
 const m=$("#messages");m.insertAdjacentHTML("beforeend",`<div class="bubble user">${esc(text)}</div>`);
 let bubble=null;
 if(AI_ENDPOINT){
  try{
   const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),15000);
   const res=await fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,context:{players:state.players.length,team:teamDims(),record:record()}}),signal:ctl.signal});clearTimeout(to);
   const j=await res.json();if(j&&typeof j.reply==="string"){bubble=document.createElement("div");bubble.className="bubble ai";bubble.textContent=j.reply;m.appendChild(bubble)}
  }catch(e){console.warn("IA externa no disponible, uso reglas locales",e)}
 }
 if(!bubble)m.insertAdjacentHTML("beforeend",`<div class="bubble ai">${botReply(text).html}</div>`);
 m.scrollTop=m.scrollHeight;
}

/* ===================== Acciones (delegación) ===================== */
const actions={
 openLogin(d){ui.plan=d.plan||state.plan;if(store.get(SESSION_KEY)==="1"){if(d.plan&&d.plan!==state.plan){state.plan=d.plan;persist();toast(tr("Plan seleccionado: ")+d.plan)}if(location.hash==="#/app/dashboard")route();else location.hash="#/app/dashboard";return}$("#loginUser").value=state.demo?"Entrenador Demo":state.user;$("#loginClub").value=state.club;openDlg("loginDlg")},
 showPublic(){location.hash="#/"},
 closeDlg(d,el){const dlg=el.closest("dialog");if(dlg)closeDlg(dlg.id)},
 print(){window.print()},
 newPlayer(){openPlayerForm()},editPlayer(d){openPlayerForm(d.id)},viewPlayer(d){openProfile(d.id)},
 deletePlayer(d){const p=getPlayer(d.id);if(!p)return;destructive(()=>{state.players=state.players.filter(x=>x.id!==d.id);state.evaluations=state.evaluations.filter(e=>e.playerId!==d.id);if(ui.profileId===d.id)closeDlg("profileDlg")},`Jugador «${p.name}» eliminado`)},
 newEval(d){openEvalForm(d.id)},
 deleteEval(d){destructive(()=>{state.evaluations=state.evaluations.filter(e=>e.id!==d.id)},"Evaluación eliminada")},
 newTraining(){openTrainingForm()},editTraining(d){openTrainingForm(d.id)},dupTraining(d){openTrainingForm(d.id,true)},
 deleteTraining(d){destructive(()=>{state.trainings=state.trainings.filter(t=>t.id!==d.id)},"Sesión eliminada")},
 newMatch(){openMatchForm()},editMatch(d){openMatchForm(d.id)},
 deleteMatch(d){destructive(()=>{state.matches=state.matches.filter(m=>m.id!==d.id)},"Partido eliminado")},
 importCSV(){pickFile(".csv,text/csv",f=>{const r=new FileReader();r.onload=()=>{const t=String(r.result);if(t.includes("\uFFFD")){const r2=new FileReader();r2.onload=()=>importCSVText(String(r2.result));r2.readAsText(f,"windows-1252")}else importCSVText(t)};r.readAsText(f)})},
 exportCSV(){const head=["dorsal","nombre","posicion","edad","rendimiento"].map(tr);const rows=state.players.map(p=>[p.num,p.name,p.pos,p.age,perfOf(p)??""]);download("jugadores.csv","\uFEFF"+[head].concat(rows).map(r=>r.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8");toast("CSV descargado")},
 exportData(){flush();download("ak-sports-respaldo-"+today()+".json",JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),"application/json");store.set(EXPORT_KEY,today());renderCurrent();toast("Respaldo descargado")},
 importData(){pickFile("application/json,.json",f=>{const r=new FileReader();r.onload=async()=>{
  let o;try{o=JSON.parse(String(r.result))}catch(_){toast("El archivo no es un JSON válido");return}
  if(!o||typeof o!=="object"||!Array.isArray(o.players)){toast("El archivo no parece un respaldo de AK Sports");return}
  if(await askConfirm(`Se reemplazarán tus datos actuales por el respaldo (${o.players.length} jugadores). ¿Continuar?`,"Reemplazar")){state=migrate(o);ui.profileId=null;commit();flush();toast("Respaldo importado")}};r.readAsText(f)})},
 saveNow(){const ok=flush();renderCurrent();toast(ok?"Datos guardados":"No se pudo guardar: exporta un respaldo")},
 async resetDemo(){if(await askConfirm("Se restablecerán los datos de demostración y se perderán los cambios actuales.","Restablecer")){state=normalize(makeDemo());commit();flush();toast("Demo restablecida")}},
 async startEmpty(){if(await askConfirm("Se borrarán jugadores, evaluaciones, sesiones, partidos y jugadas. Conservarás nombre del club y entrenador. Te recomendamos exportar un respaldo antes.","Empezar vacío")){const k={user:state.user,club:state.club,color:state.color,logo:state.logo,plan:state.plan};state=normalize({...k,trialStart:state.trialStart,demo:false});commit();flush();toast("Club vacío listo")}},
 setMode(d){ui.mode=d.mode;renderTactics()},setColor(d){ui.color=d.c;renderTactics()},
 undoStroke(){tac().strokes.pop();renderStrokes();persist()},
 clearStrokes(){if(!tac().strokes.length)return;const s=clone(tac().strokes);tac().strokes=[];renderStrokes();persist();toast("Dibujo borrado",{undo:()=>{tac().strokes=s;renderStrokes();persist()}})},
 toggleRivals(){tac().rivals=!tac().rivals;renderBoard();persist()},
 addGear(d){tac().tokens.push({id:uid(),type:d.type,label:"",x:50,y:50});renderBoard();persist()},
 resetBoard(){const b=tac();b.tokens=buildTokens(b.hf,b.af,b.sp);b.kf={a:null,b:null,m:[]};renderBoard();persist();toast("Posiciones iniciales")},
 fixStart(){const k=tac().kf;k.a=snapshotPositions();k.m=[];k.b=null;persist();updateAnimInfo();toast("Inicio fijado: mueve las fichas, agrega pasos y fija el final")},addStep(){const k=tac().kf;if(!k.a){toast("Primero fija el inicio");return}k.m=k.m||[];if(k.m.length>=20){toast("Máximo 20 pasos");return}k.m.push(snapshotPositions());persist();updateAnimInfo();toast("Paso "+k.m.length+" agregado")},
 fixEnd(){if(!tac().kf.a){toast("Primero fija el inicio");return}tac().kf.b=snapshotPositions();persist();updateAnimInfo();toast("Final fijado: ya puedes reproducir")},
 playAnim(){playAnim()},
 gotoStart(){if(!tac().kf.a){toast("Aún no fijas un inicio");return}applyPositions(tac().kf.a)},
 savePlay(){$("#playName").value="";openDlg("playDlg");setTimeout(()=>$("#playName").focus(),0)},
 loadPlay(d){const p=state.plays.find(x=>x.id===d.id);if(!p)return;const sp=SPORTS[p.sp]?p.sp:"futbol";if(!sportAllowed(sp)){toast(tr("Disponible desde el plan ")+PLAN_NAMES[SPORTS[sp].min]);return}const{hf,af,tokens,strokes,rivals,kf}=clone(p);stashBoard();state.board=normBoard({sp,hf,af,tokens,strokes,rivals,kf});renderTactics();persist();toast("Jugada «"+p.name+"» cargada")},
 deletePlay(d){destructive(()=>{state.plays=state.plays.filter(p=>p.id!==d.id)},"Jugada eliminada")},
 askChip(d){sendMessage(d.q)},
 saveAiSession(d){const s=ui.aiList[Number(d.i)];if(!s)return;state.trainings.push({id:uid(),name:s.name,date:today(),duration:s.duration,rpe:s.rpe,category:s.category,objective:s.objective,blocks:s.blocks.join("\n")});persist();toast("Sesión guardada en Entrenamientos")}
};
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el)return;
 const fn=actions[el.dataset.action];if(!fn)return;
 e.preventDefault();fn(el.dataset,el,e);
});

/* ===================== Formularios: envío ===================== */
$("#loginForm").addEventListener("submit",e=>{
 e.preventDefault();
 state.user=str($("#loginUser").value,"Entrenador").slice(0,60);state.club=str($("#loginClub").value,"Mi Club").slice(0,60);
 if(ui.plan)state.plan=ui.plan;
 store.set(SESSION_KEY,"1");flush();closeDlg("loginDlg");
 if(location.hash==="#/app/dashboard")route();else location.hash="#/app/dashboard";toast("Bienvenido a "+state.club);
});
$("#playerForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=$("#pId").value,d={num:clamp(Math.round(toNum($("#pNum").value)),0,99),name:$("#pName").value.trim().slice(0,60),pos:$("#pPos").value,age:clamp(Math.round(toNum($("#pAge").value,18)),5,60),status:$("#pStatus").value,notes:$("#pNotes").value.trim().slice(0,500)};
 if(!d.name){toast("Escribe el nombre del jugador");return}
 const dup=state.players.some(p=>p.num===d.num&&p.id!==id);
 if(id&&getPlayer(id))Object.assign(getPlayer(id),d);else state.players.push({id:uid(),...d});
 closeDlg("playerDlg");commit();toast(dup?"Guardado (ojo: dorsal repetido)":"Jugador guardado");
});
$("#evPlayer").addEventListener("change",fillEvalDefaults);
$("#evalForm").addEventListener("submit",e=>{
 e.preventDefault();
 const pid=$("#evPlayer").value;if(!getPlayer(pid))return;
 const g=i=>clamp(Math.round(toNum($("#"+i).value)),0,100);
 state.evaluations.push({id:uid(),playerId:pid,date:validDate($("#evDate").value)?$("#evDate").value:today(),tec:g("evTec"),tac:g("evTac"),fis:g("evFis"),psi:g("evPsi")});
 closeDlg("evalDlg");commit();toast("Evaluación guardada");
});
$("#trainingForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=$("#tId").value,d={name:str($("#tName").value,"Sesión").slice(0,80),date:validDate($("#tDate").value)?$("#tDate").value:today(),duration:clamp(Math.round(toNum($("#tDur").value,60)),5,300),rpe:clamp(Math.round(toNum($("#tRpe").value,5)),1,10),category:str($("#tCat").value,"General").slice(0,30),objective:$("#tObj").value.trim().slice(0,160),blocks:$("#tBlocks").value.trim().slice(0,1500)};
 const t=id?state.trainings.find(x=>x.id===id):null;
 if(t)Object.assign(t,d);else state.trainings.push({id:uid(),...d});
 closeDlg("trainingDlg");commit();toast("Sesión guardada");
});
$("#matchForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=$("#mId").value,d={date:validDate($("#mDate").value)?$("#mDate").value:today(),rival:str($("#mRival").value,"Rival").slice(0,60),venue:$("#mVenue").value,gf:clamp(Math.round(toNum($("#mGf").value)),0,99),ga:clamp(Math.round(toNum($("#mGa").value)),0,99),comp:str($("#mComp").value,"Amistoso").slice(0,40),notes:$("#mNotes").value.trim().slice(0,500)};
 const m=id?state.matches.find(x=>x.id===id):null;
 if(m)Object.assign(m,d);else state.matches.push({id:uid(),...d});
 closeDlg("matchDlg");commit();toast("Partido guardado");
});
$("#playForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=str($("#playName").value,"Jugada").slice(0,60),b=clone(tac());
 state.plays.unshift({id:uid(),name,created:today(),hf:b.hf,af:b.af,tokens:b.tokens,strokes:b.strokes,rivals:b.rivals,kf:b.kf,sp:b.sp});
 state.plays=state.plays.slice(0,50);closeDlg("playDlg");commit();toast("Jugada guardada");
});
$("#clubForm").addEventListener("submit",e=>{
 e.preventDefault();
 const logo=$("#logoInput").value.trim();
 if(logo&&!safeLogo(logo)){toast("La URL del escudo debe empezar con https://");return}
 state.club=str($("#clubInput").value,state.club).slice(0,60);state.user=str($("#coachInput").value,state.user).slice(0,60);state.color=hex($("#colorInput").value)?$("#colorInput").value:state.color;
 if(logo)state.logo=logo;else if(state.logo&&state.logo.startsWith("https"))state.logo="";
 commit();toast("Identidad actualizada");
});
$("#logoFile").addEventListener("change",e=>{
 const f=e.target.files&&e.target.files[0];if(!f)return;
 if(!/^image\/(png|jpeg|webp)$/.test(f.type)||f.size>5e6){toast("Usa PNG, JPG o WebP de máximo 5 MB");return}
 const url=URL.createObjectURL(f),img=new Image();
 img.onload=()=>{const c=document.createElement("canvas");c.width=c.height=128;const x=c.getContext("2d"),s=Math.min(img.width,img.height);x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,128,128);URL.revokeObjectURL(url);state.logo=c.toDataURL("image/png");$("#logoInput").value="";commit();toast("Escudo actualizado")};
 img.onerror=()=>{URL.revokeObjectURL(url);toast("No se pudo leer la imagen")};img.src=url;
});
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();const i=$("#chatInput");const t=i.value;i.value="";sendMessage(t)});
["playerSearch","playerPos","playerSort"].forEach(id=>$("#"+id).addEventListener("input",renderPlayers));
document.addEventListener("input",e=>{if(e.target.matches&&e.target.matches('input[type="range"]')){const o=e.target.parentElement.querySelector("output");if(o)o.textContent=e.target.value}});
let mdT=null;document.addEventListener("mousedown",e=>{mdT=e.target},true);$$("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d&&mdT===d)d.close()}));
document.addEventListener("keydown",e=>{
 if(ui.page==="tactics"&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"&&!/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||""))){e.preventDefault();actions.undoStroke()}
});

/* ===================== Router (hash) ===================== */
function setPublicCTA(){$("#publicCta").textContent=store.get(SESSION_KEY)==="1"?"Ir a mi panel":"Entrar / Probar gratis"}
function showPublicView(){$("#app").hidden=true;$("#publicSite").hidden=false;document.title=tr("AK Sports Intelligence V4 — Plataforma de Rendimiento Deportivo");setPublicCTA()}
function showApp(page,first){
 ui.page=page;$("#publicSite").hidden=true;$("#app").hidden=false;
 $$(".navitem").forEach(a=>{if(a.dataset.page===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
 $$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));
 document.title=tr($("#page-"+page).dataset.title)+" · "+state.club;
 renderCurrent();window.scrollTo(0,0);if(!first)$("#main").focus({preventScroll:true});
}
let routed=false;
function route(){
 const m=/^#\/app\/([a-z]+)/.exec(location.hash);
 if(m&&PAGES.includes(m[1])){
  if(store.get(SESSION_KEY)!=="1"){history.replaceState(null,"","#/");showPublicView();openDlg("loginDlg");return}
  showApp(m[1],!routed);routed=true;
 }else showPublicView();
}
window.addEventListener("hashchange",route);

/* ===================== Arranque ===================== */
(function boot(){
 const posOpts=POSITIONS.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join("");
 $("#playerPos").innerHTML='<option value="">Todas las posiciones</option>'+posOpts;
 $("#pPos").innerHTML=posOpts;$("#pStatus").innerHTML=STATUSES.map(s=>`<option value="${s}">${s}</option>`).join("");
 if(store.get(SESSION_KEY)==="1"&&!location.hash)history.replaceState(null,"","#/app/dashboard");
 route();
 setInterval(()=>{if(!$("#app").hidden)renderHeader()},60000);
})();

/* ===== Multi-pestaña, PWA ===== */
addEventListener("storage",e=>{if(e.key===KEY&&e.newValue){try{state=migrate(JSON.parse(e.newValue));renderCurrent()}catch(_){}}});
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
