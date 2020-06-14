import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import AppState from '../../core/application/app-state'
import Theme from '../Theme'
import { ILayerHolder } from '../../core/application/layer'
import LayerView from './LayerView'

const getLayers = (state: AppState, parent: ILayerHolder, level: number) => {
  const layers = parent.layers.map((_, idx, arr) => {
    const index = arr.length - 1 - idx
    return (<View key={`layerListItem${index}`}>
      <LayerView
        layer={arr[index]}
        selected={arr[index].id == state.activeLayer}
        maskEditing={state.maskEditing}
        level={level} />
      {('layers' in arr[index] && !(arr[index] as unknown as ILayerHolder).closed)
        ? <LayersList state={state} container={(arr[index] as unknown as ILayerHolder)} level={level + 1} />
        : null}
    </View>)
  })
  return layers
}

const LayersList = ({
  state,
  container,
  level
}: {
  state: AppState,
  container: ILayerHolder,
  level: number
}) => (
    <View>
      {getLayers(state, container, level)}
    </View>
  )

const LayersListPanel = ({
  height,
  style,
  state
}: {
  height: number,
  style: object,
  state: AppState
}) => {
  return (
    <View key='layers' style={{
      height: height,
      ...style
    }}>
      <Text style={{
        color: Theme.textBright0,
        paddingTop: 11,
        paddingLeft: 15,
        marginBottom: 9,

        fontSize: 16,
        lineHeight: 19,
        fontWeight: 'normal',
        fontStyle: 'normal'
      }}>
        Layers
      </Text>
      <ScrollView style={{ height: height }}>
        <LayersList state={state} container={state.document} level={0} />
      </ScrollView >
    </View>
  )
}

class LayersPanel extends React.Component<{ appState: AppState }, {}> {
  holder: React.RefObject<unknown>
  divisor: number

  constructor(props: any) {
    super(props)
    this.holder = React.createRef()
    this.divisor = 0.5
    this.state = { topHeight: 100, bottomHeight: 100 }
  }

  render() {
    return (
      <View style={{
        backgroundColor: Theme.bgColor,
        borderRightWidth: 1,
        borderRightColor: Theme.bgColor,
        height: Theme.getFullHeight(),
        left: Theme.getFullWidth() - Theme.sidebarWidth - 256,
        position: 'absolute',
        top: Theme.headerHeight,
        width: 256,
      }}>
        <View style={{
          marginTop: 1,
          backgroundColor: Theme.panelColor,
          flex: 1
        }}>
          <LayersListPanel
            height={444}
            style={{}}
            state={this.props.appState}
          />
        </View>
      </View>
    )
  }
}

export default LayersPanel
