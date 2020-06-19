import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import Theme from '../Theme'
import LayerProperties from './LayerProperties'
import LayersListPanel from './LayersListPanel'
import { overlayLog } from '../DebugOverlay'
import { PhoblocksState } from '../../core/application/redux'

type LayersPanelProps = {
  listVisible: boolean,
  propertiesVisible: boolean
}

export const LayersPanel = ({ listVisible, propertiesVisible }: LayersPanelProps) => {
  const [layoutHeight, setLayoutHeight] = useState(0)
  const container: any = useRef(null)

  // console.log({ layoutHeight })
  overlayLog('layoutHeight' + layoutHeight)
  return (
    <View style={styles.container} ref={container} onLayout={() => {
      if (layoutHeight == 0) {
        container.current.measure((_x: number, _y: number, _w: number, h: number, _px: number, _py: number) => {
          setLayoutHeight(h)
        })
      }
    }}>
      {listVisible ? (
        <LayersListPanel
          totalHeight={layoutHeight}
          initialHeight={200}
          style={{}}
        />) : null}
      {propertiesVisible ? <LayerProperties /> : null}
    </View>
  )
}

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