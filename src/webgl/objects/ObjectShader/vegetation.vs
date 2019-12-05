attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;

varying vec3 pos;
varying float time;
varying vec3 vNormal;

void main() {
  vNormal = normal;
  time = uTime;
  pos = position;
  vec4 modelViewPosition = modelViewMatrix * vec4(position,1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
