precision mediump float;

uniform float uDay;
uniform float uColor;
uniform float uVirus;

varying vec3 vNormal;
varying float vFur;

void main() {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  float color = uColor;

  if(color < 0.33) {
  	r = 1.0 - (color * 3.0);
  	g = color * 3.0;
  }
  else if(color < 0.66) {
  	g = 1.0 - (color - 0.33) * 3.0;
  	b = (color - 0.33) * 3.0;
  }
  else {
  	r = (color - 0.66) * 3.0;
  	b = 1.0 - (color - 0.66) * 3.0;
  }

  float mult = (uDay * 0.2 + 0.8) * (vFur * 0.5 + 0.5) + vNormal.y * 0.3 * (uDay + 1.0) * 0.5;
  if(uVirus > 0.5) {
    mult -= clamp(sin(vNormal.z * 10.0 + uDay * 100.0) * 0.5, 0.0, 1.0);
  }

  gl_FragColor = vec4(vec3(r, g, b) * mult, 1.0);
}
