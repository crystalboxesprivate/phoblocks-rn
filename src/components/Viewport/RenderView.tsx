import React, { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl'

import convert from 'color-convert'
import Theme from '../Theme'
import { overlayLog } from '../DebugOverlay'
import { Events } from '../../core/events'
import Graphics from '../../core/Graphics'
import { Color } from '../../core/Graphics/color'
import { useSelector } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { Framebuffer } from '../../core/Graphics/framebuffer'
import { ViewportRenderState } from './Viewport'

function endFrame() {
  const gl = Graphics.getGL() as ExpoWebGLRenderingContext
  gl.flush();
  gl.endFrameEXP();
}

function clearToBackgroundColor() {
  const col = convert.hex.rgb(Theme.bgColor.replace('#', '')).map(x => x / 255)
  Graphics.clearColor([...col, 1] as Color)
}


let fbo: Framebuffer | null = null

export const RenderView = () => {
  const width = useSelector((state: PhoblocksState) => state.document.dimensions.width)
  const height = useSelector((state: PhoblocksState) => state.document.dimensions.height)

  const viewportState = useRef({ position: [0, 0], scale: 1.0, rotation: 0 } as ViewportRenderState).current

  const initialized = useRef(false)

  const onViewportUpdate = (data?: ViewportRenderState) => {
    if (data) {
      viewportState.position = data.position
      viewportState.scale = data.scale
      viewportState.rotation = data.rotation
    }


    Graphics.setViewport()
    clearToBackgroundColor()

    // draw the document scale
    const { position, scale, rotation } = viewportState
    overlayLog('on viewport update ' + scale)

    Graphics.drawRect(position[0], position[1], width * scale, height * scale, 255)
    endFrame()
  }

  const allocateFramebuffer = () => {
    if (fbo) { fbo.release() }
    fbo = new Framebuffer()
    fbo.allocate(width, height)
  }

  // Handle scaling
  useEffect(() => {
    if (Graphics.getGL()) { allocateFramebuffer() }
  }, [width, height])

  useEffect(() => {
    Events.addListener('ON_VIEWPORT_REPAINT', onViewportUpdate)
    return () => {
      Events.removeListener('ON_VIEWPORT_REPAINT', onViewportUpdate)
    }
  }, [])

  return (
    <GLView
      style={styles.container}
      onContextCreate={_gl => {
        if (initialized.current) {
          overlayLog('this is already initialized')
          return;
        }

        Graphics.setContext(_gl)
        initialized.current = true;
        Events.invoke('ON_CONTEXT_INITIALIZED', _gl)
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    width: Theme.getFullWidth(),
    height: Theme.getFullHeight()
  }
});
