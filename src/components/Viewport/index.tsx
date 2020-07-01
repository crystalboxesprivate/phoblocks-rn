import { View, StyleSheet, Platform, GestureResponderEvent, StyleProp, ViewStyle } from "react-native"
import Theme from "../Theme"
import { GLView } from "expo-gl"
import Graphics from "../../core/Graphics"
import { useNavigationResponder as useTouchNavigationResponder, useBoolRef, ViewTransform, useVectorRef, Vector2D } from "./hooks"
import { usePSR, usePSR2, useDocumentSize } from "./viewport-state"
import React, { useRef, useEffect } from "react"
import { overlayLog } from "../DebugOverlay"
import { useGlView, endFrame, clearToBackgroundColor } from "./gl-hooks"
import { getCheckerShader } from "../../core/Graphics/shaders"
import { modifiers } from "../../user-input-desktop"
import { mat2d, vec2 } from "gl-matrix"

const useToolState = (): [(x: number, y: number) => void, () => void] => {
  const [isActive, setIsActive] = useBoolRef(false)
  const invokeTool = (x: number, y: number) => {
    if (!isActive) {
      setIsActive(true)
    }
  }
  const invalidateTool = () => {
    if (!isActive) { return }
    setIsActive(false)
  }
  return [invokeTool, invalidateTool]
}

type ResponderHandlers = {
  onStartShouldSetResponder: (e: GestureResponderEvent) => boolean;
  onMoveShouldSetResponder: (e: GestureResponderEvent) => boolean;
  onStartShouldSetResponderCapture: (e: GestureResponderEvent) => boolean;
  onMoveShouldSetResponderCapture: (e: GestureResponderEvent) => boolean;
  onResponderGrant: (event: GestureResponderEvent) => void;
  onResponderMove: (event: GestureResponderEvent) => void;
  onResponderRelease: (event: GestureResponderEvent) => void;
}

function useResponderHandlers(onTouchStart: (e: GestureResponderEvent) => void, onTouchMove: (e: GestureResponderEvent) => void, onTouchEnd: (e: GestureResponderEvent) => void): ResponderHandlers {
  return {
    onStartShouldSetResponder: (e: GestureResponderEvent) => true,
    onMoveShouldSetResponder: (e: GestureResponderEvent) => true,
    onStartShouldSetResponderCapture: (e: GestureResponderEvent) => true,
    onMoveShouldSetResponderCapture: (e: GestureResponderEvent) => true,
    onResponderGrant: (event: GestureResponderEvent) => {
      onTouchStart(event)
    },
    onResponderMove: (event: GestureResponderEvent) => {
      onTouchMove(event)
    },
    onResponderRelease: (event: GestureResponderEvent) => {
      onTouchEnd(event)
    }
  }
}

