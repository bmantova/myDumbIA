
attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uAmplitude;
uniform float uWave;
uniform float uVelocity;
uniform float uTime;

varying vec2 vUv;
varying float vHeight;

void main() {
  vUv = uv;

	vec3 pos = position;
	vec2 center = vec2(0.5);

	float dist = distance(uv, center);

	float ripple = cos(sin(dist * uWave - uTime * uVelocity));

	ripple = smoothstep(0.5, 1., ripple) * max(1. - dist, 0.);
	// ripple *= (1. - (dist * 6.5)) * uAnimation;

	pos.z += uAmplitude * ripple;

	vHeight = pos.z;

  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
