precision mediump float;

attribute vec3 pos;
uniform mat4 xform;
varying vec2 uv;

void main() {
  uv = vec2(pos.x, pos.y);
  gl_Position = xform * vec4(pos.xy, 0, 1);
}
