import React, { useEffect, useState } from 'react';
import { View, Platform, StatusBar, StyleSheet, } from 'react-native';
import { DebugOverlay, overlayLog } from './src/components/DebugOverlay';
import { Events, initializeEvents } from './src/core/events';
import Theme from './src/components/Theme';
import UILayout from './src/components/UILayout'

import { Provider } from 'react-redux'
import { Combined } from './src/core/application/redux/index'
import { createStore, Store } from 'redux';
import { DocumentActions } from './src/core/application/redux/document';
import { ViewportActions } from './src/core/application/redux/ui/viewport';
import { LayerType, LayerActions } from './src/core/application/redux/layer';
import { Config } from './src/config';
import { FloatingPanelManager } from './src/components/ui/FloatingPanel';
import { UIAction } from './src/core/application/redux/ui';
import { Viewport2 } from './src/components/Viewport';
import { constructTestDocument } from './src/test-document';


const Phoblocks = () => {
  useEffect(() => {
    if (!Config.statusBarVisible) {
      StatusBar.setHidden(true, 'slide')
    }
  })

  return (
    <View style={styles.main}>
      <FloatingPanelManager />
      <DebugOverlay />
      <Viewport2 />

      {/*  <UILayout /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Theme.bgColor,
    flex: 1,
    ...(Platform.OS === 'web' ? { overflow: 'hidden' } : {})
  }
})


export default function App() {
  initializeEvents()
  const store = createStore(Combined)

  constructTestDocument(store)

  return (<Provider store={store}>
    <Phoblocks />
  </Provider>)
}
