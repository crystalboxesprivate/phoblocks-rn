import Shader from './Shader'
import SolidShape from './SolidShape'
import { Color, BasicColor } from './Color'
import { TransformStack, Transform } from './TransformStack'
import { vec2 } from 'gl-matrix'

import Image from './Image'

import WebGLDebugUtils from 'webgl-debug'
import Framebuffer from './Framebuffer'
import { GraphicsBuffer } from './GraphicsBuffer'

// @ts-ignore
let gl: WebGL2RenderingContext = null
let rect = new SolidShape()
let currentFbo: Framebuffer | null = null

function err(msg: string) {
  console.error(msg)
}

class State {
  color: Color | { r: number, g: number, b: number, a: number } = Color.make(1, 1, 1, 1)
}

let state = new State()
let transformStack = new TransformStack()

function getCurrentTransformStack() {
  if (currentFbo != null) {
    return currentFbo.transformStack
  }
  return transformStack
}

function throwOnGLError(err: number, funcName: string, args: any) {
  throw (
    WebGLDebugUtils.glEnumToString(err) + ' was caused by call to: ' + funcName
  )
}
function logGLCall(functionName: string, args: any) {
  console.log(
    'gl.' +
    functionName +
    '(' +
    WebGLDebugUtils.glFunctionArgsToString(functionName, args) +
    ')'
  )
}
function validateNoneOfTheArgsAreUndefined(functionName: string, args: any) {
  for (var ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error(
        'undefined passed to gl.' +
        functionName +
        '(' +
        WebGLDebugUtils.glFunctionArgsToString(functionName, args) +
        ')'
      )
    }
  }
}
function logAndValidate(functionName: string, args: any) {
  logGLCall(functionName, args)
  validateNoneOfTheArgsAreUndefined(functionName, args)
}

class Graphics {
  static initializeWithGL(inGl: WebGL2RenderingContext) {
    gl = inGl

    Graphics.setViewport()
    rect.init()
  }

  static get width() {
    return Graphics.resolution.width
  }

  static get height() {
    return Graphics.resolution.height
  }

  static get resolution() {
    return {
      width: currentFbo ? currentFbo.width : gl.canvas.width,
      height: currentFbo ? currentFbo.height : gl.canvas.height,
    }
  }

  static get currentFbo() {
    return currentFbo
  }

  static set currentFbo(value) {
    currentFbo = value
  }

  static get color() {
    return state.color
  }

  static setColor(...color: number[]) {
    state.color = Color.getFloat(color)
  }

  static get solidShape() {
    return rect
  }

  static drawRect(x: number, y: number, w: number, h: number, ...color: number[]) {
    rect.draw(
      rect.shapeType.rect,
      x,
      y,
      w,
      h,
      Color.getFloat(color) || state.color
    )
  }

  static drawImage(image: Image, x: number, y: number, w: number, h: number) {
    if (!image.texture) {
      return
    }
    w = w || image.width
    h = h || image.height
    rect.draw(image, x, y, w, h)
  }

  static get circleResolution() {
    return rect.shapes.circle.resolution
  }

  static set circleResolution(value) {
    rect.SetCircleResolution(value)
  }

  static drawCircle(x: number, y: number, r: number, color: Color) {
    rect.draw(
      rect.shapeType.circle,
      x,
      y,
      r,
      r,
      Color.getFloat(color) || state.color
    )
  }

  static setViewport(x?: number, y?: number, w?: number, h?: number) {
    gl.viewport(x || 0, y || 0, w || gl.canvas.width, h || gl.canvas.height)
  }

  static clearColor(...color: number[]) {
    const col = Color.getFloat(color) || Color.getFloat(0)
    gl.clearColor(col.r, col.g, col.b, col.a)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Enable transparency
    // TODO move to a separate function (if it's necessary)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.disable(gl.DEPTH_TEST)
  }

  static get gl() {
    return gl
  }

  static createShader(vtxSrc: string, fragSrc: string, errorCallback?: Function) {
    errorCallback = errorCallback || err
    let getGlShader = function (shaderSource: string, shaderType: number) {
      if (shaderSource.endsWith('.glsl')) {
        shaderSource = require('./shaders/' + shaderSource)
      }

      const shader = gl.createShader(shaderType)
      if (!shader) {
        return null
      }
      gl.shaderSource(shader, shaderSource)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        errorCallback = errorCallback || err
        errorCallback(`Compile error of ${shader}: ${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader)
        return null
      }
      return shader
    }
    let program = gl.createProgram()
    if (!program) { return null }

    let sh = getGlShader(vtxSrc, gl.VERTEX_SHADER)
    if (!sh) { return null }
    gl.attachShader(program, sh)

    sh = getGlShader(fragSrc, gl.FRAGMENT_SHADER)
    if (!sh) { return null }
    gl.attachShader(program, sh)

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      errorCallback(`Link error: ${gl.getProgramInfoLog(program)}`)
    }
    return new Shader(gl, program)
  }

  static bindShader(shader: Shader) {
    gl.useProgram(shader.program)
  }

  static draw(
    shader: Shader,
    inputNames: string[],
    inputLayout: any[],
    offset: number,
    count: number,
    vertexBuffer: GraphicsBuffer,
    indexBuffer: GraphicsBuffer
  ) {
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

  static pushMatrix() {
    const ts = getCurrentTransformStack()
    ts.transforms.push(new Transform())
    ts.setDirty()
  }

  static popMatrix() {
    const ts = getCurrentTransformStack()
    ts.setDirty()
    return ts.transforms.pop()
  }

  static translate(x?: number, y?: number, z?: number) {
    x = x || 0
    y = y || 0

    const ts = getCurrentTransformStack()
    ts.transforms[ts.transforms.length - 1].translate = vec2.fromValues(x, y)
    ts.setDirty()
  }

  static scale(x?: number, y?: number) {
    x = x || 1
    y = y || 1

    const ts = getCurrentTransformStack()

    ts.transforms[ts.transforms.length - 1].scale = vec2.fromValues(x, y)
    ts.setDirty()
  }

  static rotate(theta: number) {

    const ts = getCurrentTransformStack()

    ts.transforms[ts.transforms.length - 1].rotate = (theta * Math.PI) / 180
    ts.setDirty()
  }

  static get currentMatrix() {
    return getCurrentTransformStack().matrix
  }
}

export default Graphics
