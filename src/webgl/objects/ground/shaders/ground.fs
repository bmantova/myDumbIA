precision highp float;

uniform float uTime;

varying vec2 vUv;
varying float vHeight;

void main() {
  gl_FragColor = vec4(mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), vHeight), 1.0);
}
