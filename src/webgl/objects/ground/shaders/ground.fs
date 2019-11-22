precision highp float;

uniform float uTime;
varying vec3 pos;

/* float clamp(floatv, a, b) {
	if(v > b) return b
	if(v < a) return a
	return v
} */

void main() {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  float z = pos.z + sin(uTime * 0.1) * 2.0;
  if(z < -7.0) {
  	r = 0.0;
  	g = 0.0;
  	b = 0.1;
  }
  else if(z < -3.0) {
  	r = 0.0;
  	g = 0.0;
  	b = 0.3;
  }
  else if(z < 0.0) {
  	r = 0.1;
  	g = 0.1;
  	b = 0.9;
  }
  else if(z < 1.0) {
  	r = 0.6;
  	g = 0.6;
  	b = 0.0;
  }
  else if(z < 5.0) {
  	r = 0.1;
  	g = 0.6;
  	b = 0.1;
  }
  else if(z < 9.0) {
  	r = 0.1;
  	g = 0.5;
  	b = 0.0;
  }
  else if(z < 11.0) {
  	r = 0.3;
  	g = 0.3;
  	b = 0.3;
  }
  else if(z < 17.0) {
  	r = 0.1;
  	g = 0.1;
  	b = 0.1;
  }
  else {
  	r = 0.9;
  	g = 0.9;
  	b = 0.9;
  }

  gl_FragColor = vec4(r, g, b, 1.0);
  // gl_FragColor = vec4((1.0 - pos.z) *.05, .1 - abs(pos.z*.001), pos.z*.05, 1.0);
}
