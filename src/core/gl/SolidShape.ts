import Graphics from './Graphics'
import { mat4, mat3, mat2d } from 'gl-matrix'
import { GraphicsBuffer, GraphicsBufferType } from './GraphicsBuffer'
import Shader from './Shader'
import { Color, BasicColor } from './Color'

const defaultCircleResolution = 20

const nullBuff = (): ArrayBuffer | null => null

class SolidShape {
  solidShader: Shader | null = null
  imageShader: Shader | null = null
  imageFlipUv: Shader | null = null

  arrayBuffer: ArrayBuffer | null = null

  shapeType = {
    rect: 0,
    circle: 1
  }

  shapes = {
    rect: { size: 0, arrayBuffer: nullBuff() },
    circle: { size: 0, arrayBuffer: nullBuff(), resolution: defaultCircleResolution }
  }

  SetCircleResolution(value: number) {
    this.shapes.circle.resolution = value > 0 ? value : defaultCircleResolution
    this.updateCircle()
  }

  init() {
    const gl = Graphics.gl
    this.solidShader = Graphics.createShader(
      'solid.vert.glsl', 'solid.frag.glsl'
    )
    this.imageShader = Graphics.createShader(
      'image.vert.glsl', 'image.frag.glsl'
    )
    this.imageFlipUv = Graphics.createShader(
      'image-uvflip.vert.glsl', 'image.frag.glsl'
    )

    let program = this.solidShader.program
    gl.useProgram(program)
    this.shapes.rect = {
      size: 6,
      arrayBuffer: function () {
        const ab = new ArrayBuffer(gl, GraphicsBufferType.VERTEX)
        ab.setData(
          [
            0, 0, 0, 1, 1, 0,
            1, 0, 0, 1, 1, 1,
          ]
        )
        return ab
      }(),
    }

    this.updateCircle()
    gl.useProgram(null)
  }

  updateCircle() {
    let gl = Graphics.gl
    let circle = this.shapes.circle
    // make vertices from resolution
    let verts = []
    circle.size = 0;
    let angle = 0
    let step = 2 * Math.PI / circle.resolution
    while (angle < 2 * Math.PI) {
      verts.push(Math.sin(angle), Math.cos(angle))
      angle += step
      verts.push(Math.sin(angle), Math.cos(angle))
      verts.push(0, 0)
      circle.size += 3
    }

    if (!circle.arrayBuffer) {
      circle.arrayBuffer = new ArrayBuffer(gl)
    }

    circle.arrayBuffer.setData(new Float32Array(verts))
  }

  // it should draw the uv quad
  draw(shape: any, x: number, y: number, w: number, h: number, color?: Color | BasicColor) {
    Graphics.pushMatrix()
    Graphics.translate(x, y, 0)
    Graphics.scale(w, h)
    const mat = Graphics.currentMatrix
    Graphics.popMatrix()


    // get appropriate shader
    let shapeData = this.shapes.rect
    const isImage = typeof shape === 'object' && 'width' in shape && 'height' in shape

    let shader = this.solidShader
    if (isImage) {
      if ('fb' in shape) {
        shader = this.imageFlipUv
      } else {
        shader = this.imageShader
      }
    }

    if (shader === null) {
      return
    }

    if (!isImage && this.shapeType.circle == shape) {
      // bind texture
      shapeData = this.shapes.circle
    }

    const gl = Graphics.gl

    shader.setMatrix('xform', mat)
    if (isImage) {
      shader.setTexture('texture', shape.texture)
      shader.setFloat('alpha', Graphics.color.a)
    } else {
      if (!color) {
        color = { r: 0, g: 0, b: 0, a: 1 }
      }
      shader.setVector4('color', [color.r, color.g, color.b, color.a])
    }

    Graphics.draw(shader, ['pos',], [{
      size: 2,
      glType: gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0,
    },], 0, shapeData.size, shapeData.arrayBuffer, null)





    // let program = null
    // if (isImage) {
    //   // this is an fbo
    //   if ('fb' in shape) {
    //     program = this.imageFlipUv.program
    //   } else {
    //     program = this.imageShader.program
    //   }
    // } else {
    //   program = this.solidShader.program
    // }

    // gl.useProgram(program)
    // gl.uniformMatrix4fv(gl.getUniformLocation(program, 'xform'), false, mat)
    // if (isImage) {
    //   gl.bindTexture(gl.TEXTURE_2D, shape.texture);
    //   console.log(gl.getUniformLocation(program, 'texture'))
    //   gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0);
    //   gl.uniform1f(gl.getUniformLocation(program, 'alpha'), Graphics.color.a)
    // } else {
    //   gl.uniform4f(gl.getUniformLocation(program, 'color'), color.r, color.g, color.b, color.a)
    // }


    // let attr = gl.getAttribLocation(program, 'pos')
    // gl.bindBuffer(gl.ARRAY_BUFFER, shapeData.arrayBuffer.buffer)
    // gl.enableVertexAttribArray(attr)
    // gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0)
    // gl.drawArrays(gl.TRIANGLES, 0, shapeData.size)
    // gl.bindBuffer(gl.ARRAY_BUFFER, null)
    // if (isImage) {
    //   gl.bindTexture(gl.TEXTURE_2D, null);
    // }
    // gl.useProgram(null)
  }
}

export default SolidShape
