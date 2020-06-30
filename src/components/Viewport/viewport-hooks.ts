import { CustomTouchEvent } from "./webview-hooks"
import { useRef } from "react"
import { mat2d, vec2 } from 'gl-matrix'
import { overlayLog } from "../DebugOverlay"

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


type Vector2D = {
  x: number, y: number
}

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


type Gesture = {
  scale: number, rotation: number, active: boolean
}


export const useViewportNavigation = (
  position: [number, number], scale: number,
  setPosition: (x: number, y: number) => void,
  setScale: (scale: number) => void,
  onRepaint: () => void
) => {
  const [touchStart, setTouchStart] = useVectorRef(0, 0)
  const [canvasPosTouchStart, setCanvasPosTouchStart] = useVectorRef(0, 0)
  const gesture = useRef({ scale: 1, rotation: 0, active: false } as Gesture).current
  const [isZooming, setIsZooming] = useBoolRef(false)
  const [zoomPos, setZoomPos] = useVectorRef(0, 0)
  const [touchZoomStart, setTouchZoomStart] = useScalarRef(1)

  const getCanvasXformMatrix = () => {
    const transform = mat2d.identity(mat2d.create())
    mat2d.translate(transform, transform, position)
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

  const updateZoom2 = (newScale: number, zoomPos: Vector2D) => {
    const rel = viewportToCanvas(zoomPos.x, zoomPos.y)
    if (newScale < 0.01) { newScale = 0.01 }
    setScale(newScale)
    scale = newScale
    const relZoomed = viewportToCanvas(zoomPos.x, zoomPos.y)
    setCanvasPosTouchStart(
      canvasPosTouchStart.x + (relZoomed.x - rel.x) * newScale,
      canvasPosTouchStart.y + (relZoomed.y - rel.y) * newScale
    )
  }

  const handleTouchStart = (e: CustomTouchEvent) => {
    let [x, y] = getAbsoluteMouseCoords(e)
    setTouchStart(x, y)
    setCanvasPosTouchStart(position[0], position[1])
  }

  const handleTouchMove = (e: CustomTouchEvent) => {
    let [x, y] = getAbsoluteMouseCoords(e)

    if (e.touches && e.touches.length > 1) {
      if (gesture.active) {
        if (!isZooming.current) {
          setIsZooming(true)
          setZoomPos(x, y)
          setTouchZoomStart(scale)
        }
        updateZoom2(touchZoomStart.current * gesture.scale, touchStart)
      }

      setPosition(
        canvasPosTouchStart.x + (x - touchStart.x),
        canvasPosTouchStart.y + (y - touchStart.y))
      onRepaint()

      // this.repaint()
      // this.invalidateTool()
    } else {
      setTouchZoomStart(scale)
      setIsZooming(false)
      // this.invokeTool(x, y)
      // this.repaint()
      onRepaint()
    }
  }


  const handleTouchEnd = (e: CustomTouchEvent) => {
    setTouchZoomStart(scale)
    setIsZooming(false)
    onRepaint()
    // this.repaint()
  }

  const handleGestureStart = (e: CustomTouchEvent) => {
    gesture.active = true
    gesture.scale = e.scale || 1
    gesture.rotation = e.rotation || 0
  }
  const handleGestureChange = (e: CustomTouchEvent) => {
    gesture.scale = e.scale || 1
    gesture.rotation = e.rotation || 0
  }
  const handleGestureEnd = (e: CustomTouchEvent) => {
    gesture.active = false
    gesture.scale = 1
    gesture.rotation = 0
  }

  return [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleGestureStart,
    handleGestureChange,
    handleGestureEnd
  ]
}