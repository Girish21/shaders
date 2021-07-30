uniform float uTime;
uniform vec2 uResolution;

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution) / uResolution.yy;

  gl_FragColor = vec4(uv, 1., 1.);
}
