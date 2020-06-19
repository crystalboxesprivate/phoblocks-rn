import React, { useEffect, useRef } from 'react';
import { View } from 'react-native'
import Header from './ui/Header'
import Theme from './Theme'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersPanel/LayersToolbar'
import { LayersPanel, LayersThumbnailsPanel } from './ui/LayersPanel'


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
    <LayersThumbnailsPanel />
  </View>)
}



export default UILayout
