export const TAU = Math.PI * 2;
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function v3(x=0,y=0,z=0){ return [x,y,z]; }
export function add(a,b){ return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
export function sub(a,b){ return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
export function scale(a,s){ return [a[0]*s,a[1]*s,a[2]*s]; }
export function len(a){ return Math.hypot(a[0],a[1],a[2]); }
export function norm(a){ const l=len(a)||1; return [a[0]/l,a[1]/l,a[2]/l]; }
export function cross(a,b){ return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
export function dot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
export function perspective(fov, aspect, near, far){
  const f=1/Math.tan(fov/2), nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]);
}
export function lookView(pos, yaw, pitch, roll=0){
  const cy=Math.cos(yaw), sy=Math.sin(yaw), cp=Math.cos(pitch), sp=Math.sin(pitch);
  const forward=[sy*cp, sp, -cy*cp];
  let right=[cy,0,sy];
  let up=cross(right, forward);
  if(roll){ const cr=Math.cos(roll), sr=Math.sin(roll); const r2=add(scale(right,cr),scale(up,sr)); up=add(scale(up,cr),scale(right,-sr)); right=r2; }
  return new Float32Array([
    right[0], up[0], -forward[0], 0,
    right[1], up[1], -forward[1], 0,
    right[2], up[2], -forward[2], 0,
    -dot(right,pos), -dot(up,pos), dot(forward,pos), 1
  ]);
}
