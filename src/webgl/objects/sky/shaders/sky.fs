precision highp float;

uniform float uDay;
varying vec3 pos;
varying float time;

uniform float uSunX;
uniform float uSunY;
uniform float uSunZ;

uniform float uMoonX;
uniform float uMoonY;
uniform float uMoonZ;

void main() {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

	r = 0.2 + sin(uDay * 4.0) * 0.2;
	g = 0.3 + sin(pos.y * 0.004) * 0.2;
	b = 0.7 + sin(pos.y * 0.004) * 0.3;

  // float stars = sin((pos.z + 37.2) * sin(pos.x - 59.7)) * sin(pos.y + 26.7);
  float stars = sin(pos.z + 23.1) * 0.4 + sin(pos.y - 10.6) * 0.3 + sin(pos.x + 5.2) * 0.3;
  if(stars > 0.98) stars = clamp((stars - 0.98) * 50.0 - uDay * 2.0, 0.0, 1.0);
  else stars = 0.0;

  float sunGlow = (clamp(500.0 - distance(pos, vec3(uSunX, uSunY, uSunZ)), 0.0, 500.0) / 500.0) * (uDay * 0.5);

  float moonGlow = (clamp(300.0 - distance(pos, vec3(uMoonX, uMoonY, uMoonZ)), 0.0, 300.0) / 300.0) * ((1.0 - uDay) * 0.1);

  
  r = r * (uDay * 0.5 + 0.5) + stars + sunGlow + moonGlow;
  g = g * (uDay * 0.5 + 0.5) + stars + sunGlow + moonGlow;
  b = b * (uDay * 0.5 + 0.5) + stars + sunGlow + moonGlow;

  gl_FragColor = vec4(r, g, b, 1.0);
  // gl_FragColor = vec4((1.0 - pos.z) *.05, .1 - abs(pos.z*.001), pos.z*.05, 1.0);
}
