import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Theme from '../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { Layer, LayerType } from '../../core/application/redux/layer'
import LayerView from './LayerView'
import LayerProperties from './LayerProperties'

const getLayers = (entries: Layer[], children: number[], level: number) => {
  const layers = children.map((_, idx, arr) => {
    const id = arr[arr.length - 1 - idx]
    const layer = entries[id]
    const isOpenedGroup = layer.type === LayerType.GROUP && !layer.closed
    console.log({ isOpenedGroup, layer })

    return (<View key={`layerListItem${id}`}>
      <LayerView
        layer={layer}
        // selected={arr[index].id == state.activeLayer}
        // maskEditing={state.maskEditing}
        level={level} />
      {isOpenedGroup
        ? <LayersList entries={entries} children={layer.layers} level={level + 1} />
        : null}
    </View>)
  })
  return layers
}

const LayersList = ({
  entries,
  children,
  level
}: {
  entries: Layer[],
  children: number[],
  level: number
}) => (
    <View>
      {getLayers(entries, children, level)}
    </View>
  )

const _LayersListPanel = ({
  height,
  style,
  entries,
  children,
}: {
  height: number,
  style: object,
  entries: Layer[],
  children: number[],
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
        <LayersList entries={entries} children={children} level={0} />
      </ScrollView >
    </View>
  )
}

const LayersListPanel = connect((state: PhoblocksState) => ({
  entries: state.document.layersRegistry.entries,
  children: state.document.layersRegistry.docChildren
}), {})(_LayersListPanel)

class LayersPanel extends React.Component {
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
          />
          <LayerProperties />
        </View>
      </View>
    )
  }
}

export default LayersPanel
