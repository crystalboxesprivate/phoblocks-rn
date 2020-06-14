

enum GraphicsBufferType {
  VERTEX = 'vertex',
  INDEX = 'index'
}
class GraphicsBuffer {
  gl: WebGL2RenderingContext
  type: GraphicsBufferType
  buffer: WebGLBuffer | null


  constructor(gl: WebGL2RenderingContext, type?: GraphicsBufferType, data?: Array<number>) {
    this.gl = gl
    this.type = type || GraphicsBufferType.VERTEX
    this.buffer = gl.createBuffer()
    if (data) { this.setData(data) }
  }

  get glBufferType() {
    if (this.type === GraphicsBufferType.VERTEX) {
      return this.gl.ARRAY_BUFFER
    } else {
      return this.gl.ELEMENT_ARRAY_BUFFER
    }
  }

  setData(data: Array<number> | Float32Array) {
    const gl = this.gl
    gl.bindBuffer(this.glBufferType, this.buffer)
    gl.bufferData(this.glBufferType, new Float32Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(this.glBufferType, null)
  }
}

export { GraphicsBuffer, GraphicsBufferType }