function useDesktopNavigation(viewTransform: ViewTransform): [(event: GestureResponderEvent) => void, (event: GestureResponderEvent) => void, (event: GestureResponderEvent) => void] {
  const [position, scale, rotation, setPosition, setScale, setRotation] = viewTransform

  const [lmb, setLmb] = useBoolRef(false)
  const spaceDown = () => modifiers.get('Space') === 1
  const controlDown = () => modifiers.get('ControlLeft') === 1
  const [mousePrevious, setMousePrevious] = useVectorRef(0, 0)
  const [isZooming, setIsZooming] = useBoolRef(false)
  const [zoomPos, setZoomPos] = useVectorRef(0, 0)
  const zoomIncrement = 0.01




  const onMouseDown = (event: GestureResponderEvent) => {
    const [x, y] = [event.nativeEvent.pageX, event.nativeEvent.pageY]
    setMousePrevious(x, y)
    overlayLog('true')
    overlayLog('' + spaceDown())
    setLmb(true)
  }

  const onMouseUp = (event: GestureResponderEvent) => {
    const [x, y] = [event.nativeEvent.pageX, event.nativeEvent.pageY]
    setMousePrevious(x, y)
    setLmb(false)
  }

  const viewportToCanvas = (x: number, y: number, withScale: number) => {
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

  const updateZoom = (newScale: number) => {
    if (Math.abs(scale - newScale) < 0.001) {
      return
    }
    const rel = viewportToCanvas(zoomPos.x, zoomPos.y, scale)
    const relZoomed = viewportToCanvas(zoomPos.x, zoomPos.y, newScale)
    console.log({
      old: { scale, rel },
      new: { newScale, relZoomed }
    })
    setPosition([
      position[0] + (relZoomed.x - rel.x) * newScale,
      position[1] + (relZoomed.y - rel.y) * newScale
    ])
    setScale(newScale)
  }

  const onMouseMove = (event: GestureResponderEvent) => {
    const [x, y] = [event.nativeEvent.pageX, event.nativeEvent.pageY]
    const p = { x: mousePrevious.x, y: mousePrevious.y }
    setMousePrevious(x, y)
    if (lmb && spaceDown()) {

      let delta = [x - p.x, y - p.y]

      if (controlDown()) {
        if (!isZooming.current) {
          setIsZooming(true)
          setZoomPos(x, y)
        }
        var zoom = Math.exp(-delta[1] * zoomIncrement);
        updateZoom(scale * zoom)
      } else {
        setPosition(
          [
            position[0] + delta[0],
            position[1] + delta[1],
          ]
        )
      }
    }
  }
  return [onMouseDown, onMouseMove, onMouseUp]
}

export const Viewport2 = () => {
  const viewTransform = usePSR2()
  const [gesture, onTouchNavigationStart, onTouchNavigationMove, onTouchNavigationEnd] = useTouchNavigationResponder(viewTransform)
  const [onMouseDown, onMouseMove, onMouseUp] = useDesktopNavigation(viewTransform)
  const [position, scale, rotation, setPosition, ,] = viewTransform
  const [width, height] = useDocumentSize()
  const [invokeTool, invalidateTool] = useToolState()

  const panResponderHandlers = useResponderHandlers((event) => {
    onTouchNavigationStart(event)
    onMouseDown(event)
  }, (event) => {
    onTouchNavigationMove(event)
    if (!gesture.active) {
      invokeTool(event.nativeEvent.pageX, event.nativeEvent.pageY)
    }
    onMouseMove(event)
  }, (event) => {
    onTouchNavigationEnd(event)
    invalidateTool()
    onMouseUp(event)
  })

  const resetPositionToCenter = () => {
    setPosition([
      Theme.getFullWidth() / 2 - width / 2,
      Theme.getFullHeight() / 2 - height / 2
    ])
  }

  const [initialized, onGlContextCreate] = useGlView(_ => {
    resetPositionToCenter()
    const shader = getCheckerShader()
    Graphics.clearColor(1)
    shader.setVector('aspect', [Graphics.getWidth() / Graphics.getHeight(), 1 / scale, 0])
    Graphics.drawRect(0, 0, Graphics.getWidth(), Graphics.getHeight(), [0.5, 0.5, 0.5, 1], shader)

    Graphics.drawCircle(50, 50, 50, 0.50)
    endFrame()
  })

  // useEffect(() => {
  //   if (initialized) {
  //     const shader = getCheckerShader()
  //     Graphics.clearColor(1)
  //     shader.setVector('aspect', [Graphics.getWidth() / Graphics.getHeight(), 1 / scale, 0])
  //     Graphics.drawRect(0, 0, Graphics.getWidth(), Graphics.getHeight(), [0.5, 0.5, 0.5, 1], shader)
  //     endFrame()
  //   }
  // }, [position, scale, rotation])


  const getViewStyle = (): StyleProp<ViewStyle> => ({
    position: 'absolute',
    width: width * (scale || 1),
    height: height * (scale || 1),
    left: position[0],
    top: position[1],
  })

  return <View style={styles.container} {...panResponderHandlers}>
    <GLView style={getViewStyle()} onContextCreate={onGlContextCreate} />
  </View>
}


export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Theme.getFullWidth(),
    height: Theme.getFullHeight(),
  }
})
