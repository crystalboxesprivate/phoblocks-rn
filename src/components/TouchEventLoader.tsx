import React from 'react';
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { overlayLog } from './DebugOverlay';
import { Asset } from 'expo-asset';
import { Events } from '../core/events';
import { Platform } from 'react-native'

type CustomTouch = {
  pageX: number
  pageY: number
  force?: number
}

export type CustomTouchEvent = {
  type: string
  center?: { x: number, y: number }
  scale?: number
  rotation?: number
  pointerType: string
  touches?: CustomTouch[]
}

const getMarkdown = async () => {
  let file = Asset.fromModule(require(`../../assets/html/index.html`))
  await file.downloadAsync()
  let file2 = await fetch(file.uri)
  let res = await file2.text()
  return Promise.resolve(res)
}

type TouchEventLoaderProps = {
  style: { zIndex: number }
}

class TouchEventLoader extends React.Component<TouchEventLoaderProps, {}> {
  htmlData = ''
  initialized = false
  constructor(props: TouchEventLoaderProps) {
    super(props)
  }

  componentDidMount() {
    if (Platform.OS === 'web') {
      for (let ev of ['mousedown', 'mouseup', 'mousemove']) {
        document.addEventListener(ev, e => { Events.invoke(ev, e) })
      }
    }
    overlayLog('Stylus initialized')
    this.initialized = true
  }

  get webView() {
    if (this.htmlData.length == 0) {
      getMarkdown().then((data: string) => {
        this.htmlData = data
        this.forceUpdate()
      })
      return <View style={{ width: '100%', height: '100%' }}></View>
    } else {
      return <WebView
        style={{
          backgroundColor: 'rgba(255,255,255,0.0)',
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 5
        }}
        onMessage={(event: any) => {
          if (!this.initialized) { return }
          const e = JSON.parse(event.nativeEvent.data) as CustomTouchEvent
          if (e.touches && e.touches.length > 0) {
            if (e.touches[0].force && e.touches[0].force > 0.0001) {
              // @ts-ignore
              e.pointerType = Platform.isPad ? 'pen' : 'touch'
            }
          }
          Events.invoke(e.type, e)
        }}
        originWhitelist={['*']}
        source={{ html: this.htmlData }}
      />
    }
  }

  render() {
    return Platform.OS === 'web' ? (
      <View onStartShouldSetResponder={() => true}
        onResponderGrant={(e) => {
          const outEvent: CustomTouchEvent = { type: 'touchstart', pointerType: 'mouse', touches: [] }
          for (let touch of e.nativeEvent.touches) {
            if (outEvent.touches)
              outEvent.touches.push({ pageX: touch.pageX, pageY: touch.pageY })
          }
          Events.invoke('touchstart', outEvent)
        }}
        onResponderMove={(e) => {
          const outEvent: CustomTouchEvent = { type: 'touchmove', pointerType: 'mouse', touches: [] }
          for (let touch of e.nativeEvent.touches) {
            if (outEvent.touches)
              outEvent.touches.push({ pageX: touch.pageX, pageY: touch.pageY })
          }
          Events.invoke('touchmove', outEvent)
        }}
        onResponderEnd={(e) => {
          const outEvent: CustomTouchEvent = { type: 'touchend', pointerType: 'mouse', touches: [] }
          for (let touch of e.nativeEvent.touches) {
            if (outEvent.touches)
              outEvent.touches.push({ pageX: touch.pageX, pageY: touch.pageY })
          }
          Events.invoke('touchend', outEvent)
        }}
        style={{ width: '100%', height: '100%' }}></View>
    ) : this.webView
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TouchEventLoader