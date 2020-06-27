import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { Events } from '../../core/events'
import { CustomTouchEvent } from '../TouchEventLoader'
import { mat2d, vec2 } from 'gl-matrix'
import { overlayLog } from '../DebugOverlay'
import { ViewportActions } from '../../core/application/redux/ui/viewport'


function getAbsoluteMouseCoords(event: CustomTouchEvent) {
  let x = 0
  let y = 0
  if (!event.touches) {
    return [0, 0]
  }
  for (let t of event.touches) {
    x += t.pageX
    y += t.pageY
  }

  x /= event.touches.length
  y /= event.touches.length
  return [x, y]
}

export const Viewport = ({ children }: { children: JSX.Element }) => {
  const position = useSelector((state: PhoblocksState) => state.ui.viewport.position)
  const scale = useSelector((state: PhoblocksState) => state.ui.viewport.scale)
  const rotation = useSelector((state: PhoblocksState) => state.ui.viewport.rotation)
  const dispatch = useDispatch()
  const setPosition = (x: number, y: number) => dispatch(ViewportActions.setPosition([x, y]))
  const setScale = (scale: number) => dispatch(ViewportActions.setZoom(scale))
  const setRotation = (rotation: number) => dispatch(ViewportActions.setRotation(rotation))

  const gesture = useRef({
    active: false,
    scale: 1.0,
    rotation: 0
  }).current

  const touchStart = useRef({ x: 0, y: 0 }).current
  const canvasPosTouchStart = useRef({ x: 0, y: 0 }).current
  const zoomPos = useRef({ x: 0, y: 0 }).current
  const isZooming = useRef(false)
  const touchZoomStart = useRef(0)

  const handleTouchStart = (e: CustomTouchEvent) => {
    let [x, y] = getAbsoluteMouseCoords(e)
    touchStart.x = x
    touchStart.y = y
    canvasPosTouchStart.x = position[0]
    canvasPosTouchStart.y = position[1]
  }


  const getCanvasXformMatrix = () => {
    const transform = mat2d.identity(mat2d.create())
    mat2d.translate(transform, transform, [position[0], position[1]])
    mat2d.scale(transform, transform, [scale, scale])
    return transform
  }

  const viewportToCanvas = (x: number, y: number) => {
    let transform = getCanvasXformMatrix()
    mat2d.invert(transform, transform)
    let v2 = vec2.create()
    vec2.transformMat2d(v2, [x, y], transform)
    return { x: v2[0], y: v2[1] }
  }


  const updateZoom2 = (newScale: number, zoomPos: { x: number, y: number }) => {
    const rel = viewportToCanvas(zoomPos.x, zoomPos.y)
    // TODO set zoom
    setScale(newScale)

    const relZoomed = viewportToCanvas(zoomPos.x, zoomPos.y)
    canvasPosTouchStart.x += (relZoomed.x - rel.x) * scale
    canvasPosTouchStart.y += (relZoomed.y - rel.y) * scale
  }

  const handleTouchMove = (e: CustomTouchEvent) => {
    let [x, y] = getAbsoluteMouseCoords(e)
    overlayLog('scale: ' + (gesture.scale))

    if (e.touches && e.touches.length > 1) {
      if (gesture.active) {
        if (!isZooming.current) {
          isZooming.current = true;
          touchZoomStart.current = scale
          zoomPos.x = x
          zoomPos.y = y
        }
        updateZoom2(touchZoomStart.current * gesture.scale, touchStart)
      }
      setPosition(canvasPosTouchStart.x + (x - touchStart.x),
        canvasPosTouchStart.y + (y - touchStart.y))
    } else {
      touchZoomStart.current = scale
      isZooming.current = false
    }
  }

  const handleTouchEnd = (e: CustomTouchEvent) => {
    touchZoomStart.current = scale
    isZooming.current = false;
  }

  useEffect(() => {
    console.log('add event listener')
    Events.addListener('touchstart', (e: CustomTouchEvent) => handleTouchStart(e))
    Events.addListener('touchmove', (e: CustomTouchEvent) => handleTouchMove(e))
    Events.addListener('touchend', (e: CustomTouchEvent) => handleTouchEnd(e))
    Events.addListener('gesturestart', (e: CustomTouchEvent) => {
      gesture.active = true
      gesture.rotation = e.rotation || 0
      gesture.scale = e.scale || 0
    })
    Events.addListener('gesturechange', (e: CustomTouchEvent) => {
      overlayLog('gesture change')
      gesture.rotation = e.rotation || 0
      gesture.scale = e.scale || 0
    })
    Events.addListener('gestureend', (e: CustomTouchEvent) => {
      gesture.active = false
    })

    return () => {
      console.log('remove event listener')
      Events.addListener('touchstart', (e: CustomTouchEvent) => handleTouchStart(e))
      Events.addListener('touchmove', (e: CustomTouchEvent) => handleTouchMove(e))
      Events.addListener('touchend', (e: CustomTouchEvent) => handleTouchEnd(e))
    }
  }, [])

  useEffect(() => {
    console.log('need to update the viewport renderer')
  }, [position, scale, rotation])

  return <View>{children}</View>
}