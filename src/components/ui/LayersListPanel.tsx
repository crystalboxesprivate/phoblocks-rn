import React, { useState, useRef } from 'react'
import { Text, ScrollView, View, StyleSheet, Animated } from 'react-native'
import Theme from '../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { Layer, LayerType } from '../../core/application/redux/layer'
import LayerView from './LayerView'
import { Events } from '../../core/events'

type FlatLayerListEntry = {
  layer: Layer,
  level: number,
  childrenCount: number
}

const getFlatLayerList = (entries: Layer[], children: number[], level: number) => {
  const layers: FlatLayerListEntry[] = []
  for (let idx = 0; idx < children.length; idx++) {
    const id = children[children.length - 1 - idx]
    const layer = entries[id]
    const isOpenedGroup = layer.type === LayerType.GROUP && !layer.closed

    const childEntries: FlatLayerListEntry[] = layer.type === LayerType.GROUP
      ? getFlatLayerList(entries, layer.layers, level + 1)
      : []
    layers.push({ layer, level, childrenCount: childEntries.length } as FlatLayerListEntry, ...childEntries)
  }
  return layers
}

type LayersListProps = {
  entries: Layer[],
  children: number[],
  level: number,
  height: number
}


const LayerViewHolder = Animated.createAnimatedComponent(class extends React.Component<{
  layer: Layer, level: number, onGroupButtonPress?: (a: boolean) => void, marginTop?: number, opacity?: number
}> {
  render() {
    const opacity = this.props.opacity == null ? 1.0 : this.props.opacity
    // console.log({ opacity })
    return (opacity < 0.01 ? null : <Animated.View style={{ marginTop: this.props.marginTop || 0, opacity: opacity }}><LayerView
      onGroupButtonPress={this.props.onGroupButtonPress}
      layer={this.props.layer}
      level={this.props.level} /></Animated.View>)
  }
})
// 
// handler get layer
// layer view gets the handler
// layer has on press
// 
const LayersList = ({ entries,
  children,
  level,
  height }: LayersListProps) => {
  const [listViewHeight, setListViewHeight] = useState(0)
  const flatlist = getFlatLayerList(entries, children, level)
  const animatedValues = new Map<number, { layer: Layer, anim: any }>()
  for (let l of flatlist) {
    if (l.childrenCount > 0) {
      animatedValues.set(l.layer.id, { layer: l.layer, anim: useRef(new Animated.Value(l.layer.closed ? 1 : 0)).current })
    }
  }

  const getActualLayers = () => {
    const layers = []
    for (let x = 0; x < flatlist.length; x++) {
      const hasChildren = flatlist[x].childrenCount > 0
      const animated = animatedValues.get(flatlist[x].layer.id)?.anim
      layers.push((<LayerViewHolder key={`LayerListItem-${x}`}
        onGroupButtonPress={hasChildren ? (closed: boolean) => {
          Animated.timing(animated, {
            toValue: closed ? 0 : 1,
            duration: 150
          }).start()
        } : (_: boolean) => { }}
        layer={flatlist[x].layer}
        level={flatlist[x].level} />))
      if (!hasChildren) {
        continue
      }
      // render current 
      let next = x
      if (next === flatlist.length) {
        continue
      }
      for (let y = 1; y <= flatlist[x].childrenCount; y++) {
        next = x + y

        let vals = animatedValues.get(flatlist[next].layer.parent)
        if (vals == null) continue
        let { layer, anim } = vals

        while (layer.parent != -1) {
          vals = animatedValues.get(layer.parent)
          if (vals == null) break;
          anim = Animated.add(anim, vals.anim)
          layer = vals.anim
        }

        let callbackAnimatedValue = flatlist[next].childrenCount > 0 ? animatedValues.get(flatlist[next].layer.id)?.anim : null
        layers.push((<LayerViewHolder key={`LayerListItem-${next}`}
          onGroupButtonPress={hasChildren && callbackAnimatedValue ? (closed: boolean) => {
            Animated.timing(callbackAnimatedValue, {
              toValue: closed ? 0 : 1,
              duration: 150
            }).start()
          } : (_: boolean) => { }}
          marginTop={anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -listViewHeight]
          })}
          opacity={anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          })}
          layer={flatlist[next].layer}
          level={flatlist[next].level} />))
      }
      x = next
    }
    return layers
  }

  return (
    <ScrollView style={{ height: height }}>
      {(
        listViewHeight > 0 ? getActualLayers() : (<View onLayout={e => setListViewHeight(e.nativeEvent.layout.height)}>
          <LayerView level={0} layer={new Layer} />
        </View>)
      )}
    </ScrollView>
  )
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