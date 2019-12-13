precision highp float;

varying vec3 vTemperature;
varying float vHumidity;

uniform float uHeight;
uniform float uTemperature;
uniform float uHumidity;

void main() {
  float r = 255.0;
  float g = 0.0;
  float b = 0.0;

  gl_FragColor = vec4(r, g, b, 1.0);
}
