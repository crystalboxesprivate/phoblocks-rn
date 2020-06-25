import { StyleSheet } from "react-native"
import Theme from "../../../Theme"

export const styles = StyleSheet.create({
  layerViewContainer: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  layerInnerContainer: {
    flexDirection: 'row', alignItems: 'center',
  },
  leftIcon: {
    width: 25,
    flexDirection: 'row',
  },
  layerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C4C4C4',
    marginRight: 3,
    marginLeft: 3,
  },
  layerTitle: {
    ...Theme.getFont(14),
    marginLeft: 7,
    flexGrow: 4
  },
  iconHold: { marginRight: 6 },
  eye: { marginRight: 6, paddingLeft: 30 }
})