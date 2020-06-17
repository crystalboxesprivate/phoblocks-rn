import React from 'react'
import { Text, ScrollView, View, StyleSheet } from 'react-native'
import Theme from '../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { Layer, LayerType } from '../../core/application/redux/layer'
import LayerView from './LayerView'
import { Events } from '../../core/events'

type FlatLayerListEntry = {
  layer: Layer,
  level: number
}

const getFlatLayerList = (entries: Layer[], children: number[], level: number) => {
  const layers: FlatLayerListEntry[] = []
  for (let idx = 0; idx < children.length; idx++) {
    const id = children[children.length - 1 - idx]
    const layer = entries[id]
    const isOpenedGroup = layer.type === LayerType.GROUP && !layer.closed

    const childEntries: FlatLayerListEntry[] = isOpenedGroup
      ? getFlatLayerList(entries, layer.layers, level + 1)
      : []
    layers.push({ layer, level } as FlatLayerListEntry, ...childEntries)
  }
  return layers
}

type LayersListProps = {
  entries: Layer[],
  children: number[],
  level: number,
  height: number
}

// 
// handler get layer
// layer view gets the handler
// layer has on press
// 

class LayersList extends React.Component<LayersListProps, {}> {
  render() {
    return (
      <ScrollView style={{ height: this.props.height }}>
        {getFlatLayerList(this.props.entries, this.props.children, this.props.level)
          .map((x, idx) => (
            <LayerView key={`LayerListItem-${idx}`}
              layer={x.layer}
              level={x.level} />
          ))}
      </ScrollView>
    )
  }
}

type LayersListPanelProps = {
  initialHeight: number,
  style: object,
  entries: Layer[],
  children: number[],
}

class _LayersListPanel extends React.Component<LayersListPanelProps, { height: number }> {
  constructor(props: LayersListPanelProps) {
    super(props)
    this.state = { height: this.props.initialHeight }
  }

  startHeight = 0

  componentDidMount() {
    Events.addListener('LayerDragTitleStart', () => {
      this.startHeight = this.state.height
    })

    Events.addListener('LayerDragTitleMove', (delta: number) => {
      let newHeight = this.startHeight + delta
      newHeight = newHeight < 5 ? 0 : newHeight
      this.setState({ height: newHeight })
    })
  }

  render() {
    return (this.state.height < 5) ? null
      : (
        <View key='layers' style={[styles.layersList, {
          height: this.state.height,
          ...this.props.style
        }]}>
          {
            this.state.height > 20 ?
              (<Text style={styles.layersListTitle}>
                Layers
              </Text>) : null
          }
          {
            this.state.height > 45 ?
              <LayersList height={this.state.height} entries={this.props.entries} children={this.props.children} level={0} />
              : null
          }
        </View >
      )
  }
}

const LayersListPanel = connect((state: PhoblocksState) => ({
  entries: state.document.layersRegistry.entries,
  children: state.document.layersRegistry.docChildren
}), {})(_LayersListPanel)

const styles = StyleSheet.create({
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

export default LayersListPanel