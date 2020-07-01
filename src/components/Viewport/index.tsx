import { View, StyleSheet, Platform, GestureResponderEvent, StyleProp, ViewStyle } from "react-native"
import Theme from "../Theme"
import WebView from "react-native-webview"
import { useHtmlSource, useTouchEventHandler, CustomTouchEvent } from "./webview-hooks"
import { GLView } from "expo-gl"
import Graphics from "../../core/Graphics"
import { useNavigationResponder, useBoolRef } from "./hooks"
import { usePSR, usePSR2, useDocumentSize } from "./viewport-state"
import React, { useRef, useEffect } from "react"
import { overlayLog } from "../DebugOverlay"
import { useGlView, endFrame, clearToBackgroundColor } from "./gl-hooks"
import { getCheckerShader } from "../../core/Graphics/shaders"

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

export const Viewport2 = () => {
  const viewTransform = usePSR2()
  const [gesture, onTouchStart, onTouchMove, onTouchEnd] = useNavigationResponder(viewTransform)
  const [position, scale, rotation, setPosition, ,] = viewTransform
  const [width, height] = useDocumentSize()
  const [invokeTool, invalidateTool] = useToolState()


  const panResponderHandlers = {
    onStartShouldSetResponder: (e: GestureResponderEvent) => true,
    onMoveShouldSetResponder: (e: GestureResponderEvent) => true,
    onStartShouldSetResponderCapture: (e: GestureResponderEvent) => true,
    onMoveShouldSetResponderCapture: (e: GestureResponderEvent) => true,
    onResponderGrant: (event: GestureResponderEvent) => {
      onTouchStart(event)
    },
    onResponderMove: (event: GestureResponderEvent) => {
      onTouchMove(event)
      if (!gesture.active) {
        invokeTool(event.nativeEvent.pageX, event.nativeEvent.pageY)
      }
    },
    onResponderRelease: (event: GestureResponderEvent) => {
      onTouchEnd(event)
      invalidateTool()
    }
  }

  const resetPositionToCenter = () => {
    const gl = Graphics.getGL()
    const fullWidth = Theme.getFullWidth()
    const fullHeight = Theme.getFullHeight()
    const newPos: [number, number] = [fullWidth / 2 - width / 2, fullHeight / 2 - height / 2]
    setPosition([newPos[0], newPos[1]])
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
