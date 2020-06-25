import { View, Text, Animated, GestureResponderEvent, TouchableWithoutFeedback, PanResponder } from 'react-native'
import React, { useRef } from 'react'
import Theme from '../../../Theme'
import Svg, { Path } from 'react-native-svg'
import { styles } from './LayerViewStyles'
import Icon from '../../../Icon'

const previewBoxSize = 32

const useTouchPanResponder = (panResponderHandlers: PanResponderHandlers, touchFunc?: () => void) => {
  const dragging = useRef(false)
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      dragging.current = false
      panResponderHandlers.onPanResponderGrant(e)
      console.log('child pan responder invoked')
    },
    onPanResponderMove: (e) => {
      dragging.current = true
      panResponderHandlers.onPanResponderMove(e)
    },
    onPanResponderRelease: (e) => {
      if (dragging.current) {
        panResponderHandlers.onPanResponderRelease(e)
      } else {
        if (touchFunc) { touchFunc() }
      }
    }
  })).current
  return panResponder
}

export type PanResponderHandlers = {
  onPanResponderGrant: (e: GestureResponderEvent) => void;
  onPanResponderMove: (e: GestureResponderEvent) => void;
  onPanResponderRelease: (e: GestureResponderEvent) => void;
}

type PreviewBoxProps = {
  panResponderHandlers: PanResponderHandlers
  onPress?: () => void
  selected: boolean
  image?: object
}

export const PreviewBox = ({ onPress, selected, image, panResponderHandlers }: PreviewBoxProps) => {
  const panResponder = useTouchPanResponder(panResponderHandlers, onPress)
  return (
    <View {...panResponder.panHandlers} style={{
      width: previewBoxSize, height: previewBoxSize, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: selected ? '#508CE3' : '#C4C4C4',
      borderRadius: 2,
    }}>
      <View style={{ width: selected ? 26 : 30, height: selected ? 26 : 30, backgroundColor: 'white', borderRadius: selected ? 0 : 2 }}>
      </View>
    </View>
  )
}

export const GroupToggleButton = Animated.createAnimatedComponent(class extends React.Component<{ rotation: number }>{
  render() {
    return (<Svg width={8} height={6} viewBox="0 0 8 6" fill="none" style={{
      transform: [{ rotate: `${this.props.rotation}deg` }]
    }}><Path d="M8 0H0l4 6 4-6z" fill={Theme.separatorColor} /></Svg>)
  }
})

type ControlSideIconsProps = {
  onPress?: () => void
  panResponderHandlers: PanResponderHandlers
  isGroup: boolean
  layerHasClippingMaskEnabled: boolean
  isClosed: boolean
}

export const ControlSideIcons = ({ onPress, panResponderHandlers, isGroup, layerHasClippingMaskEnabled, isClosed }: ControlSideIconsProps) => {
  const clippingMask = layerHasClippingMaskEnabled && !isGroup
  const rotationValue = useRef(new Animated.Value(isClosed ? 1 : 0)).current
  const dragging = useRef(false)
  return (
    <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e) => {
        dragging.current = false
        panResponderHandlers.onPanResponderGrant(e)
      }}
      onResponderMove={(e) => {
        dragging.current = true
        panResponderHandlers.onPanResponderMove(e)
      }}
      onResponderRelease={(e) => {
        if (dragging.current) {
          panResponderHandlers.onPanResponderRelease(e)
        } else {
          if (isGroup && onPress) {
            onPress()
            Animated.timing(rotationValue, { toValue: isClosed ? 0 : 1, duration: 200 }).start()
          }
        }
      }}
      style={[styles.leftIcon, isGroup ? { minHeight: previewBoxSize } : {}, {
        alignSelf: isGroup ? 'center' : 'flex-end',
        justifyContent: isGroup ? 'center' : 'space-between'
      }]}>
      <View key='spacer' style={{ alignSelf: 'center' }} >
        {isGroup ?
          (<GroupToggleButton rotation={rotationValue.interpolate({ inputRange: [0, 1], outputRange: [-90, 0] })} />)
          : null}
      </View>
      {clippingMask ? (
        <View key='icon-hold' style={styles.iconHold}>
          <Icon name='clippingMask' fill={null} />
        </View>) : null}
    </View>
  )
}

export const LayerViewTitle = ({ visible, name }: { visible: boolean, name: string }) => (
  <Text style={[styles.layerTitle, { color: visible ? Theme.textBright0 : Theme.textDisabledLayer }]}>{name}</Text>)

type EyeButtonProps = {
  onPress?: () => void
  visible: boolean
  panResponderHandlers: PanResponderHandlers
}

export const EyeButton = ({ visible, onPress, panResponderHandlers }: EyeButtonProps) => {
  const panResponder = useTouchPanResponder(panResponderHandlers, onPress)
  return (
    <View {...panResponder.panHandlers} style={styles.eye} >{
      visible
        ? <Icon fill='#6B6B6B' name='eye' />
        : <Icon name='eyeCrossed' fill={null} />
    }</View>
  )
}
