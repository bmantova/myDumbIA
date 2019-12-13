precision mediump float;

uniform float uDay;
uniform float uR;
uniform float uV;
uniform float uB;

varying vec3 pos;
varying float time;
varying vec3 vNormal;

void main() {
  float mult = (uDay * 0.4 + 0.6) + vNormal.y * 0.3 * (uDay + 1.0) * 0.5;
  gl_FragColor = vec4(vec3(uR, uV, uB) * mult, 1.0);
}
