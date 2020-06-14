import React from 'react';
import { Text, View, Platform } from 'react-native';
import { DebugOverlay, overlayLog } from './src/components/DebugOverlay';
import TouchEventLoader from './src/components/TouchEventLoader'
import { Events, initializeEvents } from './src/core/events';
import RenderView from './src/components/RenderView';
import Theme from './src/components/Theme';
import UILayout from './src/components/UILayout'
import AppState from './src/core/application/app-state'


class Phoblocks extends React.Component<{ appState: AppState }, {}> {
  componentDidMount() {
    Events.addListener('touchstart', (e: any) => {
      overlayLog(JSON.stringify(e))
    })

    if (Platform.OS === 'web') {
      window.addEventListener('resize', () => {
        this.forceUpdate()
      })
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
        <DebugOverlay />
        <RenderView />
        <TouchEventLoader style={{ zIndex: 2 }} />
        <UILayout appState={this.props.appState} />
      </View>
    )
  }
}

export default function App() {
  initializeEvents()

  return (<Phoblocks appState={new AppState()} />)
}
