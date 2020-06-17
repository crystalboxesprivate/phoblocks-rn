import React from 'react'
import { View } from 'react-native'
import Theme from '../Theme'
import LayerProperties from './LayerProperties'
import LayersListPanel from './LayersListPanel'

export default () => (
  <View style={{
    backgroundColor: Theme.panelColor,
    borderRightWidth: 1,
    borderRightColor: Theme.bgColor,
    height: Theme.getFullHeight(),
    left: Theme.getFullWidth() - Theme.sidebarWidth - Theme.layersPanelWidth,
    position: 'absolute',
    top: Theme.headerHeight,
    width: Theme.layersPanelWidth,
    flex: 1
  }}>
    <LayersListPanel
      initialHeight={200}
      style={{}}
    />
    <LayerProperties />
  </View>
)