import React, { useRef } from 'react'
import { LayerType, LayerActions, Layer } from '../../../../core/application/redux/layer'
import { View, PanResponder, GestureResponderEvent } from 'react-native'
import Theme from '../../../Theme'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../../../core/application/redux'
import { LayerViewTitle, ControlSideIcons, PreviewBox, EyeButton, PanResponderHandlers } from './Elements'
import { styles } from './LayerViewStyles'
import { DocumentActions } from '../../../../core/application/redux/document'
import { createSelector } from 'reselect'

type LayerViewProps = {
  id: number
  level: number
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

const LayerView = ({ id, level }: LayerViewProps) => {
  const selected = useSelector((state: PhoblocksState) => id == state.document.layersRegistry.activeLayer)
  const layer = useSelector((state: PhoblocksState) => getCurrentLayer(state, { id, level }))
  const maskEditing = useSelector((state: PhoblocksState) => state.document.maskEditing)

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

  const touchState = useRef({ isDown: false, dragging: false }).current

  const handlerEvents: PanResponderHandlers = {
    onPanResponderGrant: (e: GestureResponderEvent) => {
      touchState.isDown = true
      touchState.dragging = false
    },

    onPanResponderMove: (e: GestureResponderEvent) => {
      touchState.dragging = true
    },
    onPanResponderRelease: (e: GestureResponderEvent) => {
      if (!touchState.dragging) {
        onPreviewBox()
      }
      touchState.dragging = false
      touchState.isDown = false
    },
  }

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    ...handlerEvents
  })).current

  const addStyle = { backgroundColor: selected ? Theme.selectedLayer : Theme.panelColor }
  return (
    <View {...panResponder.panHandlers} style={[addStyle, styles.layerViewContainer]}>
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
    </View>
  )
}


export default LayerView