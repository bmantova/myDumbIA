
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
  seaZ = 0.0;
  if(z < -0.5) {
  	seaZ = sin(position.x * 0.3 + time * 20.0 + cos(position.y)) * 0.4 * sin(position.x * position.y * 0.05) + cos(position.y * 0.4 + time * 20.0 + sin(position.x)) * 0.3 * cos(position.y * position.x * 0.05);
  	z = seaZ;
  }
  vec4 modelViewPosition = modelViewMatrix * vec4(position.xy, z,1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
