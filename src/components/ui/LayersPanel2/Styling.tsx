import { StyleSheet } from 'react-native'
import Theme from '../../Theme'

export const styles = StyleSheet.create({
  layersPanel: {
    backgroundColor: Theme.panelColor,
    borderRightWidth: 1,
    borderRightColor: Theme.bgColor,
    height: Theme.getFullHeight() - Theme.headerHeight - Theme.getStatusBarHeight(),
    position: 'absolute',
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
  },
  layerDragTitle: {
    borderTopWidth: 1,
    borderColor: Theme.bgColor,
    paddingTop: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12
  },
})