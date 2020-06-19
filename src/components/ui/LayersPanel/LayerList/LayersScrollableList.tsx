import { connect } from "react-redux"
import { PhoblocksState } from "../../../../core/application/redux"
import React from 'react'
import { Layer, LayerType } from "../../../../core/application/redux/layer"
import { Animated, ScrollView } from 'react-native'
import LayerView from "./LayerView"


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

type LayerViewHolderProps = {
  layer: Layer,
  level: number, onGroupButtonPress?: (a: boolean) => void,
  marginTop?: number,
  opacity?: number,
}

const LayerViewHolder = Animated.createAnimatedComponent(class extends React.Component<LayerViewHolderProps> {
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

type LayersScrollableListProps = {
  entries: Layer[],
  children: number[],
  height: number,
  listHeight: number
}

export const LayersScrollableList = connect((state: PhoblocksState) => ({
  entries: state.document.layersRegistry.entries,
  children: state.document.layersRegistry.docChildren,
}), {})(
  class extends React.Component<LayersScrollableListProps>{
    cacheGenerated = false
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

      for (let flatListIndex = 0; flatListIndex < flatlist.length; flatListIndex++) {
        const hasChildren = flatlist[flatListIndex].childrenCount > 0
        const animated = this.animatedValues.get(flatlist[flatListIndex].layer.id)?.anim
        this.generatedCache.push(
          {
            key: `LayerListItem-${flatListIndex}`,
            onGroupButtonPress: hasChildren ? (closed: boolean) => {
              Animated.timing(animated, {
                toValue: closed ? 0 : 1,
                duration: animationDuration
              }).start()
            } : (_: boolean) => { },
            id: flatlist[flatListIndex].layer.id,
            level: flatlist[flatListIndex].level,
            anim: null
          })
        if (!hasChildren) {
          continue
        }
        // render current 
        let next = flatListIndex
        if (next === flatlist.length) {
          continue
        }
        for (let childIndex = 1;
          childIndex <= flatlist[flatListIndex].childrenCount; childIndex++) {
          next = flatListIndex + childIndex

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
        flatListIndex = next
      }
      this.cacheGenerated = true
    }
    render() {
      if (!this.cacheGenerated) {
        this.generateCache()
      }
      return (<ScrollView style={{ height: this.props.height }}>
        {this.generatedCache.map(x => <LayerViewHolder
          onGroupButtonPress={x.onGroupButtonPress}
          key={x.key}
          layer={this.props.entries[x.id]}
          level={x.level}
          marginTop={x.anim ? x.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -this.props.listHeight]
          }) : 0}
          opacity={x.anim ? x.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }) : 1}
        />)}
      </ScrollView>)
    }

  }
)