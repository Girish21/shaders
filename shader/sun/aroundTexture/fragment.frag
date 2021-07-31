uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

vec3 brightnessToColor(float brightness) {
  brightness *= .25;
  return (vec3(brightness, brightness * brightness, brightness * brightness * brightness * brightness) / .25) * .6;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution) / uResolution.yy;

  float radial = 1. - vPosition.z;
  radial *= radial * radial;

  float brightness = 1. + radial * .83;

  gl_FragColor = vec4(brightnessToColor(brightness) * radial, radial);
}
