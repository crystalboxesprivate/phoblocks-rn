import React, { useState, useEffect, useRef } from 'react'
import { View, Animated, Text } from 'react-native'
import LayerProperties from './LayerProperties'
import { PhoblocksState } from '../../../core/application/redux'
import { LayersListAnimated } from './LayerList'
import { LayersPanelStyles } from './LayersPanelStyles'
import LayerView from './LayerList/LayerView'
import { Layer } from '../../../core/application/redux/layer'
import { connect, useDispatch, useSelector } from 'react-redux'
import { LayerListDisplayMode, UIAction } from '../../../core/application/redux/ui'
import { LayersThumbnailsPanelAnimated } from '../LayersThumbnailsPanel'
import { Events } from '../../../core/events'
import { useLayout } from '../../Hooks'
import { Styles } from '../Styles'
import { overlayLog } from '../../DebugOverlay'

type LayersPanelProps = {
  listVisible: boolean,
  propertiesVisible: boolean,
  divisor: number,
  setDivisor: (amount: number) => {
    type: string;
    amount: number;
  }
}

const LayersPanelMeasureBlock = ({ onLayout, onTitleLayout, onItemListLayout }: { onLayout: any, onTitleLayout: any, onItemListLayout: any }) => {
  return (<View style={LayersPanelStyles.container} onLayout={onLayout}>
    <View style={LayersPanelStyles.layersList} onLayout={onTitleLayout}>
      <Text style={LayersPanelStyles.layersListTitle}>Layers</Text>
    </View>
    <View style={LayersPanelStyles.layersList}>
      <Text style={LayersPanelStyles.layersListTitle}>Layers</Text>
      <View onLayout={onItemListLayout}>
        <LayerView layer={new Layer()} level={0} />
      </View>
    </View>
  </View>)
}

const useDivisor = (totalHeight: number): [Animated.Value, number] => {
  const dispatch = useDispatch()
  const setDivisor = (amount: number) => dispatch(UIAction.setLayerListSplitPosition(amount))

  const divisor = useSelector((state: PhoblocksState) => state.ui.layersButtons.layerListSplitPosition)

  const propsHeightAnim = useRef(new Animated.Value(0)).current

  let div = -1
  const onTitleDragStart = () => { div = divisor }
  const onTitleDragMove = (e: any) => { propsHeightAnim.setValue(div + e / totalHeight) }
  const onTitleDragRelease = (e: any) => { setDivisor(div + e / totalHeight) }

  useEffect(() => {
    Events.addListener('LayerDragTitleStart', onTitleDragStart)
    Events.addListener('LayerDragTitleMove', onTitleDragMove)
    Events.addListener('LayerDragTitleEnd', onTitleDragRelease)

    return () => {
      Events.removeListener('LayerDragTitleStart', onTitleDragStart)
      Events.removeListener('LayerDragTitleMove', onTitleDragMove)
      Events.removeListener('LayerDragTitleEnd', onTitleDragRelease)
    }
  })

  return [propsHeightAnim, divisor]
}

export const LayersPanel = () => {
  const [layout, onLayout] = useLayout()
  const [titleLayout, onTitleLayout] = useLayout()
  const [itemListLayout, onItemListLayout] = useLayout()
  const [propsHeightAnim, divisor] = useDivisor(layout?.height || 1)

  const { listVisible, propertiesVisible } = useSelector((state: PhoblocksState) => ({
    listVisible: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.List,
    propertiesVisible: state.ui.layersButtons.layerPropertiesButton,
  }))
  const isVisible = listVisible || propertiesVisible
  const opacityAnim = useRef(new Animated.Value(isVisible ? 0 : 1)).current

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 200
    }).start()

    const toValue = propertiesVisible
      ? listVisible
        ? divisor
        : 0
      : listVisible
        ? 1
        : 0
    Animated.timing(propsHeightAnim, {
      toValue,
      duration: 300
    }).start()

  })

  if (!layout || !titleLayout || !itemListLayout) {
    return <LayersPanelMeasureBlock {...{ onLayout, onTitleLayout, onItemListLayout }} />
  }

  if (!isVisible) {
    return null
  }
  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <View style={LayersPanelStyles.container} >
        <LayersListAnimated
          listHeight={itemListLayout.height}
          layoutHeight={layout.height}
          availableHeight={layout.height
            // propsHeightAnim.interpolate(
            // { inputRange: [0, 1], outputRange: [0, layout.height] })
          } />
        {propertiesVisible ? <LayerProperties /> : null}
      </View>
    </Animated.View>
  )
}


export const LayersPanel2 = connect((state: PhoblocksState) => ({
  listVisible: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.List,
  propertiesVisible: state.ui.layersButtons.layerPropertiesButton,
  divisor: state.ui.layersButtons.layerListSplitPosition
}), {
  setDivisor: UIAction.setLayerListSplitPosition
})(
  ({ listVisible, propertiesVisible, divisor, setDivisor }: LayersPanelProps) => {
    const [measures, setMeasures] = useState({ layoutHeight: 0, layersTitleHeight: 0, scrollListHeight: 0 })
    const [layoutMeasured, setLayoutMeasured] = useState(false)
    const layoutContainer: any = useRef(null)
    const titleContainer: any = useRef(null)
    const listItemContainer: any = useRef(null)

    const isVisible = listVisible || propertiesVisible
    const opacityAnim = useRef(new Animated.Value(isVisible ? 0 : 1)).current
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
      if (!layoutMeasured) {
        return
      }
      const newMeasures = { ...measures }
      setMeasures(newMeasures)
    }, [layoutMeasured])

    useEffect(() => {
      Events.addListener('LayerDragTitleStart', onTitleDragStart)
      Events.addListener('LayerDragTitleMove', onTitleDragMove)
      Events.addListener('LayerDragTitleEnd', onTitleDragRelease)

      Animated.timing(opacityAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 200
      }).start()

      const toValue = propertiesVisible
        ? listVisible
          ? divisor
          : 0
        : listVisible
          ? 1
          : 0
      Animated.timing(propsHeightAnim, {
        toValue,
        duration: 300
      }).start()

      return cleanup
    })


    if (!layoutMeasured) {
      return (<View style={[LayersPanelStyles.container, { opacity: 0 }]} ref={layoutContainer}
        onLayout={(e) => {
          measures.layoutHeight = e.nativeEvent.layout.height
          setLayoutMeasured(true)
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


    const isHidden = (opacityAnim as unknown as number) < 0.001

    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <View style={isHidden ? {} : LayersPanelStyles.container} >
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