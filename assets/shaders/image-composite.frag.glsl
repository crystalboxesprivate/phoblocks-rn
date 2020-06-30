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
