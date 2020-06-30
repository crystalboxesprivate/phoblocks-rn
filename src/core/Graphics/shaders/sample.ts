import { glsl } from "./glsl";
const vert = glsl`
void main(void) {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`

const frag = glsl`
void main(void) {
  gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`
export default { vert, frag }
