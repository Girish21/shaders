uniform float uTime;
uniform vec2 uResolution;
uniform samplerCube uPerlin;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vEyeVector;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

float fresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1. + dot(eyeVector, worldNormal), 3.);
}

float supersun() {
  float sum = 0.;
  sum += textureCube(uPerlin, vLayer0).r;
  sum += textureCube(uPerlin, vLayer1).r;
  sum += textureCube(uPerlin, vLayer2).r;
  sum *= .33;
  return sum;
}

vec3 brightnessToColor(float brightness) {
  brightness *= .25;
  return (vec3(brightness, brightness * brightness, brightness * brightness * brightness * brightness) / .25) * .6;
}

void main() {
  float f = fresnel(vEyeVector, vNormal);
  float brightness = supersun();
  brightness = brightness * 4. + 1.;
  brightness += f;

  vec3 color = brightnessToColor(brightness);
  gl_FragColor = vec4(color, 1.);
  // gl_FragColor = vec4(vLayer2, 1.);
}
