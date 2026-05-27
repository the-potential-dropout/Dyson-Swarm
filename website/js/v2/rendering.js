import { perspective, lookView } from './math.js';

function compile(gl,type,src){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
function program(gl,vs,fs){ const p=gl.createProgram(); gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs)); gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p); if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; }
const VS=`#version 300 es
precision highp float; in vec3 aPos; in float aSize; in vec3 aColor; uniform mat4 uProj,uView; uniform float uScale; out vec3 vColor; out float vKind; void main(){ vec4 mv=uView*vec4(aPos,1.0); gl_Position=uProj*mv; gl_PointSize=clamp(aSize*uScale/max(1.0,-mv.z),1.0,900.0); vColor=aColor; vKind=aSize; }`;
const FS=`#version 300 es
precision highp float; in vec3 vColor; in float vKind; out vec4 outColor; void main(){ vec2 p=gl_PointCoord*2.0-1.0; float d=length(p); float a=smoothstep(1.0,0.0,d); float core=smoothstep(0.18,0.0,d); outColor=vec4(vColor*(0.45+core*1.9),a); }`;
const LVS=`#version 300 es
precision highp float; in vec3 aPos; in vec3 aColor; uniform mat4 uProj,uView; out vec3 vColor; void main(){ gl_Position=uProj*uView*vec4(aPos,1.0); vColor=aColor; }`;
const LFS=`#version 300 es
precision highp float; in vec3 vColor; out vec4 outColor; void main(){ outColor=vec4(vColor,0.62); }`;
export class Renderer{
  constructor(canvas){
    this.canvas=canvas; this.gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'}); if(!this.gl) throw new Error('WebGL2 unavailable');
    const gl=this.gl; this.pointProgram=program(gl,VS,FS); this.lineProgram=program(gl,LVS,LFS);
    this.pointVAO=gl.createVertexArray(); this.pointBuffer=gl.createBuffer(); this.lineVAO=gl.createVertexArray(); this.lineBuffer=gl.createBuffer(); this.count=0; this.lineCount=0;
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE); gl.enable(gl.DEPTH_TEST); gl.clearColor(0.004,0.008,0.018,1);
  }
  resize(){ const d=Math.min(devicePixelRatio||1,2), w=innerWidth*d, h=innerHeight*d; if(this.canvas.width!==w||this.canvas.height!==h){ this.canvas.width=w; this.canvas.height=h; this.canvas.style.width='100vw'; this.canvas.style.height='100vh'; } this.gl.viewport(0,0,this.canvas.width,this.canvas.height); }
  update(points, lines){
    const gl=this.gl; this.count=points.length/7; gl.bindVertexArray(this.pointVAO); gl.bindBuffer(gl.ARRAY_BUFFER,this.pointBuffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.DYNAMIC_DRAW); const s=28; gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,3,gl.FLOAT,false,s,0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1,1,gl.FLOAT,false,s,12); gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2,3,gl.FLOAT,false,s,16);
    this.lineCount=lines.length/6; gl.bindVertexArray(this.lineVAO); gl.bindBuffer(gl.ARRAY_BUFFER,this.lineBuffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lines),gl.DYNAMIC_DRAW); const ls=24; gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,3,gl.FLOAT,false,ls,0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1,3,gl.FLOAT,false,ls,12);
  }
  draw(camera){
    const gl=this.gl; this.resize(); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); const proj=perspective(Math.PI/3,this.canvas.width/this.canvas.height,0.1,5000); const view=lookView(camera.pos,camera.yaw,camera.pitch,camera.roll);
    gl.useProgram(this.lineProgram); gl.uniformMatrix4fv(gl.getUniformLocation(this.lineProgram,'uProj'),false,proj); gl.uniformMatrix4fv(gl.getUniformLocation(this.lineProgram,'uView'),false,view); gl.bindVertexArray(this.lineVAO); gl.drawArrays(gl.LINES,0,this.lineCount);
    gl.useProgram(this.pointProgram); gl.uniformMatrix4fv(gl.getUniformLocation(this.pointProgram,'uProj'),false,proj); gl.uniformMatrix4fv(gl.getUniformLocation(this.pointProgram,'uView'),false,view); gl.uniform1f(gl.getUniformLocation(this.pointProgram,'uScale'),this.canvas.height*0.55); gl.bindVertexArray(this.pointVAO); gl.drawArrays(gl.POINTS,0,this.count);
  }
}
