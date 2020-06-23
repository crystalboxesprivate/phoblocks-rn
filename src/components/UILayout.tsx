import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native'
import Header from './ui/Header'
import Theme from './Theme'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersPanel/LayersToolbar'
import { LayersPanel, LayersThumbnailsPanel } from './ui/LayersPanel'
import { Events } from '../core/events';


const UILayout = () => {

  return (<View style={{
    position: 'absolute',
    top: Theme.getStatusBarHeight(),
    width: Theme.getFullWidth(),
    height: Theme.getFullHeight(),
    left: 0,
  }}>
    <Header />
    <Toolbar />
    <LayersToolbar />

    <LayersThumbnailsPanel />
    <LayersPanel />

    {/*
    
    

    
    */}
  </View>)
}



export default UILayout
