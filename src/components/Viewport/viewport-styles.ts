import { StyleSheet } from "react-native"
import Theme from "../Theme"

export const styles = StyleSheet.create({
  viewport: {
    width: Theme.getFullWidth(),
    height: Theme.getFullHeight(),
    top: 0,
    left: 0,
    position: 'absolute'
  },
  webView: {
    backgroundColor: 'rgba(255,255,255,0.0)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5
  },
  glView: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    width: Theme.getFullWidth(),
    height: Theme.getFullHeight()
  },
  fullSize: { width: '100%', height: '100%', zIndex: 5 }
})
