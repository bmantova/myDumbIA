precision lowp float;

uniform float uDay;
varying vec3 pos;

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

  float stars = sin(pos.z + 23.1 + uDay) * 0.4 + sin(pos.y - 10.6 + uDay * 0.5) * 0.3 + sin(pos.x + 5.2) * 0.3;
  if(stars > 0.98) stars = clamp((stars - 0.98) * 50.0 - uDay * 2.0, 0.0, 1.0);
  else stars = 0.0;

  float sunGlow = (clamp(500.0 - distance(pos, vec3(uSunX, uSunY, uSunZ)), 0.0, 500.0) / 500.0) * (uDay * 0.5);
  float moonGlow = (clamp(300.0 - distance(pos, vec3(uMoonX, uMoonY, uMoonZ)), 0.0, 300.0) / 300.0) * ((1.0 - uDay) * 0.1);

  float mult = (uDay * 0.5 + 0.5) + stars + sunGlow + moonGlow;
  gl_FragColor = vec4(vec3(r, g, b) * mult, 1.0);
}
