precision highp float;

uniform float uTime;
varying vec3 pos;

void main() {
  gl_FragColor = vec4((1.0 - pos.z) *.5, 0.0, pos.z*.5, 1.0);
}
