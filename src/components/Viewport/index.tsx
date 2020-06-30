import { View, StyleSheet, Platform, GestureResponderEvent, StyleProp, ViewStyle } from "react-native"
import Theme from "../Theme"
import WebView from "react-native-webview"
import { useHtmlSource, useTouchEventHandler, CustomTouchEvent } from "./webview-hooks"
import { GLView } from "expo-gl"
import Graphics from "../../core/Graphics"
import { useNavigationResponder } from "./hooks"
import { usePSR, usePSR2, useDocumentSize } from "./viewport-state"
import React, { useRef, useEffect } from "react"
import { overlayLog } from "../DebugOverlay"
import { useGlView, endFrame, clearToBackgroundColor } from "./gl-hooks"

export const Viewport2 = () => {
  const htmlSource = useHtmlSource()
  const viewTransform = usePSR2()
  const [onTouchStart, onTouchMove, onTouchEnd] = useNavigationResponder(viewTransform)
  const [position, scale, rotation, setPosition, ,] = viewTransform
  const [width, height] = useDocumentSize()
  const penForce = useRef(1)
  const [, webViewProps] = useTouchEventHandler((e: CustomTouchEvent) => {
    if (e.touches) {
      for (let i = 0; i < e.touches.length; i++) {
        penForce.current = e.touches[i].force || 1
      }
    }
  })

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
    },
    onResponderRelease: (event: GestureResponderEvent) => {
      onTouchEnd(event)
    }
  }

  const resetPositionToCenter = () => {
    const gl = Graphics.getGL()
    const fullWidth = gl.drawingBufferWidth
    const fullHeight = gl.drawingBufferHeight
    overlayLog('fullWidth: ' + fullWidth)
    overlayLog('fullHeight: ' + fullHeight)
    overlayLog('Them width: ' + Theme.getFullWidth())
    overlayLog('Them height: ' + Theme.getFullHeight())
    const newPos: [number, number] = [fullWidth / 2 - width / 2, fullHeight / 2 - height / 2]
    setPosition([newPos[0], newPos[1]])
  }

  const [initialized, onGlContextCreate] = useGlView(_ => {
    resetPositionToCenter()
    Graphics.clearColor(22)
    Graphics.drawRect(20, 20, 100, 100, [0.2, 0.3, 0.1, 1])
    endFrame()
  })


  const getViewStyle = (): StyleProp<ViewStyle> => ({
    position: 'absolute',
    width: width * (scale || 1),
    height: height * (scale || 1),
    left: position[0],
    top: position[1],
  })


  return <View style={{
    position: 'absolute',

    width: Theme.getFullWidth(),
    height: Theme.getFullHeight(),
  }}
    {...panResponderHandlers}
  >
    <GLView style={getViewStyle()} onContextCreate={onGlContextCreate} />
  </View>
}


export const styles = StyleSheet.create({
  webView2: {
    backgroundColor: 'rgba(255,255,255,0.0)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: Theme.getFullWidth(),
    height: Theme.getFullHeight(),
    zIndex: 5
  }
})
