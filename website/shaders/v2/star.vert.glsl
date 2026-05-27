#version 300 es
precision highp float;
in vec3 aPos;
uniform mat4 uProj;
uniform mat4 uView;
void main(){
  gl_Position = uProj * uView * vec4(aPos, 1.0);
}
