import { TransformStack } from '../transform-stack'
import { getGL, setFramebuffer, setViewport } from './context'

class Image {
  texture: WebGLTexture | null = null
  width = 1
  height = 1

  draw(x: number, y: number, w: number, h: number) {
    // TODO implement draw image
    // Graphics.drawImage(this, x, y, w, h)
  }
}

export class Framebuffer extends Image {
  fb: WebGLFramebuffer | null = null
  transformStack: TransformStack
  constructor() {
    super()
    this.transformStack = new TransformStack()
  }

  release() {
    if (this.texture != null) {
      getGL().deleteTexture(this.texture)
      this.texture = null
    }
    if (this.fb != null) {
      getGL().deleteFramebuffer(this.fb)
      this.fb = null
    }
  }

  allocate(width: number, height: number) {
    this.release()

    this.width = width
    this.height = height

    let gl = getGL()
    // create to render to
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    {
      const level = 0;
      const internalFormat = gl.RGBA;
      const border = 0;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
      const data = null;
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, format, type, data);

      // set the filtering so we don't need mips
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    this.fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.texture = targetTexture
  }

  begin() {
    let gl = getGL()
    setFramebuffer(this)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    setViewport(0, 0, this.width, this.height)
  }

  end() {
    let gl = getGL()
    setFramebuffer(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setViewport()
  }

  dumpImage() {
    let gl = getGL()
    let width = this.width
    let height = this.height
    // Create a framebuffer backed by the texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    // Read the contents of the framebuffer
    var data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return data
  }
}

export default Framebuffer
