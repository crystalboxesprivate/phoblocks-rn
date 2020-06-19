

import { StyleSheet } from 'react-native'
import Theme from '../../Theme'


export const LayersPanelStyles = StyleSheet.create({
  container: {
    backgroundColor: Theme.panelColor,
    borderRightWidth: 1,
    borderRightColor: Theme.bgColor,
    height: Theme.getFullHeight() - Theme.headerHeight - Theme.getStatusBarHeight(),
    position: 'absolute',
    top: Theme.headerHeight + Theme.getStatusBarHeight(),
    left: Theme.getFullWidth() - Theme.sidebarWidth - Theme.layersPanelWidth,
    width: Theme.layersPanelWidth,
    flex: 1
  },
  layersListTitle: {
    color: Theme.textBright0,
    paddingTop: 11,
    paddingLeft: 15,
    marginBottom: 9,

    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'normal',
    fontStyle: 'normal'
  },
  layersList: {
    borderTopWidth: 1,
    borderColor: Theme.bgColor,
  }
})