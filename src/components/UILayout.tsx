import React from 'react';
import { Text, View, Platform, Dimensions } from 'react-native'
import Header from './ui/Header'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersToolbar'
import LayersPanel from './ui/LayersPanel'
import AppState from '../core/application/app-state'

const UILayout = (
  { appState }: { appState: AppState }
) => <View style={{
  position: 'absolute',
  top: getStatusBarHeight(),
  left: 0,
}}>
    <Header title='Untitled' />
    <Toolbar />
    <LayersToolbar />
    <LayersPanel appState={appState} />
  </View>

export default UILayout
