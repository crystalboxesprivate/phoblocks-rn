import Theme from '../../Theme'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import Slider, { SliderProps } from '../Slider'
import { Layer, LayerActions } from '../../../core/application/redux/layer'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import React, { useState, useRef, useEffect } from 'react'
import { Events } from '../../../core/events'
import { LayerListDisplayMode } from '../../../core/application/redux/ui'

const ButtonBody = ({ children }: { children: JSX.Element | JSX.Element[] }) =>
  (<View style={styles.buttonBody}>
    {children}
  </View >)

const DropdownList = ({ title, items, selectedItem }: {
  title: string,
  items?: string[],
  selectedItem: string
}) => {
  return (<View style={{ marginTop: 14 }}>
    {title != null ? <Text style={styles.dropdownTitle}>{title}</Text> : null}
    <ButtonBody>
      <Text style={styles.font16}>{selectedItem}</Text>
      <View>
        <Svg width={8} height={5} viewBox="0 0 8 5" fill="none">
          <Path d="M1 1l3 3 3-3" stroke="#B9B9B9" />
        </Svg>
      </View>
    </ButtonBody>
  </View>)
}

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

const Module = ({ title, children, closed, padding }:
  { title?: string, children?: JSX.Element | JSX.Element[], closed?: boolean, padding?: number }) => {
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
    <View style={[styles.module, {
      paddingTop: padding || 20,
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
          <View style={[styles.moduleTitle, { paddingBottom: padding || 20 }]}>
            <AnimatedCollapseIcon rotation={rotationAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-90, 0]
            }) as unknown as number} />
            <Text style={styles.font16}>{title as string}</Text>
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
          overflow: 'hidden',
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

const LayerDragTitle = connect((state: PhoblocksState) => ({
  listVisible: state.ui.layersButtons.layerListDisplayMode === LayerListDisplayMode.List
}), {})(({ listVisible }) => {
  let posY = 0
  const opacityAnim = useRef(new Animated.Value(listVisible ? 1 : 0)).current
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: listVisible ? 1 : 0, duration: 100 }).start()
  })
  return (
    <View
      onStartShouldSetResponder={_ => true}
      onResponderGrant={e => {
        Events.invoke('LayerDragTitleStart')
        posY = e.nativeEvent.pageY
      }}
      onResponderMove={e => Events.invoke('LayerDragTitleMove', e.nativeEvent.pageY - posY)}
    >
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
      <Text style={[{ marginLeft: 15 }, styles.font16]}>Layer Properties</Text>
    </View>
  )
})

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


const OpacitySlider = connect((state: PhoblocksState, ownProps: SliderProps) => {
  return ({
    value: state.document.layersRegistry.entries[+ownProps.id].opacity,
  })
}, (dispatch: any, ownProps: SliderProps) => {
  return {
    setValue: (val: number) => {
      dispatch(LayerActions.setOpacity(+ownProps.id, val))
    }
  }
})(Slider)

const LayerProperties_ = ({ id,
  name,
  blendMode }: { id: number, name: string, blendMode: string }) => {
  return (
    <View style={styles.layerProperties}>
      <View style={styles.layerPropertiesInnerBlock}>
        <LayerDragTitle />
        <View style={styles.layerPreviewContainer}>
          <View style={styles.layerPropertiesPreview}></View>
          <Text style={styles.font14}>{name}</Text>
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
          <DropdownList title='Blend Mode' selectedItem={blendMode} />
        </Module>

        <Module padding={11}>
          <ButtonBody>
            <Svg style={{ marginRight: 1 }} width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.343 14.657A8 8 0 1014.604 3.29L14.5 3.5 14 4 3.343 14.657z"
                fill="#C4C4C4"
              />
              <Circle cx={9} cy={9} r={8} stroke="#C4C4C4" />
            </Svg>
            <Text style={styles.font16}>Add clipped adjustment</Text>
          </ButtonBody>
        </Module>
        <Module title='Effects' closed={true} />
        <Module title='Smart Filters' closed={true} />
      </LockableScrollView>
    </View>
  )
}

const LayerProperties = connect((state: PhoblocksState) => {
  const layer = state.document.layersRegistry.entries[state.document.activeLayer]
  return ({
    id: layer.id,
    name: layer.name,
    blendMode: layer.blendMode
  })
}, {})(LayerProperties_)

const styles = StyleSheet.create({
  font16: {
    color: Theme.textBright0,
    fontSize: 16
  },
  font14: {
    color: Theme.textBright0,
    fontSize: 14
  },
  buttonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: Theme.buttonColor,
    borderWidth: 1,
    borderColor: Theme.separatorColor0,
    borderRadius: 4,
    paddingTop: 11, paddingRight: 17, paddingBottom: 11, paddingLeft: 15,

  },
  moduleTitle: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
  module: {
    borderTopWidth: 1,
    borderColor: Theme.bgColor,
  },
  dropdownTitle: { marginLeft: 15, marginBottom: 9, color: '#b9b9b9' },
  layerDragTitle: { justifyContent: 'center', flexDirection: 'row', marginBottom: 12 },
  layerProperties: {
    backgroundColor: Theme.panelColor,
    flex: 1
  },
  layerPropertiesInnerBlock: {
    paddingTop: 3,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderColor: Theme.bgColor
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

export default LayerProperties