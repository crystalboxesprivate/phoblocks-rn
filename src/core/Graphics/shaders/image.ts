import { glsl } from "./glsl";

const vert = glsl`
precision mediump float;

attribute vec3 position;
uniform mat4 xform;
varying vec2 uv;

void main() {
  uv = vec2(position.x, position.y);
  gl_Position = xform * vec4(position.xy, 0, 1);
}
`

const frag = glsl`
precision mediump float;
varying vec2 uv;

uniform sampler2D texture;
uniform float alpha;

void main(void) {
  vec4 t = texture2D(texture, vec2(uv.x, uv.y));
  gl_FragColor = vec4(t.xyz, alpha * t.w);
}
`

const uvFlipVert = glsl`
precision mediump float;

attribute vec3 position;
uniform mat4 xform;
varying vec2 uv;

void main() {
  uv = vec2(position.x, 1.0 - position.y);
  gl_Position = xform * vec4(position.xy, 0, 1);
}
`

const compositeFrag = glsl`
precision mediump float;
varying vec2 uv;

uniform sampler2D texture;
uniform sampler2D bg;
uniform float alpha;

void main(void) {
  vec4 t = texture2D(texture, vec2(uv.x, uv.y));
  vec4 b = texture2D(bg, vec2(uv.x, uv.y));
  gl_FragColor = mix(b,t, t.xyz * alpha);// vec4(t.xyz, alpha * t.w);
}
`

export default {
  vert,
  frag,
  uvFlipVert,
  compositeFrag
}
