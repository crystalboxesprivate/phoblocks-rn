import { LayoutRectangle, LayoutChangeEvent } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

type LayoutChangeCallback = (e: LayoutChangeEvent) => void

export const useLayout = (): [LayoutRectangle | null, LayoutChangeCallback] => {
  const [layout, setLayout]: [LayoutRectangle | null, any] = useState(null)

  const onLayout: LayoutChangeCallback = (e: LayoutChangeEvent) => {
    if (layout == null) {
      setLayout(e.nativeEvent.layout)
    }
  }
  return [layout, onLayout]
}

export const useGlobalPositionLayout = (): [LayoutRectangle | null, React.MutableRefObject<any>] => {
  const [layout, setLayout]: [LayoutRectangle | null, any] = useState(null)
  let canSetLayout = true
  const ref: React.MutableRefObject<any> = useRef(null)

  useEffect(() => {
    if (layout == null) {
      if (ref) {
        ref.current.measure((_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
          if (canSetLayout) {
            setLayout({ x: pageX, y: pageY, width, height })
          }
        })
      }
    }
    return () => {
      canSetLayout = false
    }
  })
  return [layout, ref]
}
