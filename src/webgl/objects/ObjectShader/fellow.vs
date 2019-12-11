attribute vec3 normal;
attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uFur;

varying vec3 vNormal;
varying float vFur;

void main() {
  vNormal = normal;
  vec3 pos = position;

  vFur = abs((sin(normal.x*55.0) + cos(normal.z * 13.0) + cos(normal.y * 38.0)) * uFur);
  pos = pos + normal * vFur * 0.5;

  vec4 modelViewPosition = modelViewMatrix * vec4(pos,1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
