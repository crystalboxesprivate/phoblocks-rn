import React from 'react'
import { View, Text } from 'react-native'
import Icon from '../Icon'
import Theme from '../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { ViewerAction } from '../../core/application/redux/viewer'

const HeaderButton = ({ name }: { name: string }) => (
  <View style={{ marginLeft: 27 }}>
    <Icon name={name} fill={null}></Icon>
  </View>)

const DocTitleComponent = ({ title, scale, setScale }: {
  title: string,
  scale: number,
  setScale: (zoom: number) => any
}) => (<View style={{
  flex: 1,
  flexDirection: 'row',
  alignItems: "center",

}}>
  <Text style={{ color: Theme.textBright, marginRight: 7, marginTop: 3 }}>{title}</Text>
  <View style={{
    width: 54,
    height: 24,
    backgroundColor: '#4A4A4A',
    borderRadius: 4,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  }}><Text style={{
    textAlign: "center",
    color: Theme.textBright0,
    fontSize: 12,
  }}>{`${Math.floor(scale * 100)}%`}</Text></View>
</View>)


const DocTitle = connect((state: PhoblocksState) => ({
  title: state.document.name,
  scale: state.viewer.scale
}), { setScale: ViewerAction.setZoom })(DocTitleComponent)

const headerStyle = {
  ...Theme.font
}

const Header = () => {
  return (
    <View>
      <View style={{
        alignItems: 'center',
        position: 'absolute',
        width: Theme.getFullWidth(),
        height: Theme.headerHeight,
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: Theme.panelColor,
        flexDirection: 'row'
      }}>
        <View style={{
          marginLeft: 15,
        }}>
          <Icon name='home' fill={null}></Icon>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 14
        }}>
          <HeaderButton name='undo' />
          <HeaderButton name='redo' />
          <HeaderButton name='cloud' />
          <HeaderButton name='share' />
          <HeaderButton name='help' />
        </View>
      </View>
      <View style={{
        position: 'absolute',
        width: Theme.getFullWidth(),
        height: Theme.headerHeight,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
      }}>
        <DocTitle />
      </View>
    </View>
  )
}

export default Header