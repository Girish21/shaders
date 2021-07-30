// https://m.twitch.tv/videos/1096744341
// 1:00:00 - 1:10:00 very very important to understand the solution

uniform float uTime;
uniform vec2 uResolution;

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution) / uResolution.yy;
  float progress = fract(uTime / 3.);
  float dist = 1. - smoothstep(progress * 0.5 - 1., progress * 6.5 + 1., length(uv));

  float size = 15. * exp(log(5./15.) * progress);

  vec2 newCoordsBigSquar = uv * size;
  // vec2 newUv = fract(newCoords);

  vec2 newCoordsSmallSquare = uv * size * 3.;
  // vec2 newUv1 = fract(newCoords1);

  float bigSquare = mod(floor(newCoordsBigSquar.x) + floor(newCoordsBigSquar.y), 2.);
  float smallSquare = mod(floor(newCoordsSmallSquare.x) + floor(newCoordsSmallSquare.y), 2.);

  float finalStrength = mix(bigSquare, smallSquare, dist);

  gl_FragColor = vec4(vec3(finalStrength), 1.);
}