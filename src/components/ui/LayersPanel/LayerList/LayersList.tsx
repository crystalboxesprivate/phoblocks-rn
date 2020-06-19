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
}

// total height may be not the full height panel
export const LayersList = ({ availableHeight, layoutHeight, listHeight }: LayerListProps) => {
  const heightThreshold = 10
  const scrollHeightAvailable = availableHeight - layoutHeight
  if (availableHeight < heightThreshold) {
    return null
  }
  const heightStyle = layoutHeight != 0 && listHeight != 0 ? { height: availableHeight } : {}
  return (<View style={[LayersPanelStyles.layersList, heightStyle]} >
    <Text style={LayersPanelStyles.layersListTitle}>Layers</Text>
    <LayersScrollableList listHeight={listHeight} height={scrollHeightAvailable} />
  </View>)
}


export const LayersListAnimated = Animated.createAnimatedComponent(class extends React.Component<LayerListProps> {
  render = () => (<LayersList
    layoutHeight={this.props.layoutHeight}
    listHeight={this.props.listHeight}
    availableHeight={this.props.availableHeight}
  />)
})
