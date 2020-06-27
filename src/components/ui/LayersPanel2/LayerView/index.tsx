import React, { useRef, useEffect } from 'react'
import { LayerType, LayerActions, Layer } from '../../../../core/application/redux/layer'
import { View, PanResponder, GestureResponderEvent, Animated } from 'react-native'
import Theme from '../../../Theme'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../../../core/application/redux'
import { LayerViewTitle, ControlSideIcons, PreviewBox, EyeButton, PanResponderHandlers, TouchState, holdDelay } from './Elements'
import { styles } from './LayerViewStyles'
import { DocumentActions } from '../../../../core/application/redux/document'
import { createSelector } from 'reselect'

type LayerViewProps = {
  id: number
  level: number
  itemHeight: number
  isVisiallyClosed: boolean
}

const layerDataSelector = (state: PhoblocksState, props: any) => state.document.layersRegistry.entries[props.id]

const getCurrentLayer = createSelector([layerDataSelector], (layer: Layer) => ({
  type: layer.type,
  name: layer.name,
  clippingMask: layer.clippingMask,
  closed: layer.closed,
  mask: layer.mask,
  visible: layer.visible
}))

const LayerView = ({ id, level, itemHeight, isVisiallyClosed }: LayerViewProps) => {
  const selected = useSelector((state: PhoblocksState) => id == state.document.layersRegistry.activeLayer)
  const layer = useSelector((state: PhoblocksState) => getCurrentLayer(state, { id, level }))
  const maskEditing = useSelector((state: PhoblocksState) => state.document.maskEditing)
  const closeAnimation = useRef(new Animated.Value(isVisiallyClosed ? 0 : 1)).current

  useEffect(() => {
    Animated.timing(closeAnimation, { toValue: isVisiallyClosed ? 0 : 1, duration: 200 }).start()
  }, [isVisiallyClosed])

  const dispatch = useDispatch()
  const toggleGroupClosed = () => {
    dispatch(LayerActions.toggleGroupClosed(id))
    dispatch(DocumentActions.bumpHierarchyChangeId())
  }
  const toggleLayerVisible = () => dispatch(LayerActions.toggleVisible(id))
  const setLayerActive = () => dispatch(DocumentActions.setActiveLayer(id))
  const setMaskEditing = (val: boolean) => dispatch(DocumentActions.setMaskEditing(val))
  const onMaskPreviewBox = () => {
    setLayerActive()
    setMaskEditing(true)
  }
  const onPreviewBox = () => {
    setLayerActive()
    setMaskEditing(false)
  }

  const touchState: TouchState = useRef({ isDown: false, dragging: false, holding: false, timeOut: -1 }).current

  const handlerEvents: PanResponderHandlers = {
    onPanResponderGrant: (e: GestureResponderEvent) => {
      touchState.isDown = true
      touchState.dragging = false
      touchState.holding = false
      touchState.timeOut = setTimeout(() => touchState.holding = true, holdDelay)
    },

    onPanResponderMove: (e: GestureResponderEvent) => {
      if (touchState.isDown) {
        touchState.dragging = true
        clearTimeout(touchState.timeOut)
      }
    },
    onPanResponderRelease: (e: GestureResponderEvent) => {
      if (!touchState.dragging && !touchState.holding) {
        onPreviewBox()
      }
      touchState.dragging = false
      touchState.holding = false
      touchState.isDown = false
    },
  }

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    ...handlerEvents
  })).current

  const addStyle = {
    backgroundColor: selected ? Theme.selectedLayer : Theme.panelColor,
    marginTop: closeAnimation.interpolate({ inputRange: [0, 1], outputRange: [-itemHeight, 0] }),
    opacity: closeAnimation,
    zIndex: closeAnimation.interpolate({ inputRange: [0, 0.01], outputRange: [-1, 2], extrapolate: 'clamp' })
  }
  return (
    <Animated.View {...panResponder.panHandlers} style={[addStyle, styles.layerViewContainer]}>
      <View style={[styles.layerInnerContainer, { marginLeft: 16 * level }]}>
        <ControlSideIcons
          isGroup={layer.type === LayerType.GROUP}
          panResponderHandlers={handlerEvents}
          onPress={toggleGroupClosed}
          layerHasClippingMaskEnabled={layer.clippingMask}
          isClosed={layer.closed} />
        <PreviewBox
          onPress={onPreviewBox}
          panResponderHandlers={handlerEvents}
          selected={selected && !maskEditing} />
        {layer.mask
          ? <>
            <View style={styles.layerDot} />
            <PreviewBox
              panResponderHandlers={handlerEvents}
              onPress={onMaskPreviewBox}
              selected={selected && maskEditing}
            /></>
          : null}
      </View>
      <LayerViewTitle name={layer.name} visible={layer.visible} />
      <EyeButton
        panResponderHandlers={handlerEvents}
        onPress={toggleLayerVisible}
        visible={layer.visible} />
    </Animated.View>
  )
}


export default LayerView