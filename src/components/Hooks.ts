import { LayoutRectangle, LayoutChangeEvent, GestureResponderEvent } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

type LayoutChangeCallback = (e: LayoutChangeEvent) => void

export const useEventLocalPosition = (): [
  (e: GestureResponderEvent) => [number, number],
  (e: GestureResponderEvent) => void
] => {
  const globalOffset = useRef([-1, -1]).current
  const onResponderGrant = (e: GestureResponderEvent) => {
    globalOffset[0] = e.nativeEvent.pageX - e.nativeEvent.locationX
    globalOffset[1] = e.nativeEvent.pageY - e.nativeEvent.locationY
  }

  const getLocalPosition = (e: GestureResponderEvent): [number, number]=> {
    return [e.nativeEvent.pageX - globalOffset[0],
    e.nativeEvent.pageY - globalOffset[1]]
  }

  return [
    getLocalPosition,
    onResponderGrant
  ]
}

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
