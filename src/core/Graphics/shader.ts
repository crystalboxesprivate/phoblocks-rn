import { getGL } from './context'
import { mat4 } from 'gl-matrix'

function err(msg: string) { console.error(msg) }

export function createShader(vtxSrc: string, fragSrc: string) {
  const gl = getGL()
  let getGlShader = function (shaderSource: string, shaderType: number) {
    const shader = gl.createShader(shaderType)
    if (!shader) {
      return null
    }
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // errorCallback = errorCallback || err
      err(`Compile error of ${shader}: ${gl.getShaderInfoLog(shader)}`)
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
  let program = gl.createProgram()
  if (!program) { return new Shader(gl, null as unknown as WebGLProgram) }

  let sh = getGlShader(vtxSrc, gl.VERTEX_SHADER)
  if (!sh) { return new Shader(gl, program) }
  gl.attachShader(program, sh)

  sh = getGlShader(fragSrc, gl.FRAGMENT_SHADER)
  if (!sh) { return new Shader(gl, program) }
  gl.attachShader(program, sh)

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    err(`Link error: ${gl.getProgramInfoLog(program)}`)
  }
  return new Shader(gl, program)
}

enum UniformType {
  FLOAT = 'float',
  VEC3 = 'vec3',
  VEC4 = 'vec4',
  INT = 'int',
  MAT4 = 'mat4'
}

export class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram
  uniforms: Map<string, [UniformType, any]>
  textures: Map<string, WebGLTexture>

  constructor(gl: WebGL2RenderingContext, program?: WebGLProgram) {
    this.gl = gl
    this.program = <WebGLProgram>program
    this.uniforms = new Map()
    this.textures = new Map()
  }

  setTexture(id: string, texture: WebGLTexture) {
    this.textures.set(id, texture)
  }

  setFloat(id: string, floatVal: number) {
    this.uniforms.set(id, [UniformType.FLOAT, floatVal])
  }

  setInt(id: string, intVal: number) {
    this.uniforms.set(id, [UniformType.INT, intVal])
  }

  setVector(id: string, vec3: [number, number, number]) {
    this.uniforms.set(id, [UniformType.VEC3, vec3])
  }

  setVector4(id: string, vec4: [number, number, number, number]) {
    this.uniforms.set(id, [UniformType.VEC4, vec4])
  }

  setMatrix(id: string, m4: mat4) {
    this.uniforms.set(id, [UniformType.MAT4, m4])
  }

  submitUniforms() {
    const gl = this.gl

    gl.useProgram(this.program)
    const validateId = (id: WebGLUniformLocation | null | string): WebGLUniformLocation | null => {
      let newId = id
      if (typeof (id) === 'string') {
        newId = gl.getUniformLocation(this.program, id)
      }
      return newId
    }


    this.uniforms.forEach(([type, value], nameid) => {
      const id = validateId(nameid)

      switch (type) {
        case UniformType.FLOAT:
          gl.uniform1f(id, value)
          break;
        case UniformType.VEC3:
          gl.uniform3f(id, value[0], value[1], value[2])
          break;
        case UniformType.VEC4:
          gl.uniform4f(id, value[0], value[1], value[2], value[3])
          break;
        case UniformType.MAT4:
          gl.uniformMatrix4fv(id, false, value)
          break;
      }
    })

    let index = 0
    this.textures.forEach((texture, name) => {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(validateId(name), index);
      index++
    })
  }
}

