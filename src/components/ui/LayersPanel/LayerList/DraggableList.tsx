import React, { useState, useEffect, useRef } from 'react'
import { View, LayoutRectangle, LayoutChangeEvent, Animated, TouchableWithoutFeedback } from 'react-native'
import { LayersScrollableList } from './LayersScrollableList'

const MeasureContainer = ({ onLayout, children }: { children: any, onLayout: (e: LayoutChangeEvent) => void }) => {
  return <View onLayout={onLayout}>{children}</View>
}

type DraggableElement = {
  rect: LayoutRectangle
  children: JSX.Element | JSX.Element[]
  totalElements: number
  totalHeight: number
  idx: number
  onListPositionChange: (listPosition: number, idx: number) => void
  animatedValue: Animated.Value
  margin: number
  dragStartDelay: number
}

const DraggableElement = ({ animatedValue, dragStartDelay, margin, idx, children, rect, totalHeight, totalElements, onListPositionChange, }: DraggableElement) => {
  const [selected, setSelected] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragStart = useRef({ timeoutId: -1, started: false, x: 0, y: 0 }).current
  const onHoldAnimation = useRef(new Animated.Value(0)).current

  const currentPosition = rect.y + offset.y
  const listPosition = currentPosition / totalHeight * totalElements

  useEffect(() => {
    if (selected) {
      onListPositionChange(((num: number) => {
        let f = Math.floor(num);
        return num - f < 0.5 ? f : f + 1
      })(listPosition), idx)
      Animated.timing(onHoldAnimation, { toValue: 1, duration: 200 }).start()
    }
  })

  const initializeDragging = () => {
    setSelected(true)
    dragStart.started = true
    onHoldAnimation.setValue(0)
    onListPositionChange(Math.floor(listPosition), idx)
  }

  return (<Animated.View
    style={[selected ? {
      width: rect.width,
      height: rect.height,
      position: 'absolute',
      top: onHoldAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [currentPosition, currentPosition - 4]
      }),
      opacity: onHoldAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }),
      zIndex: 500
    } : {
        marginTop: animatedValue.interpolate({
          inputRange: [0, 1], outputRange: [0, margin]
        })
      }]}
    // onStartShouldSetResponderCapture={(e: any) => { return true }}
    onStartShouldSetResponder={(_: any) => true}
    onResponderGrant={(e: any) => {
      dragStart.x = e.nativeEvent.pageX
      dragStart.y = e.nativeEvent.pageY
      setOffset({ x: 0, y: 0 })
      dragStart.timeoutId = setTimeout(initializeDragging, dragStartDelay)
    }}
    onResponderMove={(e: any) => {
      if (!dragStart.started) {
        dragStart.x = e.nativeEvent.pageX
        dragStart.y = e.nativeEvent.pageY
      }
      setOffset({ x: e.nativeEvent.pageX - dragStart.x, y: e.nativeEvent.pageY - dragStart.y })
    }}
    onResponderRelease={(_: any) => {
      onListPositionChange(-2, -2)
      setSelected(false)
      clearTimeout(dragStart.timeoutId)
    }}
  >
    <View>{children}</View>
  </Animated.View>)
}

type DraggableListProps = {
  children: JSX.Element[]
  dragStartDelay: number
  setChangeListOrder: (oldIndex: number, newIndex: number) => void
  isConstantBlockSize: boolean
}

export const DraggableList = ({ children, setChangeListOrder, dragStartDelay, isConstantBlockSize: constantBlockSize }: DraggableListProps) => {
  const [elementLayouts, _]: [LayoutRectangle[], any] = useState(new Array(children.length))
  const [firstPassFinished, setFirstPassFinished]: [boolean, any] = useState(false)
  const [retries, setRetries]: [number, any] = useState(0)
  const listStats = useRef({ totalHeight: 0, totalElements: children.length }).current
  const animatedValues: Animated.Value[] = useRef([]).current

  const [listPos, setListPos] = useState({ pos: -2, idx: -2 })

  const getNextIndex = (idx: number, pos: number) => {
    if (pos < idx) {
      return pos
    } else if (pos == idx) {
      return pos + 1
    }
    return pos + 1
  }

  const onListPositionChange = (newPosition: number, idx: number) => {
    if (newPosition != listPos.pos) {
      if (newPosition == -2 && idx == -2) {
        for (let x = 0; x < animatedValues.length; x++) {
          animatedValues[x].setValue(0)
        }
        setChangeListOrder(listPos.idx, listPos.pos)
      }

      setListPos({ pos: newPosition, idx: idx })
      if (listPos.idx == -2) {
        const next = getNextIndex(idx, newPosition)
        animatedValues[next]?.setValue(1)
      }
    }
  }

  const nextIndex = getNextIndex(listPos.idx, listPos.pos)

  useEffect(() => {
    if (!firstPassFinished) {
      for (let x = 0; x < children.length; x++) {
        if (!elementLayouts[x]) {
          setRetries(retries + 1)
          return
        }
      }
      listStats.totalHeight = 0
      for (let el of elementLayouts) {
        animatedValues.push(new Animated.Value(0))
        listStats.totalHeight += el.height
      }
      setFirstPassFinished(true)
    } else {
      for (let idx = 0; idx < animatedValues.length; idx++) {
        Animated.timing(animatedValues[idx], {
          toValue: idx == nextIndex ? 1 : 0, duration: 200
        }).start()
      }
    }
  })

  // first pass is to measure
  return (<View style={{ position: 'relative' }}>
    {children.map((x, idx) =>
      firstPassFinished
        ? (<DraggableElement
          dragStartDelay={dragStartDelay}
          idx={idx}
          key={`el-${idx}`}
          animatedValue={animatedValues[idx]}
          margin={elementLayouts[listPos.idx == -2 ? idx : listPos.idx].height}
          onListPositionChange={onListPositionChange}
          rect={elementLayouts[idx]} {...listStats}>
          {x}
        </DraggableElement>)
        : (<MeasureContainer
          key={`el-${idx}`}
          onLayout={(e: LayoutChangeEvent) => {
            elementLayouts[idx] = e.nativeEvent.layout
          }}>
          {x}
        </MeasureContainer>))
    }
  </View >)
}
