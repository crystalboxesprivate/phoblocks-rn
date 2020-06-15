import React from 'react';
import { Text, View, Platform, Dimensions } from 'react-native'
import Header from './ui/Header'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersToolbar'
import LayersPanel from './ui/LayersPanel'

const UILayout = (
  // { appState }: { appState: AppState }
) => <View style={{
  position: 'absolute',
  top: getStatusBarHeight(),
  left: 0,
}}>
    <Header />
    <Toolbar />
    <LayersToolbar />
    <LayersPanel />
  </View>

export default UILayout
