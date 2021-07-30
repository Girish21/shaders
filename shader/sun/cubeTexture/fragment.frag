uniform float uTime;
uniform vec2 uResolution;
uniform samplerCube uPerlin;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  gl_FragColor = textureCube(uPerlin, vPosition);
  // gl_FragColor = vec4(vPosition, 1.);
}
