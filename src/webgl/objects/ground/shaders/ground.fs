precision highp float;

uniform float uTime;
varying vec3 pos;

void main() {
  gl_FragColor = vec4((1.0 - pos.z) *.05, .1 - abs(pos.z*.001), pos.z*.05, 1.0);
}
