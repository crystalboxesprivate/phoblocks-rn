import { connect } from "react-redux"
import { PhoblocksState } from "../../../../core/application/redux"
import React from 'react'
import { Layer, LayerType, LayerActions } from "../../../../core/application/redux/layer"
import { Animated, ScrollView } from 'react-native'
import LayerView from "./LayerView"
import { DraggableList } from "./DraggableList"
import { DocumentActions } from "../../../../core/application/redux/document"


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

type ParentLayerFuncType = (layerId: number, parentId: number, listPosition?: number | undefined) => {
  type: string;
  layerId: number;
  parentId: number;
  listPosition: number | undefined;
}

type LayersScrollableListProps = {
  entries: Layer[],
  children: number[],
  height: number,
  listHeight: number
  parentLayer: ParentLayerFuncType
}

type LayersScrollableListState = {
  updateId: number
}

export const LayersScrollableList = connect((state: PhoblocksState) => ({
  entries: state.document.layersRegistry.entries,
  children: state.document.layersRegistry.docChildren,
}), { parentLayer: DocumentActions.parentLayer })(
  class extends React.Component<LayersScrollableListProps, LayersScrollableListState>{
    cacheGenerated = false
    animatedValues = new Map<number, { layer: Layer, anim: Animated.Value | any }>()
    generatedCache: LayerViewEntry[] = []
    state = {
      updateId: 0
    }

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

    elems: JSX.Element[] = []
    render() {
      if (!this.cacheGenerated) {
        this.generateCache()
      }

      const setChangeListOrder = (oldIndex: number, newIndex: number) => {
        // get the item of 
        const target = this.generatedCache[oldIndex]
        const oldOb = this.generatedCache[newIndex]

        // check if old object is child of the target
        // this.props.entries


        const isChildOf = (layerId: number, otherLayerId: number) => {
          let parentId = this.props.entries[layerId].parent
          while (parentId != -1) {
            if (parentId == otherLayerId) {
              return true
            }
            parentId = this.props.entries[parentId].parent
          }
          return false
        }


        // invalidate cache
        this.cacheGenerated = false

        this.setState({ updateId: this.state.updateId + 1 })

        if (!target || !oldOb) {
          console.log({ target, oldOb })
          return
        }
        // discard
        if (isChildOf(oldOb.id, target.id)) {
          console.log({ msg: 'discardig', target, oldOb })
          return
        }

        // if the layer with clipping mask goes to the 
        // find out which parent is the oldOb
        // get old object parent
        // this.props.entries[oldOb.id].parent
        const parent = this.props.entries[oldOb.id].parent
        let listPosition = -1
        if (parent == -1) {
          listPosition = this.props.children.indexOf(oldOb.id)
        } else {
          listPosition = this.props.entries[parent].layers.indexOf(oldOb.id)
        }
        this.props.parentLayer(target.id, parent, listPosition)




        console.log({ oldIndex, newIndex })
      }

      return (<ScrollView style={{ height: this.props.height }}>
        <DraggableList isConstantBlockSize={true} setChangeListOrder={setChangeListOrder} key={`list:${this.state.updateId}`} dragStartDelay={500}>
          {(this.generatedCache.map(x => <LayerViewHolder
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
          />))}
        </DraggableList>
      </ScrollView>)
    }
  }
)