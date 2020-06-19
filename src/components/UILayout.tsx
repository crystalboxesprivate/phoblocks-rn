import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native'
import Header from './ui/Header'
import Theme from './Theme'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersPanel/LayersToolbar'
import { LayersPanel } from './ui/LayersPanel/LayersPanel'
import { LayersThumbnailsPanelAnimated } from './ui/LayersPanel/LayersThumbnailsPanel'



const UILayout = () => {
  return (<View style={{
    position: 'absolute',
    top: Theme.getStatusBarHeight(),
    left: 0,
  }}>
    <Header />
    <Toolbar />
    <LayersToolbar />

    <LayersPanel />
    <LayersThumbnailsPanelAnimated />
  </View>)
}



export default UILayout
