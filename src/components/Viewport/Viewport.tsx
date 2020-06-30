import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch, connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { Events } from '../../core/events'
import { CustomTouchEvent } from '../TouchEventLoader'
import { mat2d, vec2 } from 'gl-matrix'
import { overlayLog, setOverlayMessage } from '../DebugOverlay'
import { ViewportActions } from '../../core/application/redux/ui/viewport'
import { RenderView } from './RenderView'
import Theme from '../Theme'


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


type ViewportProps = {
  position: [number, number]
  scale: number,
  rotation: number,
  width: number,
  height: number

  setPosition: (pos: [number, number]) => void
  setScale: (scale: number) => void
}

export type ViewportRenderState = {
  position: [number, number]
  scale: number,
  rotation: number
}

type Gesture = {
  scale: number, rotation: number, active: boolean
}

type Vector2D = {
  x: number, y: number
}

export
  const Viewport = connect((state: PhoblocksState) => ({
    position: state.ui.viewport.position,
    scale: state.ui.viewport.scale,
    rotation: state.ui.viewport.rotation,
    width: state.document.dimensions.width,
    height: state.document.dimensions.height,
  }), { setScale: ViewportActions.setZoom, setPosition: ViewportActions.setPosition, setRotation: ViewportActions.setRotation })(
    class Viewport extends React.Component<ViewportProps, ViewportRenderState>  {
      gesture: Gesture
      isZooming = false

      touchStart: Vector2D = { x: 0, y: 0 }
      canvasPosTouchStart: Vector2D = { x: 0, y: 0 }
      zoomPos: Vector2D | null = null
      touchZoomStart = 1

      isViewerChanged = false

      constructor(props: ViewportProps) {
        super(props)
        this.gesture = { active: false, scale: 1, rotation: 0 }
        this.state = { position: this.props.position, scale: this.props.scale, rotation: this.props.rotation }
      }

      getCanvasXformMatrix() {
        const transform = mat2d.identity(mat2d.create())
        mat2d.translate(transform, transform, this.props.position)
        mat2d.scale(transform, transform, [this.props.scale, this.props.scale])
        return transform
      }

      viewportToCanvas(x: number, y: number) {
        let transform = this.getCanvasXformMatrix()
        mat2d.invert(transform, transform)
        let v2 = vec2.create()
        vec2.transformMat2d(v2, [x, y], transform)
        return { x: v2[0], y: v2[1] }
      }


      handleTouchStart(e: CustomTouchEvent) {
        let [x, y] = getAbsoluteMouseCoords(e)
        this.touchStart = { x: x, y: y }
        this.canvasPosTouchStart = { x: this.props.position[0], y: this.props.position[1] }
      }

      updateZoom2(newScale: number, zoomPos: Vector2D) {
        const rel = this.viewportToCanvas(zoomPos.x, zoomPos.y)
        this.setScale(newScale)
        const relZoomed = this.viewportToCanvas(zoomPos.x, zoomPos.y)
        this.canvasPosTouchStart.x += (relZoomed.x - rel.x) * newScale
        this.canvasPosTouchStart.y += (relZoomed.y - rel.y) * newScale
      }

      setPos(x: number, y: number) { this.setState({ position: [x, y] }) }
      setScale(x: number) { this.setState({ scale: x }) }

      handleTouchMove(e: CustomTouchEvent) {
        let [x, y] = getAbsoluteMouseCoords(e)

        if (e.touches && e.touches.length > 1) {
          if (this.gesture.active) {
            if (!this.isZooming) {
              this.isZooming = true;
              this.zoomPos = { x: x, y: y }
              this.touchZoomStart = this.props.scale
            }
            this.updateZoom2(this.touchZoomStart * this.gesture.scale, this.touchStart)
          }

          this.setPos(
            this.canvasPosTouchStart.x + (x - this.touchStart.x),
            this.canvasPosTouchStart.y + (y - this.touchStart.y))

          this.repaint()
          // this.invalidateTool()
        } else {
          this.touchZoomStart = this.props.scale
          this.isZooming = false;
          // this.invokeTool(x, y)
          // this.repaint()
        }
      }

      handleTouchEnd(e: CustomTouchEvent) {
        if (this.isViewerChanged) {
          this.props.setPosition(this.state.position)
          this.props.setScale(this.state.scale)
          this.isViewerChanged = false
        }
        this.touchZoomStart = this.props.scale
        this.isZooming = false;
        this.repaint()
      }

      repaint() {
        Events.invoke('ON_VIEWPORT_REPAINT', {
          position: this.state.position,
          scale: this.state.scale,
          rotation: this.state.rotation
        })
      }

      componentDidUpdate() {
        overlayLog('did update')
        if (this.props.rotation != this.state.rotation ||
          this.props.scale != this.state.scale ||
          this.props.position[0] != this.state.position[0] ||
          this.props.position[1] != this.state.position[1]) {
          // this.state.position[0] = this.props.position[0]
          // this.state.position[1] = this.props.position[1]
          // // @ts-ignore
          // this.state.rotation = this.props.rotation
          // // @ts-ignore
          // this.state.scale = this.props.scale
          this.repaint()
        }
      }

      onContextInitialzed = (gl: WebGL2RenderingContext) => {
        const fullWidth = gl.drawingBufferWidth
        const fullHeight = gl.drawingBufferHeight

        console.log({ fullWidth, fullHeight })
        const newPos: [number, number] = [fullWidth / 2 - this.props.width / 2, fullHeight / 2 - this.props.height / 2]
        this.props.setPosition(newPos)
        this.repaint()
      }

      componentDidMount() {
        Events.addListener('touchstart', (e: CustomTouchEvent) => this.handleTouchStart(e))
        Events.addListener('touchmove', (e: CustomTouchEvent) => this.handleTouchMove(e))
        Events.addListener('touchend', (e: CustomTouchEvent) => this.handleTouchEnd(e))

        Events.addListener('gesturestart', (e: CustomTouchEvent) => this.onGestureStart(e))
        Events.addListener('gesturechange', (e: CustomTouchEvent) => this.onGestureChange(e))
        Events.addListener('gestureend', (e: CustomTouchEvent) => this.onGestureEnd(e))

        Events.addListener('ON_CONTEXT_INITIALIZED', (gl: WebGL2RenderingContext) => this.onContextInitialzed(gl))

      }

      componentWillUnmount() {
        Events.removeListener('touchstart', (e: CustomTouchEvent) => this.handleTouchStart(e))
        Events.removeListener('touchmove', (e: CustomTouchEvent) => this.handleTouchMove(e))
        Events.removeListener('touchend', (e: CustomTouchEvent) => this.handleTouchEnd(e))

        Events.removeListener('gesturestart', (e: CustomTouchEvent) => this.onGestureStart(e))
        Events.removeListener('gesturechange', (e: CustomTouchEvent) => this.onGestureChange(e))
        Events.removeListener('gestureend', (e: CustomTouchEvent) => this.onGestureEnd(e))
        Events.removeListener('ON_CONTEXT_INITIALIZED', (gl: WebGL2RenderingContext) => this.onContextInitialzed(gl))
      }

      onGestureStart = (e: CustomTouchEvent) => {
        this.gesture.active = true
        this.gesture.rotation = e.rotation || 0
        this.gesture.scale = e.scale || 0
      }
      onGestureChange = (e: CustomTouchEvent) => {
        this.gesture.rotation = e.rotation || 0
        this.gesture.scale = e.scale || 0
      }
      onGestureEnd = (e: CustomTouchEvent) => {
        this.gesture.active = false
      }
      render() { return <View><RenderView /></View> }
    }
  )
