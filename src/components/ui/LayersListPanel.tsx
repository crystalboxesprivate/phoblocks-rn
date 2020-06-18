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
  layer: Layer, level: number, onGroupButtonPress?: (a: boolean) => void, marginTop?: number, opacity?: number,
}


const LayerViewHolder = Animated.createAnimatedComponent(class extends React.Component<LayersListProps> {
  render() {
    const opacity = this.props.opacity == null ? 1.0 : this.props.opacity
    return (opacity < 0.001 ? null : <Animated.View style={{
      marginTop: this.props.marginTop || 0, opacity: opacity
    }}><LayerView
        onGroupButtonPress={this.props.onGroupButtonPress}
        layer={this.props.layer}
        level={this.props.level} /></Animated.View>)
  }
})

type LayerViewEntry = {
  key: string,
  onGroupButtonPress?: any,
  id: number,
  level: number,
  anim: any,
}

type LayersListPanelProps = {
  initialHeight: number,
  style: object,
  entries: Layer[],
  children: number[],
}

class _LayersListPanel extends React.Component<LayersListPanelProps, { height: number, listHeight: number }> {
  constructor(props: LayersListPanelProps) {
    super(props)
    this.state = { height: this.props.initialHeight, listHeight: 0 }
  }

  startHeight = 0
  cacheGenerated = false

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
  animatedValues = new Map<number, { layer: Layer, anim: Animated.Value | any }>()
  generatedCache: LayerViewEntry[] = []

  generateCache() {
    const flatlist = getFlatLayerList(this.props.entries, this.props.children, 0)
    this.animatedValues = new Map<number, { layer: Layer, anim: any }>()
    const animationDuration = 150

    this.generatedCache = []

    for (let l of flatlist) {
      if (l.childrenCount > 0) {
        this.animatedValues.set(l.layer.id, { layer: l.layer, anim: new Animated.Value(l.layer.closed ? 1 : 0) })
      }
    }

    for (let x = 0; x < flatlist.length; x++) {
      const hasChildren = flatlist[x].childrenCount > 0
      const animated = this.animatedValues.get(flatlist[x].layer.id)?.anim
      this.generatedCache.push(
        {
          key: `LayerListItem-${x}`,
          onGroupButtonPress: hasChildren ? (closed: boolean) => {
            Animated.timing(animated, {
              toValue: closed ? 0 : 1,
              duration: animationDuration
            }).start()
          } : (_: boolean) => { },
          id: flatlist[x].layer.id,
          level: flatlist[x].level,
          anim: null
        })
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

        let vals = this.animatedValues.get(flatlist[next].layer.parent)
        if (vals == null) continue
        let { layer, anim } = vals

        while (layer.parent != -1) {
          vals = this.animatedValues.get(layer.parent)
          if (vals == null) break;
          anim = Animated.add(anim, vals.anim)
          layer = vals.anim
        }

        let callbackAnimatedValue = flatlist[next].childrenCount > 0 ? this.animatedValues.get(flatlist[next].layer.id)?.anim : null
        this.generatedCache.push(
          {
            key: `LayerListItem-${next}`,
            onGroupButtonPress: (hasChildren && callbackAnimatedValue ? (closed: boolean) => {
              Animated.timing(callbackAnimatedValue, {
                toValue: closed ? 0 : 1,
                duration: animationDuration
              }).start()
            } : (_: boolean) => { }),
            anim,
            id: flatlist[next].layer.id,
            level: flatlist[next].level
          })
      }
      x = next
    }
    this.cacheGenerated = true
  }

  render() {
    if (!this.cacheGenerated && this.state.listHeight != 0) {
      this.generateCache()
    }

    return (this.state.height < 5) ? null
      : (
        <View key='layers' style={[styles.layersList, {
          height: this.state.height,
          ...this.props.style
        }]}>
          {this.state.height > 20 ? (<Text style={styles.layersListTitle}>Layers</Text>) : null}
          {this.state.height > 45 ?
            this.state.listHeight == 0
              ? (
                <ScrollView style={{ height: this.state.height }}>
                  <View onLayout={e => this.setState({ listHeight: e.nativeEvent.layout.height })}>
                    <LayerView level={0} layer={new Layer()} />
                  </View>
                </ScrollView>
              )
              : <ScrollView style={{ height: this.state.height }}>
                {this.generatedCache.map(x => <LayerViewHolder
                  onGroupButtonPress={x.onGroupButtonPress}
                  key={x.key}
                  layer={this.props.entries[x.id]}
                  level={x.level}
                  marginTop={x.anim ? x.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -this.state.listHeight]
                  }) : 0}
                  opacity={x.anim ? x.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  }) : 1}
                />)}
              </ScrollView>
            : null}
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