import { drawRect } from './drawing/draw-rect'
import { drawCircle } from './drawing/draw-circle'
import {
  clearColor,
  getGL,
  setContext,
  setFramebuffer,
  getCurrentFramebuffer,
  getWidth,
  getHeight,
  setViewport,
  isContextInitialized,
} from './context'
import { getRgba, getRandomColor } from './color'
import { Shader, createShader } from './shader'
import { GraphicsBuffer, GraphicsBufferType } from './graphics-buffer'
import { Framebuffer } from './framebuffer'
import { draw } from './draw'

const Graphics = {
  clearColor,
  createShader,
  draw,
  drawCircle,
  drawRect,
  Framebuffer,
  getCurrentFramebuffer,
  getGL,
  getRgba,
  getHeight,
  getWidth,
  GraphicsBuffer,
  GraphicsBufferType,
  isContextInitialized,
  setContext,
  setFramebuffer,
  setViewport,
  Shader,
  getRandomColor
}

export default Graphics