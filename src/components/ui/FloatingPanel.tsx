import { Events } from "../../core/events"
import React, {
  useRef,
  useState,
  useEffect
} from 'react'

import { View } from 'react-native'

enum FloatingPanelEvent {
  AddId = 'addFloatingPanelId',
  RemoveId = 'removeFloatingPanelIds'
}

export const FloatingPanelManager = () => {
  const children: React.MutableRefObject<React.MutableRefObject<FloatingPanelId>[]> = useRef([])
  const [state, setState] = useState(false)
  const addFloatingPanelId = (a: any) => {
    if (children.current.indexOf(a) == -1) {
      children.current.push(a)
    }
    setState(!state)
  }
  const removeFloatingPanelId = (a: any) => {
    children.current.splice(children.current.indexOf(a), 1)
    setState(!state)
  }


  useEffect(() => {
    Events.addListener(FloatingPanelEvent.AddId, addFloatingPanelId)
    Events.addListener(FloatingPanelEvent.RemoveId, removeFloatingPanelId)
    return () => {
      Events.removeListener(FloatingPanelEvent.AddId, addFloatingPanelId)
      Events.removeListener(FloatingPanelEvent.RemoveId, removeFloatingPanelId)
    }
  })

  return (
    <View style={{
      position: 'absolute', top: 0, left: 0,
      zIndex: 150,
    }}>
      {children.current.map((x, idx) => <View key={`floating_${idx}`}>{x.current.children}</View>)}
    </View>
  )
}

type FloatingPanelId = {
  children: JSX.Element | JSX.Element[] | null
}


export const useFloatingPanel = (): [React.MutableRefObject<FloatingPanelId>, () => void] => {
  const ref = useRef({ children: null })
  const cleanup = () => {
    Events.invoke(FloatingPanelEvent.RemoveId, ref)
  }
  return [ref, cleanup]
}


type FloatingPanelProps = {
  children: JSX.Element | JSX.Element[]
  id: React.MutableRefObject<FloatingPanelId>
  visible: boolean
}


export const FloatingPanel = ({ children, visible, id }: FloatingPanelProps) => {
  id.current.children = children
  if (visible) {
    Events.invoke(FloatingPanelEvent.AddId, id)
  } else {
    Events.invoke(FloatingPanelEvent.RemoveId, id)
  }


  return null
}