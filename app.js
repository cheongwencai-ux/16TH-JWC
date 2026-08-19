const scheduleEl=document.getElementById('schedule');
const countEl=document.getElementById('eventCount');
const nextTitle=document.getElementById('nextTitle');
const nextMeta=document.getElementById('nextMeta');
const countdown=document.getElementById('countdown');
const progressBar=document.getElementById('progressBar');
const todayDate=document.getElementById('todayDate');
const liveClock=document.getElementById('liveClock');

function dt(e){return new Date(`${e.date}T${e.start}:00+08:00`)}
function endDt(e){return new Date(`${e.date}T${e.end}:00+08:00`)}
function fmtDate(s){return new Date(`${s}T12:00:00+08:00`).toLocaleDateString('en-SG',{weekday:'long',day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Singapore'})}
function fmtTime(s){return s.replace(':','')}
function render(filter='all'){
  const list=EVENTS.filter(e=>filter==='all'||e.date===filter).sort((a,b)=>dt(a)-dt(b));
  countEl.textContent=`${list.length} events`;
  if(!list.length){scheduleEl.innerHTML='<div class="event"><div></div><div>No events listed for this day.</div></div>';return}
  const groups={};
  list.forEach(e=>(groups[e.date]??=[]).push(e));
  scheduleEl.innerHTML=Object.entries(groups).map(([date,items])=>`
    <div class="day-group">
      <div class="day-title">${fmtDate(date)}</div>
      ${items.map(e=>`<article class="event" data-id="${e.date}|${e.start}">
        <div class="time">${e.start}<br><span style="font-weight:500">${e.end}</span></div>
        <div><h3>${e.title}</h3>${e.location?`<div class="meta">📍 ${e.location}</div>`:''}</div>
      </article>`).join('')}
    </div>`).join('');
}
function updateClock(){
  const now=new Date();
  todayDate.textContent=now.toLocaleDateString('en-SG',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Singapore'});
  liveClock.textContent=now.toLocaleTimeString('en-SG',{hour12:false,timeZone:'Asia/Singapore'});
  const future=EVENTS.filter(e=>dt(e)>now).sort((a,b)=>dt(a)-dt(b));
  if(!future.length){nextTitle.textContent='Course complete';nextMeta.textContent='No further events in the programme.';countdown.textContent='00:00:00';return}
  const e=future[0], start=dt(e), end=endDt(e);
  const ms=start-now;
  const total=Math.max(0,ms);
  const d=Math.floor(total/86400000), h=Math.floor(total%86400000/3600000), m=Math.floor(total%3600000/60000), s=Math.floor(total%60000/1000);
  countdown.textContent=`${d?String(d).padStart(2,'0')+':':''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  nextTitle.textContent=e.title;
  nextMeta.textContent=`${fmtDate(e.date)} · ${e.start}–${e.end}${e.location?' · '+e.location:''}`;
  const previous=EVENTS.filter(x=>endDt(x)<=start).sort((a,b)=>endDt(b)-endDt(a))[0];
  const denom=previous?start-endDt(previous):start-new Date();
  const elapsed=previous?now-endDt(previous):0;
  progressBar.style.width=`${Math.max(0,Math.min(100,elapsed/denom*100))}%`;
}
document.querySelectorAll('.day-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.day-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');render(btn.dataset.day);
}));
render();updateClock();setInterval(updateClock,1000);
