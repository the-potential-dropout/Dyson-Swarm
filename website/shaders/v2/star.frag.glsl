#version 300 es
precision highp float;
out vec4 outColor;
void main(){
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = length(p);
  outColor = vec4(1.0, 0.62, 0.18, smoothstep(1.0, 0.0, d));
}
