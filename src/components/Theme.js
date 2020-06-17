import { Dimensions } from 'react-native'

import { getStatusBarHeight } from 'react-native-status-bar-height'
// const fontFamily = 'sans-serif'

function getFont(size) {
  return {
    // fontFamily,
    // fontStyle: 'normal',
    // fontWeight: 'normal',
    fontSize: size,
    lineHeight: 19,
  }
}

export default {
  buttonColor: '#2f2f2f',
  panelColor: '#323232',
  bgColor: '#252525',
  textBright: '#e5e5e5',
  textBright0: '#e3e3e3',
  textDisabledLayer: '#6E6E6E',
  separatorColor: '#b9b9b9',
  separatorColor0: '#4A4A4A',
  sidebarWidth: 48,
  layersPanelWidth: 256,
  // fontFamily,
  headerHeight: 48,
  getFont,
  font: getFont(16),
  getStatusBarHeight,

  getFullWidth: () => Dimensions.get('window').width,
  getFullHeight: () => Dimensions.get('window').height,
}
