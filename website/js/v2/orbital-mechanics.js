export const AU_M = 1.495978707e11;
export const YEAR_S = 31557600;
export const L_SUN = 3.828e26;
export const MU_SUN = 1.32712440018e20;
export const WORLD_AU = 58;
export function meanMotion(radiusAU, starMassSolar){ return Math.sqrt((MU_SUN*starMassSolar)/Math.pow(radiusAU*AU_M,3)); }
export function periodYears(radiusAU, starMassSolar){ return (2*Math.PI/meanMotion(radiusAU,starMassSolar))/YEAR_S; }
export function speedKms(radiusAU, starMassSolar){ return Math.sqrt(MU_SUN*starMassSolar/(radiusAU*AU_M))/1000; }
export function fluxWm2(luminositySolar, radiusAU){ return 1361*luminositySolar/(radiusAU*radiusAU); }
export function equilibriumK(luminositySolar, radiusAU){ return 278.5*Math.pow(luminositySolar,0.25)/Math.sqrt(radiusAU); }
export function solveKepler(M,e){ let E=M; for(let i=0;i<6;i++) E -= (E-e*Math.sin(E)-M)/(1-e*Math.cos(E)); return E; }
export function orbitPosition(el, simSeconds, baseRadiusAU, starMassSolar){
  const aAU = baseRadiusAU * el.aScale;
  const n = meanMotion(aAU, starMassSolar) * el.speedSign;
  const M = el.phase + n * simSeconds;
  const E = solveKepler(M, el.e);
  const x = aAU * WORLD_AU * (Math.cos(E)-el.e);
  const z = aAU * WORLD_AU * Math.sqrt(1-el.e*el.e)*Math.sin(E);
  const ca=Math.cos(el.arg), sa=Math.sin(el.arg), ci=Math.cos(el.inc), si=Math.sin(el.inc), cn=Math.cos(el.node), sn=Math.sin(el.node);
  let xp=x*ca-z*sa, zp=x*sa+z*ca, yp=0;
  let yi=yp*ci-zp*si, zi=yp*si+zp*ci;
  return [xp*cn+zi*sn, yi, -xp*sn+zi*cn];
}
export function calculate(p){
  const area = p.collectors * p.areaEach;
  const shell = 4*Math.PI*Math.pow(p.radiusAU*AU_M,2);
  const coverageRaw = area/shell;
  const coverage = Math.min(1, coverageRaw);
  const usefulPower = coverage * p.luminosity * L_SUN * p.efficiency;
  return {area, shell, coverageRaw, coverage, usefulPower, annualEnergy: usefulPower*YEAR_S, flux: fluxWm2(p.luminosity,p.radiusAU), temp: equilibriumK(p.luminosity,p.radiusAU), period: periodYears(p.radiusAU,p.starMass), speed: speedKms(p.radiusAU,p.starMass), mass: area*p.arealDensity};
}
export function fmt(n,u=''){
  if(!Number.isFinite(n)) return '—'; const a=Math.abs(n); const p=[[1e24,'Y'],[1e21,'Z'],[1e18,'E'],[1e15,'P'],[1e12,'T'],[1e9,'G'],[1e6,'M'],[1e3,'k']];
  for(const [v,s] of p) if(a>=v) return (n/v).toFixed(a/v<10?2:a/v<100?1:0)+' '+s+u;
  return (a<10?n.toFixed(2):n.toFixed(0))+u;
}
export function fmtPower(w){ return fmt(w,'W'); }
