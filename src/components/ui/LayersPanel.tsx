import React from 'react'
import { View, StyleSheet } from 'react-native'
import Theme from '../Theme'
import LayerProperties from './LayerProperties'
import LayersListPanel from './LayersListPanel'

type LayersPanelProps = {
  listVisible: boolean,
  propertiesVisible: boolean
}
export const LayersPanel = ({ }: LayersPanelProps) => (
  <View style={styles.container}>
    <LayersListPanel
      initialHeight={200}
      style={{}}
    />
    <LayerProperties />
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.panelColor,
    borderRightWidth: 1,
    borderRightColor: Theme.bgColor,
    height: Theme.getFullHeight(),
    left: Theme.getFullWidth() - Theme.sidebarWidth - Theme.layersPanelWidth,
    position: 'absolute',
    top: Theme.headerHeight,
    width: Theme.layersPanelWidth,
    flex: 1
  }
})