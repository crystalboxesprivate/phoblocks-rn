import React from 'react'
import Theme from '../../Theme'
import { Sidebar, ToolGroup } from '../Sidebar'
import { ToolIcon, ToolSeparator } from '../ToolIcon'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import { UIAction, LayerListDisplayMode } from '../../../core/application/redux/ui'
import { TouchableWithoutFeedback, View } from 'react-native'

const activeColor = 'rgba(196, 196, 196, 0.5)'

type LayerToolIconProps = {
  isActive?: boolean,
  name: string,
  onPress?: () => void
}

const LayerToolIcon = ({ isActive, name, onPress }: LayerToolIconProps) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View><ToolIcon isActive={isActive} name={name} activeColor={activeColor} /></View>
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

const LayersToolbar = () => (
  <Sidebar alignment='right' style={{
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <LayersButtons />
    <ToolGroup style={{ margin: 'auto' }}>
      <ToolIcon name="addLayer" />
      <ToolIcon name="eye" />
      <ToolIcon name="mask" />
      <ToolIcon name="mergeDown" />
      <ToolIcon name="energy" />
      <ToolIcon name="dots" />
    </ToolGroup>
  </Sidebar>
)

export default LayersToolbar
