import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native'
import Header from './ui/Header'
import Theme from './Theme'
import Toolbar from './ui/Toolbar'
import LayersToolbar from './ui/LayersToolbar'
import { LayersPanel } from './ui/LayersPanel'
import { LayersThumbnailsPanel } from './ui/LayersThumbnailsPanel'
import { PhoblocksState } from '../core/application/redux';
import { connect } from 'react-redux';
import { LayerListDisplayMode } from '../core/application/redux/ui';
import { Layer } from '../core/application/redux/layer';


type UILayoutProps = {

}

const UILayout = ({ }: UILayoutProps) => {
  return (<View style={{
    position: 'absolute',
    top: Theme.getStatusBarHeight(),
    left: 0,
  }}>
    <Header />
    <Toolbar />
    <LayersToolbar />

    <LayersPanelAnimated />
    <LayersThumbnailsPanelAnimated />
  </View>)

}


const LayersPanelAnimated = connect((state: PhoblocksState) => ({
  listVisible: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.List,
  propertiesVisible: state.ui.layersButtons.layerPropertiesButton
}), {})(({ listVisible, propertiesVisible }) => {
  return (
    <LayersPanel
      listVisible={listVisible}
      propertiesVisible={propertiesVisible} />
  )
})
const containerRightOffset = 19

const LayersThumbnailsPanelAnimated2 = Animated.createAnimatedComponent(class extends React.Component<{
  offset: number,
  opacity: number, scale: number
}> {
  render() {
    console.log(this.props.offset)
    return this.props.opacity < 0.01 ? null : (
      <LayersThumbnailsPanel offset={this.props.offset} opacity={this.props.opacity} scale={this.props.scale} />
    )
  }
})
const LayersThumbnailsPanelAnimated = connect((state: PhoblocksState) => ({
  layerThumbnailsOpened: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.Thumbnails,
  layerPropertiesButton: state.ui.layersButtons.layerPropertiesButton
}), {})(({ layerThumbnailsOpened, layerPropertiesButton }) => {
  const animatedValue = useRef(new Animated.Value(layerThumbnailsOpened ? 1 : 0)).current
  const offsetValue = useRef(new Animated.Value(layerPropertiesButton ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: layerThumbnailsOpened ? 1 : 0,
      duration: 100
    }).start()

    Animated.timing(offsetValue, {
      toValue: layerPropertiesButton ? 1 : 0,
      duration: 100
    }).start()
  })

  const getContainerOffset = () => containerRightOffset + (layerPropertiesButton ? Theme.layersPanelWidth : 0)


  console.log({ layerThumbnailsOpened })

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

export default UILayout
