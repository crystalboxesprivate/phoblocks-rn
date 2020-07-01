import { glsl } from "./glsl";

export const checkerFrag = glsl`
precision mediump float;
varying vec2 uv;
uniform vec3 aspect;
void main(void) {
  float size = 0.02 * aspect.y;
  vec2 tc = vec2(uv.x, uv.y / aspect.x);
  vec2 Pos = floor(tc / size);
  float PatternMask = mod(Pos.x + mod(Pos.y, 2.0), 2.0);
  PatternMask = PatternMask < 0.0 ? 0.0 : PatternMask>1.0 ? 1.0: PatternMask;
  float m = 0.80392156862;
  gl_FragColor = mix(vec4(m,m,m,1), vec4(1), PatternMask);
}
`