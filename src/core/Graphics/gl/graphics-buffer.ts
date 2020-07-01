import Graphics from ".."

export enum GraphicsBufferType {
  VERTEX = 'vertex',
  INDEX = 'index'
}

export class GraphicsBuffer {
  gl: WebGL2RenderingContext
  type: GraphicsBufferType
  buffer: WebGLBuffer | null


  constructor(type?: GraphicsBufferType) {
    this.gl = Graphics.getGL()
    this.type = type || GraphicsBufferType.VERTEX
    this.buffer = this.gl.createBuffer()
  }

  get glBufferType() {
    if (this.type === GraphicsBufferType.VERTEX) {
      return this.gl.ARRAY_BUFFER
    } else {
      return this.gl.ELEMENT_ARRAY_BUFFER
    }
  }

  setData(data: Float32Array | Uint16Array) {
    const gl = this.gl
    gl.bindBuffer(this.glBufferType, this.buffer)
    gl.bufferData(this.glBufferType, data, gl.STATIC_DRAW)
    gl.bindBuffer(this.glBufferType, null)
  }
}
