precision highp float;

uniform float uDay;
varying vec3 pos;
varying float time;
varying vec3 vNormal;
varying float seaZ;

uniform float uSunX;
uniform float uSunY;
uniform float uSunZ;

/* float clamp(floatv, a, b) {
	if(v > b) return b
	if(v < a) return a
	return v
} */

void main() {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  float z = pos.z;// + sin(time * 0.1) * 2.0;
  if(z + uDay * 0.8 < -7.0) { // Deep Sea
  	r = 0.0;
  	g = 0.1;
  	b = 0.3;
  }
  else if(z + uDay * 0.4 < -3.0) { // Middle Sea
  	r = 0.05;
  	g = 0.1;
  	b = 0.5;
  }
  else if(z + uDay * 0.2 < 0.0) { // Sea near of the cost
  	r = 0.2;
  	g = 0.3;
  	b = 0.9;
  }
  else if(z < 1.0) { // Sand
  	r = 0.6;
  	g = 0.6;
  	b = 0.0;
  }
  else if(z < 5.0) { // Light Grass
  	r = 0.1;
  	g = 0.6;
  	b = 0.1;
  }
  else if(z < 9.0) { // Dark Grass
  	r = 0.1;
  	g = 0.5;
  	b = 0.0;
  }
  else if(z < 11.0) { // Light Stone
  	r = 0.3;
  	g = 0.3;
  	b = 0.3;
  }
  else if(z < 17.0) { // Dark Stone
  	r = 0.1;
  	g = 0.1;
  	b = 0.1;
  }
  else {            // Snow
  	r = 0.9;
  	g = 0.9;
  	b = 0.9;
  }

  float sunLight = floor(dot(normalize(vec3(-uSunX,uSunY,uSunZ)), vNormal.xzy) * 2.0) * 0.03;

  float waveSeaColor = 0.0;
  if(seaZ < -0.15) waveSeaColor = -0.1;
  else if(seaZ > 0.15) waveSeaColor = 0.1;

  r = (r + waveSeaColor) * (uDay * 0.2 + 0.4) + (sunLight);
  g = (g + waveSeaColor) * (uDay * 0.2 + 0.4) + (sunLight);
  b = (b + waveSeaColor) * (uDay * 0.2 + 0.4) + (sunLight);

  gl_FragColor = vec4(r, g, b, 1.0);
}
