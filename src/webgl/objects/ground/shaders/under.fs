precision highp float;

uniform float uDay;
varying vec3 pos;
varying float time;
varying float seaZ;

/* float clamp(floatv, a, b) {
	if(v > b) return b
	if(v < a) return a
	return v
} */

void main() {
  float r = 0.15;
  float g = 0.05;
  float b = 0.0;

  float z = pos.z;

  if(z < -100.0) {
    r = 0.0;
    g = 0.0;
    b = 0.0;
  }

  r = r * (uDay * 0.4 + 0.6);
  g = g * (uDay * 0.4 + 0.6);
  b = b * (uDay * 0.4 + 0.6);

  gl_FragColor = vec4(r, g, b, 1.0);
  // gl_FragColor = vec4((1.0 - pos.z) *.05, .1 - abs(pos.z*.001), pos.z*.05, 1.0);
}
