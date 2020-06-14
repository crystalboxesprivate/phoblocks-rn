precision mediump float;
varying vec2 uv;
uniform sampler2D texture;
uniform float alpha;
void main(void) {
  vec4 t = texture2D(texture, vec2(uv.x, uv.y));
  gl_FragColor = vec4(t.xyz, alpha * t.w);
  // gl_FragColor = vec4(1,0,0,1);

}
