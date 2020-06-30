import { GestureResponderEvent, Platform, PlatformIOSStatic } from "react-native"
import { WebViewMessageEvent } from "react-native-webview"
import { useState } from "react"
import { Asset } from 'expo-asset';

export type CustomTouch = { pageX: number, pageY: number, force?: number }
export type CustomTouchEvent = {
  type: string
  center?: { x: number, y: number }
  scale?: number
  rotation?: number
  pointerType: string
  touches?: CustomTouch[]
}

export function useTouchEventHandler(onEvent: (e: CustomTouchEvent) => void) {
  const grabNativeEvent = (e: GestureResponderEvent, eventType: string) => {
    const outEvent: CustomTouchEvent = { type: eventType, pointerType: 'mouse', touches: [] }
    for (let touch of e.nativeEvent.touches) {
      if (outEvent.touches) { outEvent.touches.push({ pageX: touch.pageX, pageY: touch.pageY }) }
    }
    onEvent(outEvent)
  }
  const grabWebViewEvent = (event: WebViewMessageEvent) => {
    const e = JSON.parse(event.nativeEvent.data) as CustomTouchEvent
    if (e.touches && e.touches.length > 0 && e.touches[0].force && e.touches[0].force > 0.0001) {
      e.pointerType = (Platform as PlatformIOSStatic).isPad ? 'pen' : 'touch'
    }
    onEvent(e)
  }
  const nativeViewProps = {
    onStartShouldSetResponder: () => true,
    onResponderGrant: (e: GestureResponderEvent) => grabNativeEvent(e, 'touchstart'),
    onResponderMove: (e: GestureResponderEvent) => grabNativeEvent(e, 'touchmove'),
    onResponderEnd: (e: GestureResponderEvent) => grabNativeEvent(e, 'touchend'),
  }
  const webViewProps = {
    onMessage: grabWebViewEvent,
    originWhitelist: ['*'],
  }

  return [nativeViewProps, webViewProps]
}


export function useHtmlSource() {
  const [htmlSource, setHtmlSource] = useState('')
  const getMarkdown = async () => {
    let file = Asset.fromModule(require(`../../../assets/html/index.html`))
    await file.downloadAsync()
    return Promise.resolve(await (await fetch(file.uri)).text())
  }
  if (htmlSource.length == 0) { getMarkdown().then((data: string) => setHtmlSource(data)) }
  return htmlSource
}