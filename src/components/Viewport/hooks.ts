import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, PanResponder, PanResponderInstance, GestureResponderEvent } from 'react-native'

import { mat2d, vec2 } from 'gl-matrix'

export type ViewTransform = [[number, number], number, number, (pos: [number, number]) => void,
  (scale: number) => void, (rotation: number) => void]


type Vec2D = [number, number]
export type Vector2D = { x: number, y: number }

export const useVectorRef = (initX: number, initY: number): [Vector2D, (x: number, y: number) => void] => {
  const val = useRef({ x: initX, y: initY }).current
  const setVal = (x: number, y: number) => { val.x = x; val.y = y }
  return [val, setVal]
}

export const useBoolRef = (init: boolean): [React.MutableRefObject<boolean>, (value: boolean) => boolean] => {
  const val = useRef(init)
  const setVal = (value: boolean) => val.current = value
  return [val, setVal]
}

export const useScalarRef = (init: number): [React.MutableRefObject<number>, (value: number) => number] => {
  const val = useRef(init)
  const setVal = (value: number) => val.current = value
  return [val, setVal]
}


const getAngleBetween = (a: Vec2D, b: Vec2D) => {
  let angle = Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0])
  if (angle > Math.PI) { angle -= 2 * Math.PI; }
  else if (angle <= -Math.PI) { angle += 2 * Math.PI; }

  return angle
}

const sub = (a: Vec2D, b: Vec2D) => [a[0] - b[0], a[1] - b[1]] as Vec2D

type Gesture = {
  active: boolean,
  scale: number,
  rotation: number,
  _startA: Vec2D,
  _startB: Vec2D
}

export const useGesture = (): [Gesture, () => void, (event: GestureResponderEvent) => void,
  (event: GestureResponderEvent) => void, (event: GestureResponderEvent) => void] => {
  const gesture = useRef({
    active: false,
    scale: 1.0,
    rotation: 0,
    _startA: [0, 0] as Vec2D,
    _startB: [0, 0] as Vec2D,
  } as Gesture).current

  const resetGesture = () => {
    if (!gesture.active) {
      gesture.scale = 1.0
      gesture.rotation = 0
    }
  }

  const initGesture = (event: GestureResponderEvent) => {
    if (!gesture.active && event.nativeEvent.touches.length >= 2) {
      gesture.scale = 1.0
      gesture.rotation = 0
      gesture.active = true

      gesture._startA = [
        event.nativeEvent.touches[0].pageX,
        event.nativeEvent.touches[0].pageY
      ]
      gesture._startB = [
        event.nativeEvent.touches[1].pageX,
        event.nativeEvent.touches[1].pageY
      ]
    }
  }

  const updateGesture = (event: GestureResponderEvent) => {
    if (event.nativeEvent.touches.length < 2) {
      gesture.active = false
    } else {
      gesture.rotation = getAngleBetween(sub(gesture._startA, gesture._startB), sub(
        [event.nativeEvent.touches[0].pageX, event.nativeEvent.touches[0].pageY],
        [event.nativeEvent.touches[1].pageX, event.nativeEvent.touches[1].pageY]
      ))
      const V = vec2.length(vec2.fromValues(
        gesture._startA[0] - gesture._startB[0],
        gesture._startA[1] - gesture._startB[1],
      ))
      const changedV = vec2.length(vec2.fromValues(
        event.nativeEvent.touches[0].pageX - event.nativeEvent.touches[1].pageX,
        event.nativeEvent.touches[0].pageY - event.nativeEvent.touches[1].pageY,
      ))
      gesture.scale = 1
      if (V) {
        gesture.scale = changedV / V
      }
    }
  }

  const endGesture = (event: GestureResponderEvent) => {
    gesture.active = false
    gesture.scale = 1.0
    gesture.rotation = 0
  }

  return [gesture, resetGesture, initGesture, updateGesture, endGesture]
}

