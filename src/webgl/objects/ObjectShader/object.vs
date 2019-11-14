precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;


uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uPosX;
uniform float uPosY;
uniform float uPosZ;

varying vec2 vUv;
varying float vHeight;
varying vec3 rPos;
varying vec3 vNormal;

void main() {
	vUv = uv;
	vNormal = normal;
	vec3 pos = position;
	rPos = vec3(uPosX, uPosY, uPosZ);

  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
