precision highp float;

uniform float uDay;
uniform float uSeason;
uniform float uR;
uniform float uV;
uniform float uB;

varying vec3 pos;
varying float time;
varying vec3 vNormal;

void main() {
  float r = uR;
  float g = uV;
  float b = uB;

  r = (r) * (uDay * 0.4 + 0.6) + vNormal.y * 0.3;
  g = (g) * (uDay * 0.4 + 0.6) + vNormal.y * 0.3;
  b = (b) * (uDay * 0.4 + 0.6) + vNormal.y * 0.3;

  gl_FragColor = vec4(r, g, b, 1.0);
}
