import React, { useRef, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TouchableHighlight, TouchableWithoutFeedback, Animated } from "react-native";
import { connect } from "react-redux";
import { PhoblocksState } from "../../core/application/redux";
import { Layer, LayerType, LayerActions } from "../../core/application/redux/layer";
import Theme from '../Theme';
import Svg, { Rect } from "react-native-svg"
import { DocumentActions } from '../../core/application/redux/document';
import { LayerListDisplayMode } from '../../core/application/redux/ui/layerButtons';


// get active layer
// get its parent
// get level
// add navigation

const selectedColor = '#427EE3'

const GroupThumbnailBox = ({ selected }: { selected: boolean }) => (
  <View>
    <View style={[{ backgroundColor: selected ? selectedColor : '#909090' }, styles.layerOuter]}>
      <View style={[{ backgroundColor: selected ? selectedColor : '#E3E3E3' }, styles.layerInner1]}>
        <View style={[styles.layerInner2, styles.groupInnerDimensions]}>
        </View>
      </View>
    </View>
    <View style={{ marginTop: 1, alignItems: 'center' }}>
      <Svg width={56} height={7} viewBox="0 0 56 7" fill="none">
        {React.createElement(Rect, {
          x: 0.5, y: 0.5, width: 55, height: 2, rx: 1,
          ...(selected ? { fill: selectedColor } : { fill: '#e3e3e3', stroke: '#909090' })
        })}
        {React.createElement(Rect, {
          x: 4.5, y: 4.5, width: 47, height: 2, rx: 1,
          ...(selected ? { fill: selectedColor } : { fill: '#e3e3e3', stroke: '#909090' })
        })}
      </Svg>
    </View>
  </View >
)

const LayerThumbnailBox = ({ selected }: { selected: boolean }) => (
  <View style={[{ backgroundColor: selected ? selectedColor : '#909090' }, styles.layerOuter]}>
    <View style={[{ backgroundColor: selected ? selectedColor : '#E3E3E3' }, styles.layerInner1]}>
      <View style={[styles.layerInner2, styles.layerInnerDimensions]}>
      </View>
    </View>
  </View>
)

type LayerThumbnailProps = {
  layer: Layer,
  selected: boolean,
  first: boolean,
  setActive: (id: number) => void
}

const LayerThumbnail = connect(() => ({}), { setActive: DocumentActions.setActiveLayer })(
  ({ layer, selected, first, setActive }: LayerThumbnailProps) => (
    <TouchableWithoutFeedback onPress={() => setActive(layer.id)}>
      <View style={{ marginTop: first ? 0 : 8 }}>
        {layer.type === LayerType.GROUP
          ? <GroupThumbnailBox selected={selected} />
          : <LayerThumbnailBox selected={selected} />}
      </View >
    </TouchableWithoutFeedback>
  ))

type LayersThumbnailsPanelProps = {
  layers: Layer[], level: number, activeLayer: number,
  offset: number, opacity: number, scale: number
}

export const LayersThumbnailsPanel = connect((state: PhoblocksState) => {
  const activeLayer = state.document.layersRegistry.activeLayer
  let parentId = state.document.layersRegistry.entries[activeLayer].parent
  let level = 0
  let children = []
  if (parentId == -1) {
    children = state.document.layersRegistry.docChildren
  } else {
    children = state.document.layersRegistry.entries[parentId].layers
  }
  const layers = children.map(x => state.document.layersRegistry.entries[x])

  while (parentId != -1) {
    parentId = state.document.layersRegistry.entries[parentId].parent
    level++
  }
  return { activeLayer, layers, level }
}, {})(({ layers, activeLayer, offset, opacity, scale }: LayersThumbnailsPanelProps) => (
  <View style={[styles.containerGlobalPosition, {
    transform: [{ scale: scale }],
    opacity: opacity,
    left: Theme.getFullWidth() - Theme.sidebarWidth - offset - containerWidth,
    height: Theme.getFullHeight() - Theme.headerHeight - Theme.getStatusBarHeight(),
  }]}>
    <View style={styles.container}>
      <ScrollView style={[{
        maxHeight:
          Theme.getFullHeight() - Theme.headerHeight - Theme.getStatusBarHeight() - 2 * (containerPadding + containerMargin)
      }]}>
        {[...layers].reverse().map((layer, idx) => <LayerThumbnail
          layer={layer}
          first={idx == 0}
          key={`layer-thumbnail-${idx}`}
          selected={activeLayer === layer.id} />)}
      </ScrollView>
    </View>
  </View>
))


const LayersThumbnailsPanelAnimated2 = Animated.createAnimatedComponent(class extends React.Component<{
  offset: number,
  opacity: number, scale: number
}> {
  render() {
    return this.props.opacity < 0.01 ? null : (
      <LayersThumbnailsPanel offset={this.props.offset} opacity={this.props.opacity} scale={this.props.scale} />
    )
  }
})

export const LayersThumbnailsPanelAnimated = connect((state: PhoblocksState) => ({
  layerThumbnailsOpened: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.Thumbnails,
  layerPropertiesButton: state.ui.layersButtons.layerPropertiesButton
}), {})(({ layerThumbnailsOpened, layerPropertiesButton }) => {
  const animatedValue = useRef(new Animated.Value(layerThumbnailsOpened ? 1 : 0)).current
  const offsetValue = useRef(new Animated.Value(layerPropertiesButton ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: layerThumbnailsOpened ? 1 : 0,
      duration: 100, useNativeDriver: false
    }).start()

    Animated.timing(offsetValue, {
      toValue: layerPropertiesButton ? 1 : 0,
      duration: 100, useNativeDriver: false
    }).start()
  })

  return (
    <LayersThumbnailsPanelAnimated2
      scale={animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] })}
      offset={
        Animated.add(
          animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, containerRightOffset] }),
          offsetValue.interpolate({ inputRange: [0, 1], outputRange: [0, Theme.layersPanelWidth] })
        )}
      opacity={animatedValue} />
  )
})

const containerRightOffset = 19
const containerPadding = 8
const containerMargin = 10
const containerWidth = 80

const styles = StyleSheet.create(
  {
    containerGlobalPosition: {
      position: "absolute",
      top: Theme.headerHeight + Theme.getStatusBarHeight(),
      paddingTop: containerMargin,
      paddingBottom: containerMargin,
      justifyContent: 'center'
    },
    container: {
      padding: containerPadding,
      borderRadius: 7,
      backgroundColor: '#303030'
    },
    layerOuter: {
      borderRadius: 4,
      padding: 1
    },
    layerInner1: {
      borderRadius: 4,
      padding: 2
    },
    layerInner2: {
      backgroundColor: '#ffffff', borderRadius: 2,
    },
    layerInnerDimensions: { width: 58, height: 58 },
    groupInnerDimensions: { width: 58, height: 50 },
  }
)
