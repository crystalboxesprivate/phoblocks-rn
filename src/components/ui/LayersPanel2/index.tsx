import React, { useRef, useEffect } from 'react'
import { View, Text, Animated, Platform } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { styles } from './Styling'
import { useLayout } from '../../Hooks'
import LayerView from '../LayersPanel/LayerList/LayerView'
import { Layer } from '../../../core/application/redux/layer'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import { LayerListDisplayMode } from '../../../core/application/redux/ui/layerButtons'
import { UIAction } from '../../../core/application/redux/ui'

import Theme from '../../Theme'

import { Styles } from '../Styles'
import { LayerProperties } from './LayerProperties'
import { LayersList } from './LayersList'

type LayerDragTitleProps = {
  totalHeight: number
  listVisible: boolean
  divisor: number
  setDivisor: any
  setDivisorCommit: any
  canDrag: boolean
}

const LayerDragTitle = ({ totalHeight, canDrag, listVisible, divisor, setDivisor, setDivisorCommit }: LayerDragTitleProps) => {
  const opacityAnim = useRef(new Animated.Value(listVisible ? 1 : 0)).current
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: listVisible ? 1 : 0, duration: 100 }).start()
  })
  const divisorStart = useRef({ divisor, posY: 0, down: false }).current
  return (
    <View
      style={{ backgroundColor: Theme.panelColor }}
      onStartShouldSetResponder={_ => true}
      onResponderGrant={e => {
        if (!canDrag) { return }
        divisorStart.down = true
        divisorStart.divisor = divisor
        divisorStart.posY = e.nativeEvent.pageY
      }}
      onResponderMove={e => {
        if (!divisorStart.down) { return }
        setDivisor(divisorStart.divisor +
          (e.nativeEvent.pageY - divisorStart.posY) / totalHeight)
      }}
      onResponderRelease={e => {
        setDivisorCommit(divisorStart.divisor +
          (e.nativeEvent.pageY - divisorStart.posY) / totalHeight)
        divisorStart.down = false
      }}>
      <View style={styles.layerDragTitle}>
        <Animated.View style={{ opacity: opacityAnim }}>
          <Svg width={30} height={4} viewBox="0 0 30 4" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 2a2 2 0 012-2h26a2 2 0 110 4H2a2 2 0 01-2-2z"
              fill="#6E6E6E"
            />
          </Svg>
        </Animated.View>
      </View>
      <Text style={[{ marginLeft: 15 }, Styles.font16]}>Layer Properties</Text>
    </View>
  )
}

type LayersPanelMeasureBlockProps = {
  onLayout: any,
  onTitleLayout: any,
  onItemListLayout: any
}

const LayersPanelMeasureBlock = ({ onLayout, onTitleLayout, onItemListLayout }: LayersPanelMeasureBlockProps) => {
  return (<View style={[styles.layersPanel, { top: 2000 }]} onLayout={onLayout}>
    <View style={styles.layersList} onLayout={onTitleLayout}>
      <Text style={styles.layersListTitle}>Layers</Text>
    </View>
    <View style={styles.layersList}>
      <Text style={styles.layersListTitle}>Layers</Text>
      <View onLayout={onItemListLayout}>
        <LayerView layer={new Layer} level={0} />
      </View>
    </View>
  </View>)
}

export const LayersPanel2 = () => {
  const [layout, onLayout] = useLayout()
  const [titleLayout, onTitleLayout] = useLayout()
  const [itemListLayout, onItemListLayout] = useLayout()

  const divisor = useSelector((state: PhoblocksState) => state.ui.layersButtons.layerListSplitPosition)
  const dispatch = useDispatch()

  const propertiesVisible = useSelector((state: PhoblocksState) => state.ui.layersButtons.layerPropertiesButton)
  const listVisible = useSelector((state: PhoblocksState) => state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.List)

  const isVisible = propertiesVisible || listVisible
  const visibilityAnimation = useRef(new Animated.Value(isVisible ? 1 : 0)).current
  const previousVisibilityState = useRef({ isVisible, listVisible, propertiesVisible }).current

  const getDivisorToValue = () => (listVisible
    ? propertiesVisible
      ? divisor
      : 1
    : 0)
  const divisorAnimation = useRef(new Animated.Value(getDivisorToValue())).current
  const setDivisorCommit = (amount: number) => dispatch(UIAction.setLayerListSplitPosition(amount))
  const setDivisor = (amount: number) => divisorAnimation.setValue(amount)
  const canDrag = listVisible

  useEffect(() => {
    const visiblityToValue = isVisible ? 1 : 0
    if (previousVisibilityState.listVisible && !previousVisibilityState.propertiesVisible && !listVisible && !propertiesVisible) {
    } else {
      Animated.timing(divisorAnimation, { toValue: getDivisorToValue(), duration: 200 }).start()
    }
    Animated.timing(visibilityAnimation, { toValue: visiblityToValue, duration: 200 }).start()

    previousVisibilityState.isVisible = isVisible
    previousVisibilityState.listVisible = listVisible
    previousVisibilityState.propertiesVisible = propertiesVisible
  })

  if (!layout || !titleLayout || !itemListLayout) {
    return <LayersPanelMeasureBlock {...{
      onLayout,
      onTitleLayout,
      onItemListLayout
    }} />
  }

  const panelTop = Theme.headerHeight + Theme.getStatusBarHeight()

  return (<Animated.View style={[styles.layersPanel, {
    opacity: visibilityAnimation, top: visibilityAnimation.interpolate({
      inputRange: [0, .01], outputRange: [panelTop + layout.height, panelTop],
      extrapolate: 'clamp'
    })
  }]}>
    <Animated.View style={{
      height: divisorAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, layout.height] }),
      opacity: divisorAnimation.interpolate({ inputRange: [0, .01], outputRange: [0, 1], extrapolate: 'clamp' })
    }} >
      {/* TODO fix the ios bug in getting the correct height  */}
      <LayersList itemHeight={Platform.OS === 'ios' ? 44 : itemListLayout.height} />
    </Animated.View>
    <Animated.View style={{
      height: divisorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [layout.height, 0]
      })
    }}>
      <LayerDragTitle {...{ divisor, setDivisor, setDivisorCommit, totalHeight: layout.height, listVisible, canDrag }} />
      <LayerProperties />
    </Animated.View>
  </Animated.View>)
}
