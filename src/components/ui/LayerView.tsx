import React from 'react'
import { Layer, LayerType, LayerActions } from '../../core/application/redux/layer'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import Icon from '../Icon'
import Theme from '../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { overlayLog } from '../DebugOverlay'
import Svg, { Path } from 'react-native-svg'
import { DocumentActions } from '../../core/application/redux/document'

const PreviewBox = ({ selected, image }: { selected: boolean, image?: object }) => (
  <View style={{
    width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: selected ? '#508CE3' : '#C4C4C4',
    borderRadius: 2,
  }}>
    <View style={{ width: selected ? 26 : 30, height: selected ? 26 : 30, backgroundColor: 'white', borderRadius: selected ? 0 : 2 }}>
    </View>
  </View>
)

const LayerView_ = ({
  layer,
  level,
  selected,
  maskEditing,
  toggleLayerVisible,
  toggleGroupClosed,
  setLayerActive,
  setMaskEditing
}: {
  layer: Layer,
  level: number,
  selected: boolean,
  maskEditing: boolean,
  toggleLayerVisible: (id: number) => void,
  toggleGroupClosed: (id: number) => void
  setLayerActive: (id: number) => void,
  setMaskEditing: (enabled: boolean) => void,
}) => {
  if (typeof (level) !== 'number') {
    level = 0
  }
  const clippingMask = (() => {
    if ('clippingMask' in layer) {
      return (layer as Layer).clippingMask
    } else {
      return false
    }
  })()

  const isGroup = layer.type === LayerType.GROUP
  return (
    <TouchableWithoutFeedback onPress={() => {
      setLayerActive(layer.id)
      if (maskEditing) {
        setMaskEditing(false)
      }
    }}>
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
          <TouchableWithoutFeedback onPress={() => {
            if (layer.type === LayerType.GROUP) {
              toggleGroupClosed(layer.id)
            }
          }}>
            <View style={{
              width: 25,
              flexDirection: 'row',
              alignSelf: isGroup ? 'center' : 'flex-end',
              justifyContent: isGroup ? 'center' : 'space-between'
            }}>
              <View key='spacer' >
                {isGroup ?
                  (<Svg width={8} height={6} viewBox="0 0 8 6" fill="none" style={{
                    transform: [{
                      rotate: `${layer.closed ? -90 : 0}deg`
                    }]
                  }}>
                    <Path d="M8 0H0l4 6 4-6z" fill="#B9B9B9" />
                  </Svg>)
                  : null}
              </View>
              {clippingMask ? (
                <View key='icon-hold' style={{ marginRight: 6 }}>
                  <Icon name='clippingMask' fill={null} />
                </View>) : null}
            </View>
          </TouchableWithoutFeedback>

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
            <TouchableWithoutFeedback key={'maskPreview'} onPress={() => {
              setLayerActive(layer.id)
              setMaskEditing(true)
            }}>
              <View>
                <PreviewBox selected={selected && maskEditing} />
              </View>
            </TouchableWithoutFeedback>] : null}
        </View>
        <Text style={[Theme.getFont(14), {
          color: layer.visible ? Theme.textBright0 : '#6E6E6E',
          marginLeft: 7,
          flexGrow: 4
        }]}>{layer.name}</Text>
        <TouchableWithoutFeedback onPress={() => {
          toggleLayerVisible(layer.id)
        }}>
          <View style={{ marginRight: 6, paddingLeft: 30 }}>{
            layer.visible
              ? <Icon fill='#6B6B6B' name='eye' />
              : <Icon name='eyeCrossed' fill={null} />
          }</View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>)
}

const LayerView = connect((state: PhoblocksState, ownProps: any) => ({
  layer: ownProps.layer as Layer,
  level: ownProps.level as number,
  selected: state.document.activeLayer === (ownProps.layer as Layer).id,
  maskEditing: state.document.maskEditing
}), {
  toggleLayerVisible: LayerActions.toggleVisible,
  toggleGroupClosed: LayerActions.toggleGroupClosed,
  setLayerActive: DocumentActions.setActiveLayer,
  setMaskEditing: DocumentActions.setMaskEditing
})(LayerView_)

export default LayerView