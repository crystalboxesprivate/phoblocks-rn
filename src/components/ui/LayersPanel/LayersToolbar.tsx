import React from 'react'
import Theme from '../../Theme'
import { Sidebar, ToolGroup } from '../Sidebar'
import { ToolIcon, ToolSeparator } from '../ToolIcon'
import { connect, useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import { UIAction, LayerListDisplayMode } from '../../../core/application/redux/ui'
import { TouchableWithoutFeedback, View } from 'react-native'
import { LayerType, LayerActions, Layer } from '../../../core/application/redux/layer'
import { DocumentActionType, DocumentActions } from '../../../core/application/redux/document'

const activeColor = 'rgba(196, 196, 196, 0.5)'

type LayerToolIconProps = {
  isActive?: boolean,
  name: string,
  onPress?: () => void,
  iconFill?: string
}

const LayerToolIcon = ({ isActive, name, onPress, iconFill }: LayerToolIconProps) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View><ToolIcon iconFill={iconFill} isActive={isActive} name={name} activeColor={activeColor} /></View>
  </TouchableWithoutFeedback >
)

type LayersButtonsProps = {
  layerPropertiesVisible: boolean,
  layerDisplayMode: LayerListDisplayMode,
  pressLayerThumbnails: any,
  pressLayerProperties: any,
  pressListButton: any,
}

const LayersButtons = connect((state: PhoblocksState) => ({
  layerDisplayMode: state.ui.layersButtons.layerListDisplayMode,
  layerPropertiesVisible: state.ui.layersButtons.layerPropertiesButton,
}), {
  pressLayerThumbnails: UIAction.layersThumbnailsButton,
  pressLayerProperties: UIAction.layerPropertiesButton,
  pressListButton: UIAction.layersListButton,
})(({ layerDisplayMode,
  layerPropertiesVisible,
  pressLayerThumbnails,
  pressLayerProperties,
  pressListButton }: LayersButtonsProps) => (
    <ToolGroup>
      <LayerToolIcon onPress={() => pressLayerThumbnails()} isActive={layerDisplayMode === LayerListDisplayMode.Thumbnails} name="layers" />
      <LayerToolIcon onPress={() => pressListButton()} isActive={layerDisplayMode === LayerListDisplayMode.List} name="layersParameters" />
      <ToolSeparator color={Theme.separatorColor0} />
      <LayerToolIcon onPress={() => pressLayerProperties()} isActive={layerPropertiesVisible} name="parameters" />
    </ToolGroup>
  ))

const LayersToolbar = () => {
  const { id,
    visible,
    locked,
    parent,
    type,
    layerMask,
    canContainClippingMask,
    maskEditing,
    clippingMaskEnabled } = useSelector((state: PhoblocksState) => {
      const layer = state.document.layersRegistry.entries[state.document.layersRegistry.activeLayer]
      let canContainClippingMask = true
      const childCollection = layer.parent === -1 ? state.document.layersRegistry.docChildren : state.document.layersRegistry.entries[layer.parent].layers
      if (childCollection.indexOf(layer.id) === 0) { canContainClippingMask = false }
      const layerMask = layer.mask
      const maskEditing = state.document.maskEditing
      const clippingMaskEnabled = layer.clippingMask
      return {
        id: layer.id,
        type: layer.type,
        locked: layer.locked,
        visible: layer.visible,
        parent: layer.parent,
        layerMask,
        canContainClippingMask,
        maskEditing,
        clippingMaskEnabled
      }
    })
  const dispatch = useDispatch()
  const toggleVisible = () => dispatch(LayerActions.toggleVisible(id))
  const setMaskEnabled = (enabled: boolean) => dispatch(LayerActions.setMaskEnabled(id, enabled))
  const setMaskTransformLocked = (enabled: boolean) => dispatch(LayerActions.setMaskTransformLocked(id, enabled))
  const setClippingMask = (enabled: boolean) => dispatch(LayerActions.setClippingMask(id, enabled))
  const addLayerMask = () => { dispatch(LayerActions.addLayerMask(id)) }
  //regular layer MASK
  // enable /disable mask mask
  // enable /disable transform mask
  // no clipping mask

  const disabledColor = '#757575'
  return (
    <Sidebar alignment='right' style={{
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <LayersButtons />
      <ToolGroup style={{ margin: 'auto' }}>
        <LayerToolIcon name="addLayer" onPress={() => { dispatch(DocumentActions.addLayer(LayerType.LAYER, parent, id)) }} />
        {visible
          ? <LayerToolIcon name="eye" onPress={toggleVisible} />
          : <LayerToolIcon name="eyeCrossed" iconFill='#4F8CE9' onPress={toggleVisible} />
        }
        {layerMask != null
          ? layerMask?.enabled
            ? <LayerToolIcon name="maskVisible" onPress={() => setMaskEnabled(false)} />
            : <LayerToolIcon name="maskDisabled" onPress={() => setMaskEnabled(true)} />
          : locked
            ? <ToolIcon name="mask" iconFill={disabledColor} />
            : <LayerToolIcon name="mask" onPress={addLayerMask} />
        }
        {maskEditing
          ? <>
            {layerMask?.transformLock
              ? <LayerToolIcon name="maskChain" onPress={() => setMaskTransformLocked(false)} />
              : <LayerToolIcon name="maskTransformDisabled" onPress={() => setMaskTransformLocked(true)} />}
          </>
          : <>
            {type === LayerType.GROUP
              ? <></>
              : (canContainClippingMask
                ? (clippingMaskEnabled
                  ? <LayerToolIcon name="clippingMaskEnabled" onPress={() => setClippingMask(false)} />
                  : <LayerToolIcon name="clippingMaskToolIcon" onPress={() => setClippingMask(true)} />
                )
                : <ToolIcon name="clippingMaskToolIcon" iconFill={disabledColor} />
              )}
          </>}
        <ToolIcon name="energy" />
        <ToolIcon name="dots" />
      </ToolGroup>
    </Sidebar>
  )
}

export default LayersToolbar
