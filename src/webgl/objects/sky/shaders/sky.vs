attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 pos;

void main() {
  pos = position;

  vec4 modelViewPosition = modelViewMatrix * vec4(position.xyz,1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
