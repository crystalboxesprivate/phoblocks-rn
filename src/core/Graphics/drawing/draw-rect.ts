import { Color, getRgba } from "../color"
import { Shader, createShader } from '../gl/shader'
import { pushMatrix, translate, scale, getCurrentMatrix, popMatrix } from '../transform'
import { getSolidShader } from "../shaders"
import { FLOAT } from "../gl/context"
import { GraphicsBuffer, GraphicsBufferType } from "../gl/graphics-buffer"
import { draw } from '../gl/draw'

type DrawRectData = {
  vertexBuffer: GraphicsBuffer
  indexBuffer: GraphicsBuffer
  shader: Shader
}

let drawRectData: DrawRectData | null = null

export function drawRect(x: number, y: number, width: number, height: number, color: Color, shader?: Shader | null) {
  if (!drawRectData) {
    drawRectData = {
      vertexBuffer: new GraphicsBuffer(GraphicsBufferType.VERTEX),
      indexBuffer: new GraphicsBuffer(GraphicsBufferType.INDEX),
      shader: getSolidShader()
    }
    drawRectData.vertexBuffer.setData(new Float32Array([
      0, 1, 0, 0,
      1, 0, 1, 1,
    ]))
    drawRectData.indexBuffer.setData(new Uint16Array([3, 2, 1, 3, 1, 0]))
  }

  pushMatrix()
  translate(x, y, 0)
  scale(width, height)
  const mat = getCurrentMatrix()
  popMatrix()

  shader = shader || drawRectData.shader
  color = getRgba(color)

  shader.setVector4('color', color)
  shader.setMatrix('xform', mat)

  const { vertexBuffer, indexBuffer } = drawRectData

  draw(shader, ['position',], [{
    size: 2,
    glType: FLOAT,
    normalized: false,
    stride: 0,
    offset: 0,
  },], 0, 6, vertexBuffer, indexBuffer)
}
