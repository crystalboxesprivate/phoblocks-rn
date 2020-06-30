import React, { useState, useRef } from 'react'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';

import convert from 'color-convert'
import Graphics from '../../core/Graphics';
import Theme from '../Theme';
import { Color } from '../../core/Graphics/color';

// this has 2 one component
// two layers
// web view

export function endFrame() {
  const gl = Graphics.getGL() as ExpoWebGLRenderingContext
  // gl.flush();
  gl.endFrameEXP();
}

export function clearToBackgroundColor() {
  const col = convert.hex.rgb(Theme.bgColor.replace('#', '')).map(x => x / 255)
  Graphics.clearColor([...col, 1] as Color)
}


export function useGlView(onContextCreateCallback: (gl: ExpoWebGLRenderingContext) => void): [boolean, (gl: ExpoWebGLRenderingContext) => void] {
  const initialized = useRef(false)
  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    console.log('context create')
    if (initialized.current) { return }
    Graphics.setContext(gl)
    initialized.current = true

    onContextCreateCallback(gl)

  }
  return [initialized.current, onContextCreate]
}