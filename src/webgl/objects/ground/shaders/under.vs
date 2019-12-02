attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;

varying vec3 pos;
varying float time;
varying float seaZ;

void main() {
  time = uTime;
  pos = position;
  float z = position.z;
  vec4 modelViewPosition = modelViewMatrix * vec4(position.xy, z,1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
