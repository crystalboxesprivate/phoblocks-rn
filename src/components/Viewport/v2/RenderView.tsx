import React from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import Theme from '../../Theme'
import { useSelector } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import { useDocumentSize } from './viewport-state'

export const RenderView = () => {
  const position = useSelector((state: PhoblocksState) => state.ui.viewport.position)
  const scale = useSelector((state: PhoblocksState) => state.ui.viewport.scale)
  const rotation = useSelector((state: PhoblocksState) => state.ui.viewport.rotation)
  const [width, height] = useDocumentSize()

  const getViewStyle = (): StyleProp<ViewStyle> => ({
    position: 'absolute',
    backgroundColor: 'white',
    width: width * scale,
    height: height * scale,
    left: position[0],
    top: position[1],
    transform: [{ rotate: `${rotation}deg` }]
  })
  return <View style={{ zIndex: -1, position: 'relative', left: 0, top: 0, width: Theme.getFullWidth(), height: Theme.getFullHeight() }}>
    <View style={getViewStyle()} />
  </View>
}