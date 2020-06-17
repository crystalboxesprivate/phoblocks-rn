import React from 'react';
import { View } from 'react-native'
import Header from './ui/Header'
import Theme from './Theme'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersToolbar'
import LayersPanel from './ui/LayersPanel'

const UILayout = (
) => <View style={{
  position: 'absolute',
  top: Theme.getStatusBarHeight(),
  left: 0,
}}>
    <Header />
    <Toolbar />
    <LayersToolbar />
    <LayersPanel />
  </View>

export default UILayout
