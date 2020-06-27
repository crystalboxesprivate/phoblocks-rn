import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native'
import Header from './ui/Header'
import Theme from './Theme'
import Toolbar from './ui/Tools/Toolbar'
import LayersToolbar from './ui/LayersPanel2/LayersToolbar'
import { LayersPanel2 } from './ui/LayersPanel2'
import { Events } from '../core/events';
import { LayersThumbnailsPanel, LayersThumbnailsPanelAnimated } from './ui/LayersThumbnailsPanel';


const UILayout = () => {
  return (<View style={{
    position: 'absolute',
    top: Theme.getStatusBarHeight(),
    left: 0,
  }}>
    <Header />
    <Toolbar />
    <LayersToolbar />

    <LayersPanel2 />

    <LayersThumbnailsPanelAnimated />

    {/*
    
    

    
    */}
  </View>)
}



export default UILayout
