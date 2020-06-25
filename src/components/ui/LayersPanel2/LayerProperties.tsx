import Theme from '../../Theme'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import Slider, { SliderProps } from '../Slider'
import { LayerActions } from '../../../core/application/redux/layer'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import React, { useState, useRef } from 'react'
import { Events } from '../../../core/events'
import { Styles } from '../Styles'
import { ButtonBody } from '../DropdownList'
import { BlendingModeSelect } from '../BlendingModeSelect'
import { overlayLog } from '../../DebugOverlay'
import { createSelector } from 'reselect'

const AnimatedCollapseIcon = Animated.createAnimatedComponent(class extends React.Component<{ rotation: number }, {}> {
  render = () => {
    return (
      <Svg style={{
        transform: [{ rotate: `${this.props.rotation}deg` }],
        marginRight: 8.5
      }} width={11} height={7} viewBox="0 0 11 7" fill="none">
        <Path d="M1.5 1l4 4 4-4" stroke="#B9B9B9" />
      </Svg>
    )
  }
})

type ModuleProps = {
  title?: string,
  children?: JSX.Element | JSX.Element[],
  closed?: boolean,
  padding?: number
}

const Module = ({ title, children, closed, padding }: ModuleProps) => {
  const [isClosed, setIsClosed] = useState(closed as boolean)

  const rotationAnim = useRef(new Animated.Value(isClosed ? 0 : 1)).current
  const slidingDropdown = useRef(new Animated.Value(isClosed ? 0 : 1)).current
  // on layout record inner module height

  // on layout and measure
  const [childHeight, setChildHeight] = useState(0)

  let heightStyle = {}
  if (childHeight != 0) {
    heightStyle = { height: childHeight }
  }

  const getChildrenContainer = () => (children == null ? [] : [
    children,
    <View key='spacer' style={{ paddingTop: padding || 20 }}></View>
  ])
  return (
    <View style={[styles.module, title == null ? { paddingTop: padding || 20 } : {}, {
      backgroundColor: Theme.panelColor
    }]}>
      {title == null ? null : (
        <TouchableWithoutFeedback onPress={() => {
          Animated.parallel([
            Animated.timing(
              rotationAnim,
              {
                toValue: isClosed ? 1 : 0,
                duration: 200,
              }
            ),
            Animated.timing(
              slidingDropdown,
              {
                toValue: isClosed ? 1 : 0,
                duration: 200,
              }
            )
          ]).start();
          setIsClosed(!isClosed)
        }}>
          <View style={[styles.moduleTitle, {
            paddingTop: padding || 20,
            paddingBottom: padding || 20, zIndex: 2, backgroundColor: Theme.panelColor
          }]}>
            <AnimatedCollapseIcon rotation={rotationAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-90, 0]
            }) as unknown as number} />
            <Text style={Styles.font16}>{title as string}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
      {(() => {
        if (childHeight == 0) {
          return (<View onLayout={(e) => setChildHeight(e.nativeEvent.layout.height)}>
            {getChildrenContainer()}
          </View>)
        }
        return (<Animated.View style={{
          overflow: isClosed ? 'hidden' : 'auto',
          height: slidingDropdown.interpolate({ inputRange: [0, 1], outputRange: [0, childHeight] })
        }}>
          <Animated.View style={{
            marginTop: slidingDropdown.interpolate({ inputRange: [0, 1], outputRange: [-childHeight, 0] })
          }}>
            {(slidingDropdown as unknown as number < 0.05) ? null : getChildrenContainer()}
          </Animated.View>
        </Animated.View>)
      })()}
    </View >
  )
}


class LockableScrollView extends React.Component<{ id: string }, {
  enabled: boolean
}> {
  constructor(props: { id: string }) {
    super(props)
    this.state = { enabled: true }
  }

  scrollEnableCallback = () => this.setState({ enabled: true })
  scrollDisableCallback = () => this.setState({ enabled: false })

  componentDidMount() {
    Events.addListener(this.props.id + '_enable', this.scrollEnableCallback)
    Events.addListener(this.props.id + '_disable', this.scrollDisableCallback)
  }
  componentWillUnmount() {
    Events.removeListener(this.props.id + '_enable', this.scrollEnableCallback)
    Events.removeListener(this.props.id + '_disable', this.scrollDisableCallback)
  }
  render() {
    return (<ScrollView scrollEnabled={this.state.enabled}>
      {this.props.children}
    </ScrollView>)
  }
}

const OpacitySlider = (props: SliderProps) => {
  const dispatch = useDispatch()
  const value = useSelector((state: PhoblocksState) => state.document.layersRegistry.entries[+props.id].opacity)
  const setValue = (val: number) => { dispatch(LayerActions.setOpacity(+props.id, val)) }
  return (<Slider {...{ ...props, value, setValue }} />)
}

const activeLayerIdSelector = ((state: PhoblocksState) => state.document.layersRegistry.activeLayer)
const entriesSelector = ((state: PhoblocksState) => state.document.layersRegistry.entries)
const layerNameSelector = createSelector(activeLayerIdSelector, entriesSelector, (id, entries) => entries[id].name)

export const LayerProperties = () => {
  const id = useSelector(activeLayerIdSelector)
  const name = useSelector(layerNameSelector)

  return (
    <View style={styles.layerProperties}>
      <View style={styles.layerPropertiesInnerBlock}>
        <View style={styles.layerPreviewContainer}>
          <View style={styles.layerPropertiesPreview}></View>
          <Text style={Styles.font14}>{name}</Text>
        </View>
      </View>
      <LockableScrollView id='LayerProperties0'>
        <Module title='Blending Options' closed={false}>
          <OpacitySlider
            parentScrollViewId='LayerProperties0'
            id={`${id}`}
            title='Opacity'
            valueDisplayfunc={(x: number) => Math.floor(x * 100) + '%'}
            min={0}
            max={1}
          />
          <BlendingModeSelect id={id} />
        </Module>
        <Module padding={11}>
          <ButtonBody style={Styles.buttonBodyMargin}>
            <Svg style={{ marginRight: 1 }} width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.343 14.657A8 8 0 1014.604 3.29L14.5 3.5 14 4 3.343 14.657z"
                fill="#C4C4C4"
              />
              <Circle cx={9} cy={9} r={8} stroke="#C4C4C4" />
            </Svg>
            <Text style={Styles.font16}>Add clipped adjustment</Text>
          </ButtonBody>
        </Module>
        <Module title='Effects' closed={true} />
        <Module title='Smart Filters' closed={true} />
      </LockableScrollView>
      {/*

      */}
    </View>
  )
}


const styles = StyleSheet.create({
  moduleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16
  },
  module: {
    borderTopWidth: 1,
    borderColor: Theme.bgColor,
  },
  layerProperties: {
    backgroundColor: Theme.panelColor,
    flex: 1
  },
  layerPropertiesInnerBlock: {
    paddingTop: 3,
    paddingBottom: 12,
  },
  layerPropertiesPreview: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#909090',
    borderRadius: 2,
    marginRight: 18
  },
  layerPreviewContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 17, marginTop: 11 },
})