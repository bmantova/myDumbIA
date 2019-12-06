precision highp float;

uniform float uDay;
uniform float uColor;

varying vec3 pos;
varying float time;
varying vec3 vNormal;

void main() {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  if(uColor < 0.33) {
  	r = 1.0 - (uColor * 3.0);
  	g = uColor * 3.0;
  }
  else if(uColor < 0.66) {
  	g = 1.0 - (uColor - 0.33) * 3.0;
  	b = (uColor - 0.33) * 3.0;
  }
  else {
  	r = (uColor - 0.66) * 3.0;
  	b = 1.0 - (uColor - 0.66) * 3.0;
  }

  r = (r) * (uDay * 0.2 + 0.8) + vNormal.y * 0.3 * (uDay + 1.0) * 0.5;
  g = (g) * (uDay * 0.2 + 0.8) + vNormal.y * 0.3 * (uDay + 1.0) * 0.5;
  b = (b) * (uDay * 0.2 + 0.8) + vNormal.y * 0.3 * (uDay + 1.0) * 0.5;

  gl_FragColor = vec4(r, g, b, 1.0);
}
