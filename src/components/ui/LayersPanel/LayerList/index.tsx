import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'

import { LayersScrollableList } from './LayersScrollableList'
import { LayersPanelStyles } from '../LayersPanelStyles'

// it accepts the total height
// measures the title
// gets the max height available for the inner scroll view
export type LayerListProps = {
  availableHeight: number
  layoutHeight: number
  listHeight: number
  isHidden: boolean
}

export const LayersListAnimated = Animated.createAnimatedComponent(class extends React.Component<LayerListProps> {
  render = () => {
    const { availableHeight, layoutHeight, listHeight } = this.props
    const heightThreshold = 10
    const scrollHeightAvailable = availableHeight - layoutHeight

    let hidden = this.props.isHidden

    if (availableHeight < heightThreshold) {
      hidden = true
    }

    const heightStyle = layoutHeight != 0 && listHeight != 0 ? { height: availableHeight } : {}
    return (<View style={hidden ? [] : [LayersPanelStyles.layersList, heightStyle]} >
      {hidden ? null : <Text style={LayersPanelStyles.layersListTitle}>Layers</Text>}
      <LayersScrollableList isHidden={hidden} listHeight={listHeight} height={scrollHeightAvailable} />
    </View>)
  }
})