export const useNavigationResponder = (viewTransform: ViewTransform):
  [Gesture, (event: GestureResponderEvent) => void, (event: GestureResponderEvent) => void, (event: GestureResponderEvent) => void] => {
  const [position, scale, rotation, setPosition, setScale, setRotation] = viewTransform
  const [gesture, resetGesture, initGesture, updateGesture, endGesture] = useGesture()
  const [touchStart, setTouchStart] = useVectorRef(0, 0)
  const [canvasPosTouchStart, setCanvasPosTouchStart] = useVectorRef(position[0], position[1])
  const [isZooming, setIsZooming] = useBoolRef(false)
  const [touchZoomStart, setTouchZoomStart] = useScalarRef(1)


  const getAbsoluteMouseCoords = (event: GestureResponderEvent) => {
    let x = 0
    let y = 0
    if (!event.nativeEvent.touches) {
      return [0, 0]
    }

    for (let t = 0; t < 2; t++) {
      if (t >= event.nativeEvent.touches.length) { continue }
      x += event.nativeEvent.touches[t].pageX
      y += event.nativeEvent.touches[t].pageY
    }

    x /= event.nativeEvent.touches.length
    y /= event.nativeEvent.touches.length
    return [x, y]
  }

  const viewportToCanvas = (x: number, y: number, withScale?: number) => {
    withScale = withScale || scale
    let transform = (() => {
      const transform = mat2d.identity(mat2d.create())
      mat2d.translate(transform, transform, position)
      mat2d.scale(transform, transform, [withScale, withScale])
      return transform
    })()
    mat2d.invert(transform, transform)
    let v2 = vec2.create()
    vec2.transformMat2d(v2, [x, y], transform)
    return { x: v2[0], y: v2[1] }
  }

  const updateZoom = (newScale: number, zoomPos: Vector2D) => {
    const rel = viewportToCanvas(zoomPos.x, zoomPos.y)
    if (newScale < 0.01) { newScale = 0.01 }
    setScale(newScale)
    const relZoomed = viewportToCanvas(zoomPos.x, zoomPos.y, newScale)
    setCanvasPosTouchStart(
      canvasPosTouchStart.x + (relZoomed.x - rel.x) * newScale,
      canvasPosTouchStart.y + (relZoomed.y - rel.y) * newScale
    )
  }

  const handleTouchStart = (e: GestureResponderEvent) => {
    let [x, y] = getAbsoluteMouseCoords(e)

    setTouchStart(x, y)
    setCanvasPosTouchStart(position[0], position[1])
  }

  const handleTouchMove = (e: GestureResponderEvent) => {
    let [x, y] = getAbsoluteMouseCoords(e)
    if (e.nativeEvent.touches && e.nativeEvent.touches.length > 1) {
      if (gesture.active) {
        if (!isZooming.current) {
          setIsZooming(true)
          setTouchZoomStart(scale)
        }
        updateZoom(touchZoomStart.current * gesture.scale, touchStart)
      }
      setPosition([canvasPosTouchStart.x + (x - touchStart.x),
      canvasPosTouchStart.y + (y - touchStart.y)])
    } else {
      setTouchZoomStart(scale)
      setIsZooming(false)
    }
  }

  const handleTouchEnd = (e: GestureResponderEvent) => {
    setTouchZoomStart(scale)
    setIsZooming(false)
  }

  const onTouchStart = (event: GestureResponderEvent) => {
    resetGesture()
    initGesture(event)
    if (gesture.active) {
      handleTouchStart(event)
    }
  }

  const onTouchMove = (event: GestureResponderEvent) => {
    if (!gesture.active) {
      initGesture(event)
      handleTouchStart(event)
    } else {
      initGesture(event)
    }
    updateGesture(event)
    handleTouchMove(event)
  }

  const onTouchEnd = (event: GestureResponderEvent) => {
    endGesture(event)
    handleTouchEnd(event)
  }

  return [gesture,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  ]
}
