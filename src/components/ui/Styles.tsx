import { StyleSheet } from 'react-native'
import Theme from '../Theme'

export const Styles = StyleSheet.create({
  buttonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: Theme.buttonColor,
    borderWidth: 1,
    borderColor: Theme.separatorColor0,
    borderRadius: 4,
    paddingTop: 11, paddingRight: 17, paddingBottom: 11, paddingLeft: 15,
  },
  font16: {
    color: Theme.textBright0,
    fontSize: 16
  },
  font14: {
    color: Theme.textBright0,
    fontSize: 14
  },
})