import React, { useRef, useMemo } from 'react'
import { View, Text, StyleProp, ViewStyle, ScrollView } from 'react-native'
import { styles } from './Styling'
import LayerView from './LayerView'
import { Layer, LayerType } from '../../../core/application/redux/layer'
import { useSelector } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'

type ListItemDescription = {
  id: number
  level: number
}

const getFlatList = (layers: Layer[], children: number[], level: number) => {
  if (level == 0) { console.log('generating layer list....') }
  const outLayers: ListItemDescription[] = []
  for (let x = children.length - 1; x >= 0; x--) {
    const layer = layers[children[x]]

    outLayers.push({ id: layer.id, level })
    if (layer.type === LayerType.GROUP) {
      outLayers.push(...getFlatList(layers, layer.layers, level + 1))
    }
  }
  return outLayers
}

const OrderListContainer = ({ itemHeight }: { itemHeight: number }) => {
  const entries = useSelector((state: PhoblocksState) => state.document.layersRegistry.entries)
  const children = useSelector((state: PhoblocksState) => state.document.layersRegistry.docChildren)
  const hierarchyChangeId = useSelector((state: PhoblocksState) => state.document.layersRegistry.hierarchyChangeId)
  const flatList = useMemo(() => getFlatList(entries, children, 0), [hierarchyChangeId])

  return (<View>
    {flatList.map(x => <LayerView id={x.id} level={x.level} key={`layerView:${x.id}`} />)}
  </View>)
}

export const LayersList = ({ style, itemHeight }: { itemHeight: number, style?: StyleProp<ViewStyle> }) => (
  <View style={styles.layersList}>
    <Text style={styles.layersListTitle}>Layers</Text>
    <ScrollView>
      <OrderListContainer {...{ itemHeight }} />
    </ScrollView>
  </View >
)
