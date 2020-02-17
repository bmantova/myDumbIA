attribute vec3 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform float uHeight;
uniform float uHumidity;
uniform float uAdios;

varying vec3 pos;
varying float time;
varying float seaZ;
varying vec3 vNormal;
varying float vHeight;
varying float vHumidity;
varying float vAdios;

void main() {
  time = uTime;
  pos = position;
  vNormal = normal;
  vHeight = uHeight;
  vAdios = uAdios;
  float z = pos.z * uHeight;
  seaZ = 0.0;
  vHumidity = uHumidity;
  float adiosZ = 0.0;

  if(z < -0.5 + uHumidity * 10.0) {
  	seaZ = sin(position.x * 0.3 + time * 20.0 + cos(position.y)) * 0.4 * sin(position.x * position.y * 0.05) + cos(position.y * 0.4 + time * 20.0 + sin(position.x)) * 0.3 * cos(position.y * position.x * 0.05);
  	z = seaZ;
  }
  else {
    adiosZ = vAdios * 0.1 * (sin(position.x * 0.5 + time * 40.0 + cos(position.y)) * 0.6 * sin(position.x * position.y * 0.5) + cos(position.y * 0.8 + time * 20.0 + sin(position.x)) * 3.0 * cos(position.y * position.x * 0.5));
  }
 
  vec4 modelViewPosition = modelViewMatrix * vec4(position.xy, z + adiosZ,1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
