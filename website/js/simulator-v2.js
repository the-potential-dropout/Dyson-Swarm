import { TAU, clamp, add, scale, len } from './v2/math.js';
import { Renderer } from './v2/rendering.js';
import { WORLD_AU, orbitPosition, calculate, fmt, fmtPower } from './v2/orbital-mechanics.js';

const $ = id => document.getElementById(id);
const canvas = $('gl');
canvas.tabIndex = 0;
const renderer = new Renderer(canvas);
const radar = $('radar');
const rctx = radar.getContext('2d');
const menu = $('menu');
const controls = {
  lum: $('lum'), mass: $('mass'), radius: $('radius'), count: $('count'), area: $('area'),
  eff: $('eff'), density: $('density'), warp: $('warp')
};
const out = {
  power: $('outPower'), area: $('outArea'), coverage: $('outCoverage'), energy: $('outEnergy'),
  temp: $('outTemp'), period: $('outPeriod'), speed: $('outSpeed'), mass: $('outMass'),
  vel: $('hudVel'), dist: $('hudDist'), proxies: $('hudProxies'), hudPower: $('hudPower'), hudCoverage: $('hudCoverage')
};
const state = {
  active: false, last: performance.now(), sim: 0, keys: Object.create(null), collectors: [], stars: [],
  p: null, m: null, cam: { pos: [0,-155,52], vel: [0,0,0], yaw: 0, pitch: -0.25, roll: 0 }
};
function readParams(){ return { luminosity:+controls.lum.value, starMass:+controls.mass.value, radiusAU:+controls.radius.value, collectors:10**(+controls.count.value), areaEach:10**(+controls.area.value), efficiency:+controls.eff.value/100, arealDensity:+controls.density.value, timeWarp:10**(+controls.warp.value) }; }
function buildCollectors(){ const n=Math.round(clamp(900+Math.log10(state.p.collectors)*430+state.m.coverage*4200,900,7200)); state.collectors.length=0; for(let i=0;i<n;i++){ state.collectors.push({aScale:.76+Math.random()*.52,e:Math.random()<.2?Math.random()*.13:Math.random()*.035,inc:(Math.random()-.5)*1.25,node:Math.random()*TAU,arg:Math.random()*TAU,phase:Math.random()*TAU,speedSign:Math.random()<.025?-1:1,size:2+Math.random()*7,kind:Math.random()}); } }
function buildStars(){ for(let i=0;i<1700;i++){ const r=700+Math.random()*1600,a=Math.random()*TAU,z=(Math.random()*2-1)*r,q=Math.sqrt(Math.max(0,r*r-z*z)); state.stars.push([Math.cos(a)*q,z,Math.sin(a)*q,1+Math.random()*2,.35+Math.random()*.55,.55+Math.random()*.35,1]); } }
function refresh(){ state.p=readParams(); state.m=calculate(state.p); buildCollectors(); updateReadouts(); }
function updateReadouts(){ const p=state.p,m=state.m; $('lumVal').textContent=p.luminosity.toFixed(1)+' L☉'; $('massVal').textContent=p.starMass.toFixed(2)+' M☉'; $('radiusVal').textContent=p.radiusAU.toFixed(2)+' AU'; $('countVal').textContent=fmt(p.collectors,' units'); $('areaVal').textContent=fmt(p.areaEach,'m²'); $('effVal').textContent=Math.round(p.efficiency*100)+'%'; $('densityVal').textContent=p.arealDensity.toFixed(p.arealDensity<1?2:1)+' kg/m²'; $('warpVal').textContent=fmt(p.timeWarp,'×'); out.power.textContent=fmtPower(m.usefulPower); out.area.textContent=fmt(m.area,'m²'); out.coverage.textContent=(m.coverageRaw*100).toPrecision(3)+'%'; out.energy.textContent=fmt(m.annualEnergy,'J/yr'); out.temp.textContent=m.temp.toFixed(0)+' K'; out.period.textContent=m.period<.02?(m.period*365.25).toFixed(2)+' d':m.period.toFixed(3)+' yr'; out.speed.textContent=m.speed.toFixed(2)+' km/s'; out.mass.textContent=fmt(m.mass,'kg'); out.hudPower.textContent=fmtPower(m.usefulPower); out.hudCoverage.textContent=(m.coverageRaw*100).toFixed(2)+'%'; out.proxies.textContent=state.collectors.length.toLocaleString(); $('warning').textContent=m.coverageRaw>1?'Coverage exceeds full shell; intercepted power is capped at 100%.':''; }
function ring(radius,inc=0,node=0,color=[.14,.62,.9]){ const lines=[]; for(let i=0;i<192;i++){ for(const t of [i/192*TAU,(i+1)/192*TAU]){ const x=Math.cos(t)*radius,z=Math.sin(t)*radius,ci=Math.cos(inc),si=Math.sin(inc),cn=Math.cos(node),sn=Math.sin(node); const yy=-z*si,zz=z*ci; lines.push(x*cn+zz*sn,yy,-x*sn+zz*cn,...color); } } return lines; }
function scene(){ const pts=[0,0,0,120,1,.62,.18], lines=[], R=state.p.radiusAU*WORLD_AU; for(const s of state.stars) pts.push(...s); lines.push(...ring(R),...ring(R,.8,1.1,[.05,.35,.9]),...ring(R,-.65,2.1,[.05,.32,.72])); for(let i=0;i<state.collectors.length;i++){ const e=state.collectors[i], p=orbitPosition(e,state.sim,state.p.radiusAU,state.p.starMass); pts.push(p[0],p[1],p[2],e.size,.25+e.kind*.35,.82,1); if(i<80) lines.push(p[0],p[1],p[2],1,.72,.18,0,0,0,.5,.18,.03); } return {pts,lines}; }
function fly(dt){ const c=state.cam, fast=state.keys.ShiftLeft||state.keys.ShiftRight?3.3:1, thrust=60*fast; const f=[Math.sin(c.yaw)*Math.cos(c.pitch),Math.sin(c.pitch),-Math.cos(c.yaw)*Math.cos(c.pitch)], r=[Math.cos(c.yaw),0,Math.sin(c.yaw)], u=[0,1,0]; let a=[0,0,0]; if(state.keys.KeyW)a=add(a,f); if(state.keys.KeyS)a=add(a,scale(f,-1)); if(state.keys.KeyA)a=add(a,scale(r,-1)); if(state.keys.KeyD)a=add(a,r); if(state.keys.Space)a=add(a,u); if(state.keys.KeyC)a=add(a,scale(u,-1)); c.vel=add(scale(c.vel,.985),scale(a,thrust*dt)); c.pos=add(c.pos,scale(c.vel,dt)); if(state.keys.KeyQ)c.roll-=dt*1.4; if(state.keys.KeyE)c.roll+=dt*1.4; c.roll*=.95; out.vel.textContent=fmt(len(c.vel)*100,'m/s'); out.dist.textContent=(len(c.pos)/WORLD_AU).toFixed(2)+' AU'; }
function drawRadar(){ const w=radar.width,h=radar.height,R=state.p.radiusAU*WORLD_AU; rctx.clearRect(0,0,w,h); rctx.strokeStyle='rgba(143,247,255,.35)'; rctx.beginPath(); rctx.arc(w/2,h/2,w*.38,0,TAU); rctx.stroke(); rctx.fillStyle='rgba(255,190,70,.95)'; rctx.beginPath(); rctx.arc(w/2,h/2,5,0,TAU); rctx.fill(); rctx.fillStyle='rgba(120,245,255,.8)'; for(let i=0;i<90;i+=2){ const p=orbitPosition(state.collectors[i],state.sim,state.p.radiusAU,state.p.starMass); rctx.fillRect(w/2+p[0]/R*w*.28,h/2+p[2]/R*h*.28,2,2); } rctx.fillStyle='rgba(140,255,180,.95)'; rctx.beginPath(); rctx.arc(w/2+state.cam.pos[0]/R*w*.18,h/2+state.cam.pos[2]/R*h*.18,4,0,TAU); rctx.fill(); }
function loop(now){ const dt=Math.min(.05,(now-state.last)/1000); state.last=now; if(state.active) state.sim+=dt*state.p.timeWarp; fly(dt); const s=scene(); renderer.update(s.pts,s.lines); renderer.draw(state.cam); drawRadar(); requestAnimationFrame(loop); }
function enableAudio(){ const A=window.AudioContext||window.webkitAudioContext; if(!A||state.audio)return; const ctx=new A(),o=ctx.createOscillator(),g=ctx.createGain(); o.type='sawtooth'; o.frequency.value=42; g.gain.value=.025; o.connect(g); g.connect(ctx.destination); o.start(); state.audio=true; }
for(const x of Object.values(controls)) x.addEventListener('input',refresh);
$('launchBtn').onclick=()=>{state.active=true;menu.classList.add('hidden');canvas.focus();canvas.requestPointerLock?.();enableAudio();};
$('returnMenuBtn').onclick=()=>{state.active=false;menu.classList.remove('hidden');document.exitPointerLock?.();};
$('lockBtn').onclick=()=>{state.active=true;canvas.focus();canvas.requestPointerLock?.();};
$('standaloneBtn').onclick=()=>location.href='dyson-swarm-simulator-v2-standalone.html';
addEventListener('mousemove',e=>{ if(document.pointerLockElement!==canvas)return; state.cam.yaw-=e.movementX*.002; state.cam.pitch=clamp(state.cam.pitch-e.movementY*.002,-1.45,1.45); });
addEventListener('keydown',e=>{ if(['KeyW','KeyA','KeyS','KeyD','KeyC','KeyQ','KeyE','Space','ShiftLeft','ShiftRight'].includes(e.code)){state.keys[e.code]=true;e.preventDefault();} if(e.code==='KeyR'){state.cam.pos=[0,-155,52];state.cam.vel=[0,0,0];} if(e.code==='KeyM') $('returnMenuBtn').click(); },{passive:false});
addEventListener('keyup',e=>{ state.keys[e.code]=false; });
canvas.onclick=()=>{canvas.focus();canvas.requestPointerLock?.();};
buildStars(); refresh(); requestAnimationFrame(loop);
