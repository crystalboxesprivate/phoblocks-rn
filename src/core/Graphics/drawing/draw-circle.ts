import { Color, getRgba } from "../color"
import { Shader, createShader } from '../gl/shader'
import { pushMatrix, translate, scale, getCurrentMatrix, popMatrix } from '../transform'
import { getSolidShader } from "../shaders"
import { getWidth, getHeight, clearColor, setViewport, FLOAT } from "../gl/context"
import { GraphicsBuffer, GraphicsBufferType } from "../gl/graphics-buffer"
import { draw } from '../gl/draw'
import { glsl } from "../shaders/glsl"


const defaultCircleResolution = 20

type DrawCircleData = {
  vertexBuffer: GraphicsBuffer
  shader: Shader
  size: number
}

let drawCircleData: DrawCircleData | null = null

export function drawCircle(x: number, y: number, r: number, color: Color, shader?: Shader | null) {
  if (!drawCircleData) {
    drawCircleData = {
      vertexBuffer: new GraphicsBuffer(GraphicsBufferType.VERTEX),
      shader: getSolidShader(),
      size: 0
    }

    const circleResolution = defaultCircleResolution
    // make vertices from resolution
    let verts = []
    drawCircleData.size = 0;
    let angle = 0
    let step = 2 * Math.PI / circleResolution

    while (angle < 2 * Math.PI) {
      verts.push(Math.sin(angle), Math.cos(angle))
      angle += step
      verts.push(Math.sin(angle), Math.cos(angle))
      verts.push(0, 0)
      drawCircleData.size += 3
    }

    if (!drawCircleData.vertexBuffer) {
      drawCircleData.vertexBuffer = new GraphicsBuffer()
    }
    drawCircleData.vertexBuffer.setData(new Float32Array(verts))
  }

  pushMatrix()
  translate(x, y, 0)
  scale(r, r)
  const mat = getCurrentMatrix()
  popMatrix()

  shader = shader || drawCircleData.shader
  color = getRgba(color)

  shader.setVector4('color', color)
  shader.setMatrix('xform', mat)

  const { vertexBuffer } = drawCircleData

  draw(shader, ['position',], [{
    size: 2,
    glType: FLOAT,
    normalized: false,
    stride: 0,
    offset: 0,
  },], 0, drawCircleData.size, vertexBuffer, null)
}
