import { View, Text, Animated, GestureResponderEvent, TouchableWithoutFeedback, PanResponder, PanResponderInstance } from 'react-native'
import React, { useRef } from 'react'
import Theme from '../../../Theme'
import Svg, { Path } from 'react-native-svg'
import { styles } from './LayerViewStyles'
import Icon from '../../../Icon'

const previewBoxSize = 32
export const holdDelay = 300

export type TouchState = {
  isDown: boolean
  dragging: boolean
  holding: boolean
  timeOut: undefined | number
}

const useTouchPanResponder = (panResponderHandlers: PanResponderHandlers, touchFunc?: () => void): [PanResponderInstance, TouchState] => {
  const touchState: TouchState = useRef({ isDown: false, dragging: false, holding: false, timeOut: undefined }).current
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      touchState.isDown = true
      touchState.dragging = false
      touchState.holding = false
      touchState.timeOut = setTimeout(() => touchState.holding = true, holdDelay)
      panResponderHandlers.onPanResponderGrant(e)
      console.log('child pan responder invoked')
    },
    onPanResponderMove: (e) => {
      if (touchState.isDown) {
        touchState.dragging = true
        clearTimeout(touchState.timeOut)
        panResponderHandlers.onPanResponderMove(e)
      }
    },
    onPanResponderRelease: (e) => {
      if (touchState.dragging || touchState.holding) {
        panResponderHandlers.onPanResponderRelease(e)
      } else {
        if (touchFunc) { touchFunc() }
      }
      touchState.isDown = false
    }
  })).current
  return [panResponder, touchState]
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
  const [panResponder, _] = useTouchPanResponder(panResponderHandlers, onPress)
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
  const [panResponder, touchState] = useTouchPanResponder(panResponderHandlers)

  const touchFunc = () => {
    if (isGroup && onPress) {
      onPress()
      Animated.timing(rotationValue, { toValue: isClosed ? 0 : 1, duration: 200 }).start()
    }
  }

  return (
    <View
      {...{
        onStartShouldSetResponder: panResponder.panHandlers.onStartShouldSetResponder,
        onMoveShouldSetResponder: panResponder.panHandlers.onMoveShouldSetResponder,
        onResponderGrant: panResponder.panHandlers.onResponderGrant,
        onResponderMove: panResponder.panHandlers.onResponderMove,
      }
      }
      onResponderRelease={(e) => {
        if (touchState.dragging || touchState.holding) {
          panResponderHandlers.onPanResponderRelease(e)
        } else {
          if (touchFunc) { touchFunc() }
        }
        touchState.isDown = false
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
  const [panResponder, _] = useTouchPanResponder(panResponderHandlers, onPress)
  return (
    <View {...panResponder.panHandlers} style={styles.eye} >{
      visible
        ? <Icon fill='#6B6B6B' name='eye' />
        : <Icon name='eyeCrossed' fill={null} />
    }</View>
  )
}
