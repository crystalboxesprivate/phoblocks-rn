import Graphics from './Graphics'

class Image {
  texture: WebGLTexture | null = null
  width = 1
  height = 1

  draw(x: number, y: number, w: number, h: number) {
    Graphics.drawImage(this, x, y, w, h)
  }
}

export default Image
