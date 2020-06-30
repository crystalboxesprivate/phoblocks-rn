import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, GestureResponderEvent, Platform, PlatformIOSStatic } from 'react-native'
import Theme from '../Theme'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { overlayLog } from '../DebugOverlay';

import {
  CustomTouch,
  CustomTouchEvent,
  useTouchEventHandler,
  useHtmlSource
} from './webview-hooks'
import { GLView } from 'expo-gl';
import { useGlView, clearToBackgroundColor, endFrame } from './gl-hooks';
import Graphics from '../../core/Graphics';
import { styles } from './viewport-styles';
import { useSelector, useDispatch } from 'react-redux';
import { PhoblocksState } from '../../core/application/redux';
import { ViewportActions } from '../../core/application/redux/ui/viewport';
import { useViewportState, useViewportState2, useDocumentSize } from './viewport-state';
import { useViewportNavigation, useBoolRef } from './viewport-hooks';


export const Viewport2 = () => {
  const htmlSource = useHtmlSource()

  const [position, scale, rotation,
    setPosition,
    setScale,
    setRotation
  ] = useViewportState2()

  const [width, height] = useDocumentSize()


  const [onTouchStart, onTouchMove, onTouchEnd,
    onGestureStart, onGestureChange, onGestureEnd] = useViewportNavigation(
      position,
      scale,
      setPosition,
      setScale,
      () => { }
    )

  const [nativeViewProps, webViewProps] = useTouchEventHandler((e: CustomTouchEvent) => {
    if (e.touches) {
      for (let i = 0; i < e.touches.length; i++) {
        e.touches[i].pageX *= Graphics.getWidth()
        e.touches[i].pageY *= Graphics.getHeight()
      }
    }
    if (e.type === 'touchstart') { onTouchStart(e) }
    if (e.type === 'touchmove') { onTouchMove(e) }
    if (e.type === 'touchend') { onTouchEnd(e) }
    if (e.type === 'gesturestart') { onGestureStart(e) }
    if (e.type === 'gesturechange') { onGestureChange(e) }
    if (e.type === 'gestureend') { onGestureEnd(e) }
  })


  const resetPositionToCenter = () => {
    const gl = Graphics.getGL()
    const fullWidth = gl.drawingBufferWidth
    const fullHeight = gl.drawingBufferHeight
    overlayLog('fullWidth: ' + fullWidth)
    overlayLog('fullHeight: ' + fullHeight)
    overlayLog('Them width: ' + Theme.getFullWidth())
    overlayLog('Them height: ' + Theme.getFullHeight())
    const newPos: [number, number] = [fullWidth / 2 - width / 2, fullHeight / 2 - height / 2]
    setPosition(newPos[0], newPos[1])
  }

  const [initialized, onGlContextCreate] = useGlView(_ => {
    resetPositionToCenter()
    drawViewport()
  })

  useEffect(() => {
    if (initialized) {
      drawViewport()
    }
  }, [position, scale, rotation])

  const drawViewport = async () => {
    return
    Graphics.setViewport()
    clearToBackgroundColor()

    Graphics.drawRect(position[0], position[1], width * scale, height * scale, 255)
    endFrame()
  }


  return (<View style={styles.viewport}>
    <GLView style={styles.glView} onContextCreate={onGlContextCreate} />
    {
      Platform.OS === 'web' || htmlSource.length === 0
        ? (<View {...nativeViewProps} style={styles.fullSize} />)
        : (<WebView
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => { }}
          {...webViewProps}
          style={styles.webView}
          source={{ html: htmlSource }} />)
    }
  </View>)
}

