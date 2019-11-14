precision highp float;

uniform float uTime;

varying vec2 vUv;
varying float vHeight;
varying vec3 rPos;
varying vec3 vNormal;

uniform float uAmplitude;
uniform float uWave;
uniform float uVelocity;

void main() {
  // gl_FragColor = vec4(mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), vHeight), 1.0);
	float dist = distance(rPos.xy, vec2(0.0, -3));

  gl_FragColor = vec4(vNormal.x + sin(cos(rPos.z)) * 0.6 + 0.5,vNormal.y + cos(rPos.y + uTime * sin(rPos.x * 0.1)) * 0.6 + 0.5,sin(rPos.z) * 0.5 + 0.5, 1.0);
}
