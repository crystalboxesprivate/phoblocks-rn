import { glsl } from "./glsl";
const vert = glsl`
precision mediump float;

attribute vec3 position;
uniform mat4 xform;

void main() {
  gl_Position = xform * vec4(position.xy, 0, 1);
}
`

const frag = glsl`
precision mediump float;
uniform vec4 color;
void main(void) {
  gl_FragColor = color; 
}
`
export default { vert, frag }
