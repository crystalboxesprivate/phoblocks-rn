import { vec2 } from 'gl-matrix'
import { getCurrentFramebuffer } from './context'
import { TransformStack, Transform } from './transform-stack'

const transformStack = new TransformStack()

export function getCurrentTransformStack() {
  const currentFbo = getCurrentFramebuffer()
  if (currentFbo != null) {
    return currentFbo.transformStack
  }
  return transformStack
}

export function pushMatrix() {
  const ts = getCurrentTransformStack()
  ts.transforms.push(new Transform())
  ts.setDirty()
}

export function popMatrix() {
  const ts = getCurrentTransformStack()
  ts.setDirty()
  return ts.transforms.pop()
}

export function translate(x?: number, y?: number, z?: number) {
  x = x || 0
  y = y || 0

  const ts = getCurrentTransformStack()
  ts.transforms[ts.transforms.length - 1].translate = vec2.fromValues(x, y)
  ts.setDirty()
}

export function scale(x?: number, y?: number) {
  x = x || 1
  y = y || 1

  const ts = getCurrentTransformStack()

  ts.transforms[ts.transforms.length - 1].scale = vec2.fromValues(x, y)
  ts.setDirty()
}

export function rotate(theta: number) {

  const ts = getCurrentTransformStack()

  ts.transforms[ts.transforms.length - 1].rotate = (theta * Math.PI) / 180
  ts.setDirty()
}

export function getCurrentMatrix() {
  return getCurrentTransformStack().matrix
}

