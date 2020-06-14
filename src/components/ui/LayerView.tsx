import React from 'react'
import { ILayer, Layer, ILayerHolder } from '../../core/application/layer'
import { View, Text } from 'react-native'
import Icon from '../Icon'
import Theme from '../Theme'

const LayerView = ({ layer, selected, maskEditing, level }: {
  layer: ILayer, selected: boolean, maskEditing: boolean, level: number
}) => {
  if (typeof (level) !== 'number') {
    level = 0
  }
  const PreviewBox = ({ selected, image }: { selected: boolean, image?: object }) => (
    <View style={{
      width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: selected ? '#508CE3' : '#C4C4C4',
      borderRadius: 2,
    }}>
      <View style={{ width: selected ? 26 : 30, height: selected ? 26 : 30, backgroundColor: 'white', borderRadius: selected ? 0 : 2 }}>
      </View>
    </View>
  )
  const clippingMask = (() => {
    if ('clippingMask' in layer) {
      return (layer as Layer).clippingMask
    } else {
      return false
    }
  })()

  const isGroup = 'layers' in layer
  return (
    <View style={{
      flex: 1, flexDirection: 'row',
      paddingTop: 6,
      paddingBottom: 6,
      alignItems: 'center',
      ...(selected ? { backgroundColor: '#353F4C' } : {})
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center', marginLeft: 16 * level
      }}>
        <View style={{
          width: 25,
          flexDirection: 'row',
          alignSelf: isGroup ? 'center' : 'flex-end',
          justifyContent: isGroup ? 'center' : 'space-between'
        }}>
          <View key='spacer' style={{
            transform: [{
              rotate: `${(layer as unknown as ILayerHolder).closed ? -90 : 0}deg`
            }]
          }}>
            {isGroup ? <Icon name='groupTriangle' fill={null} /> : null}
          </View>
          {clippingMask ? (
            <View key='icon-hold' style={{ marginRight: 6 }}>
              <Icon name='clippingMask' fill={null} />
            </View>) : null}
        </View>
        <PreviewBox selected={selected && !maskEditing} />
        {layer.mask ?
          [<View key={'layerDot'} style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: '#C4C4C4',
            marginRight: 3,
            marginLeft: 3,
          }}>
          </View>,
          <PreviewBox selected={selected && maskEditing} key={'maskPreview'} />] : null}
      </View>
      <Text style={[Theme.getFont(14), {
        color: layer.visible ? Theme.textBright0 : '#6E6E6E',
        marginLeft: 7,
        flexGrow: 4
      }]}>{layer.name}</Text>
      <View style={{ marginRight: 6 }}>{
        layer.visible ? <Icon fill='#6B6B6B' name='eye' /> : <Icon name='eyeCrossed' fill={null} />
      }</View>
    </View >)
}

export default LayerView