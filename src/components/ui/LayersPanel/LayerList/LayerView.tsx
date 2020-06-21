import React, { useRef } from 'react'
import { Layer, LayerType, LayerActions } from '../../../../core/application/redux/layer'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native'
import Icon from '../../../Icon'
import Theme from '../../../Theme'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../../../core/application/redux'
import Svg, { Path } from 'react-native-svg'
import { DocumentActions } from '../../../../core/application/redux/document'

const previewBoxSize = 32

const PreviewBox = ({ selected, image }: { selected: boolean, image?: object }) => (
  <View style={{
    width: previewBoxSize, height: previewBoxSize, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: selected ? '#508CE3' : '#C4C4C4',
    borderRadius: 2,
  }}>
    <View style={{ width: selected ? 26 : 30, height: selected ? 26 : 30, backgroundColor: 'white', borderRadius: selected ? 0 : 2 }}>
    </View>
  </View>
)

type LayerViewProps = {
  layer: Layer,
  level: number,
  selected: boolean,
  maskEditing: boolean,

  onGroupButtonPress?: (a: boolean) => void,

  toggleLayerVisible: (id: number) => void,
  toggleGroupClosed: (id: number) => void
  setLayerActive: (id: number) => void,
  setMaskEditing: (enabled: boolean) => void,
}

const LayerView_ = ({
  layer,
  level,
  selected,
  maskEditing,
  onGroupButtonPress,
  toggleLayerVisible,
  toggleGroupClosed,
  setLayerActive,
  setMaskEditing
}: LayerViewProps) => {
  if (typeof (level) !== 'number') { level = 0 }
  const isGroup = layer.type === LayerType.GROUP
  const clippingMask = layer.clippingMask && !isGroup
  const rotationValue = useRef(new Animated.Value(layer.closed ? 0 : 1)).current

  const GroupToggleButton = Animated.createAnimatedComponent(class extends React.Component<{ rotation: number }>{
    render() {
      return (<Svg width={8} height={6} viewBox="0 0 8 6" fill="none" style={{
        transform: [{ rotate: `${this.props.rotation}deg` }]
      }}><Path d="M8 0H0l4 6 4-6z" fill={Theme.separatorColor} /></Svg>)
    }
  })

  const addStyle = {
    backgroundColor: selected ? Theme.selectedLayer : Theme.panelColor
  }

  return (

    <View style={[addStyle, styles.layerViewContainer]}>
      <View style={[styles.layerInnerContainer, { marginLeft: 16 * level }]}>
        <TouchableWithoutFeedback onPress={() => {
          if (layer.type === LayerType.GROUP) {
            toggleGroupClosed(layer.id)
            if (onGroupButtonPress != null) {
              onGroupButtonPress(layer.closed)
            }
            Animated.timing(rotationValue, { toValue: layer.closed ? 1 : 0, duration: 200 }).start()
          }
        }}>
          <View style={[styles.leftIcon, isGroup ? { minHeight: previewBoxSize } : {}, {
            alignSelf: isGroup ? 'center' : 'flex-end',
            justifyContent: isGroup ? 'center' : 'space-between'
          }]}>

            <View key='spacer' style={{ alignSelf: 'center' }} >
              {isGroup ?
                (<GroupToggleButton rotation={rotationValue.interpolate({ inputRange: [0, 1], outputRange: [-90, 0] })} />)
                : null}
            </View>
            {clippingMask ? (
              <View key='icon-hold' style={styles.iconHold}>
                <Icon name='clippingMask' fill={null} />
              </View>) : null}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
          setLayerActive(layer.id)
          if (maskEditing) { setMaskEditing(false) }
        }}>
          <View>
            <PreviewBox selected={selected && !maskEditing} />
          </View>
        </TouchableWithoutFeedback>
        {layer.mask ?
          [<View key={'layerDot'} style={styles.layerDot}>
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
      <Text style={[styles.layerTitle, { color: layer.visible ? Theme.textBright0 : Theme.textDisabledLayer }]}>
        {layer.name}
      </Text>
      <TouchableWithoutFeedback onPress={() => toggleLayerVisible(layer.id)}>
        <View style={styles.eye}>{
          layer.visible
            ? <Icon fill='#6B6B6B' name='eye' />
            : <Icon name='eyeCrossed' fill={null} />
        }</View>
      </TouchableWithoutFeedback>
    </View>
  )
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

const styles = StyleSheet.create({
  layerViewContainer: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  layerInnerContainer: {
    flexDirection: 'row', alignItems: 'center',
  },
  leftIcon: {
    width: 25,
    flexDirection: 'row',
  },
  layerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C4C4C4',
    marginRight: 3,
    marginLeft: 3,
  },
  layerTitle: {
    ...Theme.getFont(14),
    marginLeft: 7,
    flexGrow: 4
  },
  iconHold: { marginRight: 6 },
  eye: { marginRight: 6, paddingLeft: 30 }
})

export default LayerView