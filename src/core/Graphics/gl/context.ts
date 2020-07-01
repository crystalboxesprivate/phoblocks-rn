import { Framebuffer } from './framebuffer'
import { Color, getRgba } from '../color'

let _gl: WebGL2RenderingContext | null = null
let _fbo: Framebuffer | null = null
export function getGL(): WebGL2RenderingContext { return <WebGL2RenderingContext>_gl }
export function isContextInitialized() { if (_gl) { return true } else { return false } }
export function setContext(gl: WebGL2RenderingContext) { _gl = gl }
export function setFramebuffer(fbo: Framebuffer | null) { _fbo = fbo }
export function getCurrentFramebuffer() { return _fbo }
export function getWidth() { if (_fbo) { return _fbo.width } else { return _gl?.drawingBufferWidth || 1 } }
export function getHeight() { if (_fbo) { return _fbo.height } else { return _gl?.drawingBufferHeight || 1 } }
export function setViewport(x?: number, y?: number, width?: number, height?: number) {
  _gl?.viewport(x || 0, y || 0, width || getWidth(), height || getHeight())
}
export function clearColor(col: Color) {
  col = getRgba(col)
  _gl?.clearColor(col[0], col[1], col[2], col[3])
  _gl?.clear(getGL().COLOR_BUFFER_BIT)
}
export const FLOAT = getGL().FLOAT