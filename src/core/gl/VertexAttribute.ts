class VertexAttribute {
  size: number
  glType: number
  normalized: boolean
  stride: number
  offset: number

  constructor(size: number, glType: number, normalized: boolean, stride: number, offset: number) {
    this.size = size
    this.glType = glType
    this.normalized = normalized
    this.stride = stride
    this.offset = offset
  }
}
export default VertexAttribute