uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vEyeVector;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

 mat2 rotate(float angle) {
   float s = sin(angle);
   float c = cos(angle);

   return mat2(c,-s,s,c);
 }

void main() {
  float t = uTime * 0.01;

  mat2 rotation = rotate(t);

  vec3 p0 = position;
  p0.yz = rotation * p0.yz;

  rotation = rotate(t + 10.);
  vec3 p1 = position;
  p1.xz = rotation * p1.xz;

  rotation = rotate(t + 40.);
  vec3 p2 = position;
  p2.xy = rotation * p2.xy;

  vec4 modelPosition = modelMatrix * vec4(position, 1.);

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vUv = uv;
  vPosition = position;
  vNormal = normal;
  vEyeVector = normalize(modelPosition.xyz - cameraPosition);
  vLayer0 = p0;
  vLayer1 = p1;
  vLayer2 = p2;
}