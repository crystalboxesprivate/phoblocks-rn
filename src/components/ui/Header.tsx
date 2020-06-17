import React from 'react'
import { View, Text } from 'react-native'
import Icon from '../Icon'
import Theme from '../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { ViewerAction } from '../../core/application/redux/viewer'
import { overlayLog } from '../DebugOverlay'

const HeaderButton = ({ name }: { name: string }) => (
  <View style={{ marginLeft: 27 }}>
    <Icon name={name} fill={null}></Icon>
  </View>)


type DocumentScaleProps = {
  scale: number,
  setScale: (zoom: number) => any
}

class DocumentScale_ extends React.Component<DocumentScaleProps, {}> {
  constructor(props: DocumentScaleProps) {
    super(props)
  }

  isDragging = false
  startScale = 0
  startPosX = 0

  scaleIncrement = 0.3

  showDialerPopup() {
    overlayLog('showing scale dialer')
  }

  render() {
    return (<View style={{
      width: 54,
      height: 24,
      backgroundColor: '#4A4A4A',
      borderRadius: 4,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    }}
      onStartShouldSetResponder={_ => true}
      onResponderGrant={e => {
        this.isDragging = false
        this.startPosX = e.nativeEvent.pageX
        this.startScale = this.props.scale
      }}
      onResponderMove={e => {
        this.isDragging = true
        const delta = (e.nativeEvent.pageX - this.startPosX) * 0.01 * this.scaleIncrement
        let newScale = delta + this.startScale
        if (newScale < 0.01) {
          newScale = 0.01
        }
        this.props.setScale(newScale)
      }}
      onResponderRelease={e => {
        if (!this.isDragging) {
          this.showDialerPopup()
        }
      }}
    >
      <Text style={{
        textAlign: "center",
        color: Theme.textBright0,
        fontSize: 12,
      }}>{`${Math.floor(this.props.scale * 100)}%`}</Text>
    </View>)
  }
}



const DocumentScale = connect((state: PhoblocksState) => ({
  scale: state.viewer.scale
}), { setScale: ViewerAction.setZoom })(DocumentScale_)
const DocTitle_ = ({ title, }: {
  title: string,
}) => (<View style={{
  flex: 1,
  flexDirection: 'row',
  alignItems: "center",

}}>
  <Text style={{ color: Theme.textBright, marginRight: 7, marginTop: 3 }}>{title}</Text>
  <DocumentScale />
</View>)


const DocTitle = connect((state: PhoblocksState) => ({
  title: state.document.name,
  scale: state.viewer.scale
}), { setScale: ViewerAction.setZoom })(DocTitle_)

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