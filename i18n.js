/* AK Sports Intelligence — i18n (ES base, EN incluido). Para añadir un idioma: crea un objeto como EN y regístralo en DICTS. */
(function(){
"use strict";
const EN={
"Funciones":"Features","Cómo funciona":"How it works","Planes":"Plans","Entrar / Probar gratis":"Sign in / Try free","Ir a mi panel":"Go to my dashboard",
"⚡ Plataforma de rendimiento deportivo":"⚡ Sports performance platform","Convierte tus datos en":"Turn your data into","mejores decisiones":"better decisions",
"Gestiona jugadores, evaluaciones, entrenamientos, partidos y táctica desde un solo lugar. Hecha para entrenadores, academias y equipos que quieren profesionalizar su análisis.":"Manage players, evaluations, training, matches and tactics in one place. Built for coaches, academies and teams that want to professionalise their analysis.",
"🚀 Comenzar ahora":"🚀 Start now","Ver funciones":"See features","🔒 Tus datos se quedan en tu dispositivo":"🔒 Your data stays on your device","📴 Funciona sin internet":"📴 Works offline","📤 Exporta cuando quieras":"📤 Export anytime",
"Todo el rendimiento en un solo lugar":"All your performance in one place","Registra una vez y obtén indicadores calculados con tus propios datos: nada de cifras de relleno.":"Record once and get indicators calculated from your own data: no filler figures.",
"Dashboard real":"Real dashboard","Rendimiento medio, perfil técnico-táctico-físico-psicológico, tendencia y alertas calculadas con tus evaluaciones.":"Average performance, technical-tactical-physical-psychological profile, trends and alerts calculated from your evaluations.",
"Perfil de jugador":"Player profile","Radar de capacidades, evolución en el tiempo, historial de evaluaciones e informe imprimible.":"Skills radar, evolution over time, evaluation history and a printable report.",
"Pizarra táctica":"Tactics board","Formaciones, flechas, material, jugadas guardadas y animación de inicio a final.":"Formations, arrows, equipment, saved plays and start-to-end animation.",
"Planificador con carga":"Load-aware planner","Sesiones con bloques, duración y RPE; calcula la carga semanal (minutos × RPE).":"Sessions with blocks, duration and RPE; calculates weekly load (minutes × RPE).",
"Resultados, local/visitante, balance G-E-P, goles y racha reciente.":"Results, home/away, W-D-L record, goals and recent form.",
"Asistente de sesiones":"Session assistant","Propone sesiones y lee tus datos. Modo reglas incluido; listo para conectar una IA real desde tu backend.":"Suggests sessions and reads your data. Rules mode included; ready to connect a real AI from your backend.",
"De la cancha al dato":"From the pitch to the data","Un flujo simple: registra, evalúa, analiza y decide.":"A simple flow: record, evaluate, analyse and decide.",
"Registra":"Record","Evalúa":"Evaluate","Decide":"Decide","Crea tu club, importa tu plantilla desde CSV o agrégala a mano.":"Create your club, import your roster from CSV or add it by hand.",
"Captura técnica, táctica, físico y psicológico con historial por fecha.":"Capture technical, tactical, physical and psychological scores with dated history.","Consulta tendencias, alertas y planifica la siguiente sesión.":"Review trends and alerts and plan the next session.",
"Planes para crecer contigo":"Plans that grow with you","Precios de referencia del prototipo. En esta versión todas las funciones están abiertas para que puedas probarlas.":"Prototype reference prices. In this version all features are open so you can try them.",
"7 días de prueba":"7-day trial","Todas las funciones demo":"All demo features","Datos locales":"Local data","Plantilla y evaluaciones":"Roster and evaluations","Entrenamientos y carga":"Training and load","Partidos y estadísticas":"Matches and stats",
"Todo Premium":"Everything in Premium","Informes imprimibles":"Printable reports","Todo Pro":"Everything in Pro","Multi-club (próximamente)":"Multi-club (coming soon)","Sincronización en la nube (próximamente)":"Cloud sync (coming soon)",
"Probar":"Try","Elegir Premium":"Choose Premium","Elegir Pro":"Choose Pro","Elegir Ultra":"Choose Ultra","Los pagos y la sincronización en la nube requieren un servidor y no están activos en esta versión.":"Payments and cloud sync require a server and are not active in this version.",
"Tu equipo ya genera datos.":"Your team already generates data.","Ahora conviértelos en decisiones deportivas.":"Now turn it into sporting decisions.","🚀 Entrar a AK Sports Intelligence":"🚀 Enter AK Sports Intelligence",
"AK Sports Intelligence · V4 · Prototipo funcional. Tus datos se guardan solo en este navegador; si registras menores de edad, protégelos y exporta respaldos con regularidad.":"AK Sports Intelligence · V4 · Working prototype. Your data is saved only in this browser; if you record minors, protect their data and export backups regularly.",
"Comenzar con AK Sports Intelligence":"Get started with AK Sports Intelligence","Prototipo local: no hay cuentas ni contraseñas; tus datos se guardan solo en este navegador.":"Local prototype: no accounts or passwords; your data is saved only in this browser.",
"🚀 Entrar a la plataforma":"🚀 Enter the platform","Nombre del entrenador":"Coach name","Nombre del club":"Club name",
"Principal":"Main","Club":"Club","Sitio público":"Public site","▦ Dashboard":"▦ Dashboard","👥 Jugadores":"👥 Players","📊 Evaluaciones":"📊 Evaluations","🏋️ Entrenamientos":"🏋️ Training","🏆 Partidos":"🏆 Matches","⚽ Pizarra táctica":"⚽ Tactics board","🧠 Asistente":"🧠 Assistant","🎨 Personalizar":"🎨 Customize","💾 Datos y respaldo":"💾 Data & backup",
"Jugadores":"Players","Evaluaciones":"Evaluations","Entrenamientos":"Training","Partidos":"Matches","Asistente":"Assistant","Personalizar":"Customize","Datos y respaldo":"Data & backup",
"Dashboard de rendimiento":"Performance dashboard","Indicadores calculados con las evaluaciones, entrenamientos y partidos que registraste.":"Indicators calculated from the evaluations, training and matches you recorded.",
"Perfil del equipo (última evaluación de cada jugador)":"Team profile (latest evaluation of each player)","Evolución del rendimiento":"Performance trend","Top rendimiento":"Top performers","Plantilla por posición":"Roster by position","Alertas y sugerencias":"Alerts and suggestions","automático":"automatic","Forma reciente":"Recent form",
"Plantilla y jugadores":"Roster and players","Perfiles individuales, estado y rendimiento.":"Individual profiles, status and performance.","Evaluaciones deportivas":"Sports evaluations","Planificador de entrenamientos":"Training planner","Historial competitivo y balance.":"Match history and record.",
"Perfil promedio del equipo":"Average team profile","Evolución del equipo":"Team trend","Historial":"History","Asistente de sesiones ":"Session assistant","Personalizar club":"Customize club","Identidad que verás en tu panel.":"Identity shown in your panel.",
"Guardado local":"Local storage","💾 Guardado local":"💾 Local storage","🧹 Reiniciar":"🧹 Reset","Guardar ahora":"Save now","Exportar JSON":"Export JSON","Importar JSON":"Import JSON","Empezar vacío":"Start empty","Restablecer demo":"Reset demo",
"🖨️ Imprimir":"🖨️ Print","+ Jugador":"+ Player","+ Agregar jugador":"+ Add player","+ Nueva evaluación":"+ New evaluation","+ Crear sesión":"+ Create session","+ Registrar partido":"+ Add match","📥 Importar CSV":"📥 Import CSV","📤 Exportar CSV":"📤 Export CSV",
"Todas las posiciones":"All positions","Orden: dorsal":"Sort: number","Orden: nombre":"Sort: name","Orden: rendimiento":"Sort: performance","Orden: edad":"Sort: age",
"Dorsal":"Number","Jugador":"Player","Posición":"Position","Edad":"Age","Rendimiento":"Performance","Estado":"Status","Fecha":"Date","Técnica":"Technical","Táctica":"Tactical","Físico":"Physical","Psicológico":"Psychological","Psicol.":"Psych.","General":"Overall",
"Rival":"Opponent","Sede":"Venue","Resultado":"Result","Competición":"Competition","Notas":"Notes","Nombre":"Name","Entrenador":"Coach","Color principal":"Main colour","Categoría":"Category","Objetivo":"Objective","Duración (min)":"Duration (min)","Goles a favor":"Goals for","Goles en contra":"Goals against",
"Portero":"Goalkeeper","Defensa":"Defender","Mediocampista":"Midfielder","Extremo":"Winger","Delantero":"Forward","Activo":"Active","Lesionado":"Injured","Suspendido":"Suspended","Baja":"Out","Local":"Home","Visitante":"Away","Neutral":"Neutral","Sin evaluar":"Not evaluated",
"Nuevo jugador":"New player","Editar jugador":"Edit player","Nueva evaluación":"New evaluation","Nueva sesión":"New session","Registrar partido":"Add match","Guardar jugador":"Save player","Guardar evaluación":"Save evaluation","Guardar sesión":"Save session","Guardar partido":"Save match","Guardar":"Save","Guardar identidad":"Save identity",
"Cancelar":"Cancel","Continuar":"Continue","Confirmar":"Confirm","Enviar":"Send","Deshacer":"Undo","Cerrar":"Close","Saltar al contenido":"Skip to content","Buscar por nombre o dorsal…":"Search by name or number…","Buscar jugador":"Search player",
"Modo":"Mode","✋ Mover fichas":"✋ Move tokens","✏️ Dibujar libre":"✏️ Free draw","➡️ Flecha":"➡️ Arrow","↩️ Deshacer trazo":"↩️ Undo stroke","🧽 Borrar dibujo":"🧽 Clear drawing","Formaciones":"Formations","Mi equipo":"My team",
"👥 Mostrar/ocultar rival":"👥 Show/hide opponent","⚽ Agregar balón":"⚽ Add ball","🔶 Agregar cono":"🔶 Add cone","🔄 Posiciones iniciales":"🔄 Initial positions","Animación":"Animation","📍 Fijar inicio":"📍 Set start","🏁 Fijar final":"🏁 Set end","▶️ Reproducir":"▶️ Play","⏮️ Ir al inicio":"⏮️ Go to start","💾 Guardar jugada":"💾 Save play","Jugadas guardadas":"Saved plays",
"Jugadores activos":"Active players","Rendimiento medio":"Average performance","Carga últimos 7 días":"Load, last 7 days","Balance G-E-P":"W-D-L record","Sesiones (7 días)":"Sessions (7 days)","Minutos (7 días)":"Minutes (7 days)","Carga semanal":"Weekly load","Total sesiones":"Total sessions","Goles a favor ":"Goals for",
"Sin datos":"No data","Sin jugadores evaluados.":"No evaluated players.","Aún no has guardado jugadas.":"You haven't saved any plays yet.","Todavía no hay evaluaciones.":"There are no evaluations yet.","Sin objetivo definido":"No objective set",
"Jugador guardado":"Player saved","Evaluación guardada":"Evaluation saved","Sesión guardada":"Session saved","Partido guardado":"Match saved","Jugada guardada":"Play saved","Identidad actualizada":"Identity updated","Datos guardados":"Data saved","Respaldo descargado":"Backup downloaded","CSV descargado":"CSV downloaded",
"Evaluación eliminada":"Evaluation deleted","Sesión eliminada":"Session deleted","Partido eliminado":"Match deleted","Jugada eliminada":"Play deleted","Primero agrega un jugador":"Add a player first","Material quitado":"Equipment removed","Posiciones iniciales":"Initial positions",
"Plan seleccionado: ":"Plan selected: ","/mes":"/mo","dorsal":"number","nombre":"name","posicion":"position","edad":"age","rendimiento":"performance",
"AK Sports Intelligence V4 — Plataforma de Rendimiento Deportivo":"AK Sports Intelligence V4 — Sports Performance Platform"
};
const RX=[[/^Bienvenido a (.*)$/,"Welcome to $1"],[/^Jugador «(.*)» eliminado$/,"Player «$1» deleted"],[/^Jugada «(.*)» cargada$/,"Play «$1» loaded"],[/^de (\d+) en plantilla$/,"of $1 on roster"],[/^(\d+) días de prueba$/,"$1 trial days"],[/^CSV importado: (\d+) jugador\(es\)(.*)$/,"CSV imported: $1 player(s)$2"],[/^(\d+) sesión\(es\) · min × RPE$/,"$1 session(s) · min × RPE"],[/^(\d+) por partido$/,"$1 per match"],[/^(\d+)% victorias$/,"$1% wins"]];
const DICTS={en:EN};
const supported=["es","en"];
let LANG=localStorage.getItem("ak_lang")||((navigator.language||"es").slice(0,2));if(!supported.includes(LANG))LANG="en";
const REG={MX:"MXN",ES:"EUR",FR:"EUR",DE:"EUR",IT:"EUR",PT:"EUR",GB:"GBP"};
let CUR=localStorage.getItem("ak_cur")||REG[((navigator.language||"").split("-")[1]||"").toUpperCase()]||"USD";
const PR={MXN:[399,799,1399],USD:[22,44,78],EUR:[20,40,72],GBP:[17,35,62]};
function trText(s){
 if(LANG==="es")return s;const d=DICTS[LANG];const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);const k=m[2];if(!k)return s;
 if(d[k]!==undefined)return m[1]+d[k]+m[3];
 for(const [re,to] of RX){if(re.test(k))return m[1]+k.replace(re,to)+m[3]}return s;
}
window.tr=trText;
function setLocale(){window.AK_LOCALE=(navigator.language||"").slice(0,2)===LANG?navigator.language:(LANG==="es"?"es-ES":"en-US");document.documentElement.lang=LANG}
const nodes=new WeakMap();
function tNode(n){
 let r=nodes.get(n);if(!r&&LANG==="es")return;
 if(!r||n.nodeValue!==r.out){r={src:n.nodeValue,out:n.nodeValue};nodes.set(n,r)}
 const o=LANG==="es"?r.src:trText(r.src);if(o!==n.nodeValue)n.nodeValue=o;r.out=n.nodeValue;
}
const ATTRS=["placeholder","aria-label","title","alt"];
function tEl(el){
 el.__ak=el.__ak||{};
 for(const a of ATTRS){const v=el.getAttribute(a);if(v==null)continue;let r=el.__ak[a];
  if(!r&&LANG==="es")continue;if(!r||v!==r.out){r={src:v,out:v};el.__ak[a]=r}
  const o=LANG==="es"?r.src:trText(r.src);if(o!==v)el.setAttribute(a,o);r.out=o}
}
function walk(root){
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 let n;while((n=w.nextNode()))tNode(n);
 if(root.nodeType===1){tEl(root);root.querySelectorAll("[placeholder],[aria-label],[title],[alt]").forEach(tEl)}
}
const obs=new MutationObserver(recs=>{
 obs.disconnect();
 for(const r of recs){
  if(r.type==="characterData")tNode(r.target);
  else if(r.type==="attributes")tEl(r.target);
  else r.addedNodes.forEach(n=>{if(n.nodeType===3)tNode(n);else if(n.nodeType===1)walk(n)});
 }
 observe();
});
function observe(){obs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS})}
function renderPrices(){
 const fmt=new Intl.NumberFormat(window.AK_LOCALE,{style:"currency",currency:CUR,maximumFractionDigits:0});
 document.querySelectorAll("#planes .price .amount").forEach((el,k)=>{el.innerHTML=fmt.format(k?PR[CUR][k-1]:0)+(k?` <small>${trText("/mes")}</small>`:"")});
}
function setLang(l){
 LANG=l;localStorage.setItem("ak_lang",l);setLocale();obs.disconnect();walk(document.body);renderPrices();
 document.querySelectorAll(".langsel").forEach(s=>s.value=l);observe();
 if(typeof renderCurrent==="function"&&!document.getElementById("app").hidden)renderCurrent();
}
function build(){
 const mk=()=>{const s=document.createElement("select");s.className="input langsel";s.setAttribute("aria-label","Idioma / Language");s.innerHTML='<option value="es">Español</option><option value="en">English</option>';s.value=LANG;s.onchange=()=>setLang(s.value);return s};
 const nav=document.querySelector(".navin"),cta=document.getElementById("publicCta");if(nav&&cta)nav.insertBefore(mk(),cta);
 const act=document.querySelector(".app-actions");if(act)act.insertBefore(mk(),act.firstChild);
 const lead=document.querySelector("#planes .lead");
 if(lead){const b=document.createElement("div");b.className="curbar";b.innerHTML='<label for="curSel">Moneda / Currency</label><select id="curSel" class="input langsel">'+Object.keys(PR).map(c=>`<option>${c}</option>`).join("")+"</select>";
  lead.after(b);const s=b.querySelector("select");s.value=CUR;s.onchange=()=>{CUR=s.value;localStorage.setItem("ak_cur",CUR);renderPrices()}}
}
setLocale();build();renderPrices();
if(LANG!=="es")walk(document.body);
observe();
})();
