import { Shader } from './shader'
import { GraphicsBuffer } from './graphics-buffer'
import { getGL } from './context'

export function draw(
  shader: Shader,
  inputNames: string[],
  inputLayout: any[],
  offset: number,
  count: number,
  vertexBuffer: GraphicsBuffer,
  indexBuffer: GraphicsBuffer | null
) {
  const gl = getGL()
  // bind shader
  const program = shader.program
  gl.useProgram(program)
  shader.submitUniforms()

  // attach index buffer
  if (indexBuffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer)
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.buffer)
  for (let x = 0; x < inputNames.length; x++) {
    const name = inputNames[x]
    const desc = inputLayout[x]

    const attr = gl.getAttribLocation(program, name)
    gl.enableVertexAttribArray(attr)
    gl.vertexAttribPointer(
      attr,
      desc.size,
      desc.glType,
      desc.normalized,
      desc.stride,
      desc.offset
    )
  }

  const primitiveType = gl.TRIANGLES
  if (indexBuffer) {
    const indexType = gl.UNSIGNED_SHORT
    gl.drawElements(primitiveType, count, indexType, offset)
  } else {
    gl.drawArrays(primitiveType, offset, count)
  }

  gl.bindTexture(gl.TEXTURE_2D, null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.useProgram(null)
}
