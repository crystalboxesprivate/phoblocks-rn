import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { DebugOverlay, overlayLog } from './src/components/DebugOverlay';
import TouchEventLoader from './src/components/TouchEventLoader'
import { Events, initializeEvents } from './src/core/events';
import RenderView from './src/components/RenderView';
import Theme from './src/components/Theme';
import UILayout from './src/components/UILayout'

import { Provider } from 'react-redux'
import { Combined } from './src/core/application/redux/index'
import { createStore } from 'redux';
import { DocumentActions } from './src/core/application/redux/document';
import { ViewerAction } from './src/core/application/redux/viewer';
import { LayerType, LayerActions, Layer } from './src/core/application/redux/layer';
import { Config } from './src/config';
import { FloatingPanelManager } from './src/components/ui/FloatingPanel';
import { UIAction } from './src/core/application/redux/ui';


class Phoblocks extends React.Component<{}, {}> {
  componentDidMount() {
    Events.addListener('touchstart', (e: any) => {
      overlayLog(JSON.stringify(e))
    })

    if (Platform.OS === 'web') {
      window.addEventListener('resize', () => {
        Events.invoke('resize')
        this.forceUpdate()
      })
    }

    if (!Config.statusBarVisible) {
      StatusBar.setHidden(true, 'slide')
    }
  }

  render() {
    return (
      <View style={{
        backgroundColor: Theme.bgColor,
        flex: 1,
        ...(
          Platform.OS === 'web' ? { overflow: 'hidden' } : {}
        )
      }}>
        <FloatingPanelManager />
        <DebugOverlay />
        <RenderView />
        <TouchEventLoader style={{ zIndex: 2 }} />
        <UILayout />
        {/*
        
        
        
        */}
      </View>
    )
  }
}

export default function App() {
  initializeEvents()
  const store = createStore(Combined)

  let id = 0
  const makeLayer = (type: LayerType, parent?: number) => {
    store.dispatch(DocumentActions.addLayer(type, parent))
    return id++
  }
  // initialize the state here
  store.dispatch(DocumentActions.setName('Untitled'))
  store.dispatch(ViewerAction.setZoom(1.05))

  const l = makeLayer(LayerType.LAYER)
  store.dispatch(LayerActions.setName(l, 'my layer'))
  store.dispatch(LayerActions.setOpacity(l, 0.5))
  const l2 = makeLayer(LayerType.LAYER)

  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)

  const g = makeLayer(LayerType.GROUP)
  makeLayer(LayerType.LAYER, g)
  store.dispatch(DocumentActions.parentLayer(l2, g))

  const g2 = makeLayer(LayerType.GROUP, g)
  makeLayer(LayerType.LAYER, g2)

  store.dispatch(LayerActions.toggleGroupClosed(g2))

  const l3 = makeLayer(LayerType.LAYER)
  store.dispatch(LayerActions.setClippingMask(l3, true))

  store.dispatch(LayerActions.addLayerMask(l3))
  store.dispatch(LayerActions.toggleVisible(l3))

  store.dispatch(UIAction.layersListButton())
  // store.dispatch(UIAction.layerPropertiesButton())

  return (
    <Provider store={store}>
      <Phoblocks />
    </Provider>)
}
