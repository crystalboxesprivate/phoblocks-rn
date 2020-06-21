import React, { useState, useEffect, useRef } from 'react'
import { View, Animated, Text } from 'react-native'
import LayerProperties from './LayerProperties'
import { PhoblocksState } from '../../../core/application/redux'
import { LayersListAnimated } from './LayerList'
import { LayersPanelStyles } from './LayersPanelStyles'
import LayerView from './LayerList/LayerView'
import { Layer } from '../../../core/application/redux/layer'
import { connect } from 'react-redux'
import { LayerListDisplayMode, UIAction } from '../../../core/application/redux/ui'
import { LayersThumbnailsPanelAnimated } from './LayersThumbnailsPanel'
import { Events } from '../../../core/events'

type LayersPanelProps = {
  listVisible: boolean,
  propertiesVisible: boolean,
  divisor: number,
  setDivisor: (amount: number) => {
    type: string;
    amount: number;
  }
}

export const LayersPanel = connect((state: PhoblocksState) => ({
  listVisible: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.List,
  propertiesVisible: state.ui.layersButtons.layerPropertiesButton,
  divisor: state.ui.layersButtons.layerListSplitPosition
}), {
  setDivisor: UIAction.setLayerListSplitPosition
})(
  ({ listVisible, propertiesVisible, divisor, setDivisor }: LayersPanelProps) => {
    const [measures, setMeasures] = useState({ measured: false, layoutHeight: 0, layersTitleHeight: 0, scrollListHeight: 0 })
    const layoutContainer: any = useRef(null)
    const titleContainer: any = useRef(null)
    const listItemContainer: any = useRef(null)

    const isVisible = listVisible || propertiesVisible
    const opacityAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current
    const propsHeightAnim = useRef(new Animated.Value(0)).current

    let div = 0
    const onTitleDragStart = () => {
      div = divisor
    }
    const onTitleDragMove = (e: any) => {
      propsHeightAnim.setValue(div + e / measures.layoutHeight)
    }
    const onTitleDragRelease = (e: any) => { setDivisor(div + e / measures.layoutHeight) }

    const cleanup = () => {
      Events.removeListener('LayerDragTitleStart', onTitleDragStart)
      Events.removeListener('LayerDragTitleMove', onTitleDragMove)
      Events.removeListener('LayerDragTitleEnd', onTitleDragRelease)
    }

    useEffect(() => {
      if (!measures.measured) {
        measures.measured = true
        setMeasures(measures)
        return
      }

      Events.addListener('LayerDragTitleStart', onTitleDragStart)
      Events.addListener('LayerDragTitleMove', onTitleDragMove)
      Events.addListener('LayerDragTitleEnd', onTitleDragRelease)

      Animated.timing(opacityAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 200
      }).start()


      Animated.timing(propsHeightAnim, {
        toValue: propertiesVisible
          ? listVisible
            ? divisor
            : 0
          : listVisible
            ? 1
            : 0,
        duration: 300
      }).start()

      return cleanup
    })

    if (!measures.measured) {
      return (<View style={[LayersPanelStyles.container, { opacity: 0 }]} ref={layoutContainer}
        onLayout={(e) => {
          measures.layoutHeight = e.nativeEvent.layout.height
        }}
      >
        <View
          style={[LayersPanelStyles.layersList]}
          ref={titleContainer}
          onLayout={(e) => {
            measures.layersTitleHeight = e.nativeEvent.layout.height
          }}
        >
          <Text style={LayersPanelStyles.layersListTitle}>Layers</Text>
        </View>
        <View style={[LayersPanelStyles.layersList]} >
          <Text style={LayersPanelStyles.layersListTitle}>Layers</Text>
          <View ref={listItemContainer}
            onLayout={(e) => {
              measures.scrollListHeight = e.nativeEvent.layout.height
            }}
          >
            <LayerView
              layer={new Layer()}
              level={0}
            />
          </View>
        </View>
      </View >)
    }

    if ((opacityAnim as unknown as number) < 0.001) {
      return null
    }

    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <View style={LayersPanelStyles.container} >
          <LayersListAnimated
            listHeight={measures.scrollListHeight}
            layoutHeight={measures.layoutHeight}
            availableHeight={propsHeightAnim.interpolate(
              { inputRange: [0, 1], outputRange: [0, measures.layoutHeight] }
            )} />
          {propertiesVisible ? <LayerProperties /> : null}
        </View>
      </Animated.View>
    )
  }
)

export const LayersThumbnailsPanel = LayersThumbnailsPanelAnimated