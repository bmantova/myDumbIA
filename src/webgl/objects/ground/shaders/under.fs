precision highp float;

uniform float uDay;
varying vec3 pos;
varying float time;

/* float clamp(floatv, a, b) {
	if(v > b) return b
	if(v < a) return a
	return v
} */

void main() {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  float z = pos.z;
  
  if(z < -90.0) {
    r = 0.2 - (z + 90.0) * 0.02;
    g = 0.0 - (z + 90.0) * 0.01;
    b = 0.0;
  }
  else if(z < -70.0) {
    r = 0.1;
    g = 0.1;
    b = 0.1;
  }
  else if(z < -50.0) {
    r = 0.15;
    g = 0.05;
    b = 0.0;
  }
  else if(z < -30.0) {
    r = 0.15;
    g = 0.1;
    b = 0.0;
  }
  else {
    r = 0.1;
    g = 0.05;
    b = 0.0;
  }


  r = r * (uDay * 0.4 + 0.6);
  g = g * (uDay * 0.4 + 0.6);
  b = b * (uDay * 0.4 + 0.6);

  gl_FragColor = vec4(r, g, b, 1.0);
  // gl_FragColor = vec4((1.0 - pos.z) *.05, .1 - abs(pos.z*.001), pos.z*.05, 1.0);
}
