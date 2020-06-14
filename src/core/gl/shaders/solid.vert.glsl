precision mediump float;

attribute vec3 pos;
uniform mat4 xform;

void main() {
  gl_Position = xform * vec4(pos.xy, 0, 1);
}
