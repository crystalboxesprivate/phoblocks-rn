import React from 'react'
import { View, StyleSheet, Text, LayoutChangeEvent, Animated, GestureResponderEvent } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'
import Theme from '../Theme'
import { Events } from '../../core/events'
import { overlayLog } from '../DebugOverlay'

const circleRadius = 9
const circleMargin = 4
const sliderDelay = 100

export type SliderProps = {
  id: string
  title?: string,
  min: number, max: number,
  valueDisplayfunc: (val: number) => string,
  parentScrollViewId?: string,

  value?: number,
  setValue?: (val: number) => void

}

const previousSliderValues = new Map<string, { width: number, previous: number }>()

function fit(value: number, low1: number, high1: number, low2: number, high2: number) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

class Slider extends React.Component<SliderProps, { sliderWidth: number, value: number }> {
  bounds = { x: 0, y: 0 }
  sliderContainer: any = (null)
  animatedValue: Animated.Value
  circleAnim: Animated.Value

  to01 = (v: number) => fit(v, this.props.min, this.props.max, 0, 1)
  from01 = (v: number) => fit(v, 0, 1, this.props.min, this.props.max)

  constructor(props: SliderProps) {
    super(props)
    let { id, min } = this.props
    let data = previousSliderValues.get(id) || { width: 0, previous: min }
    this.animatedValue = (new Animated.Value(this.to01(data.previous)))
    this.state = { sliderWidth: data.width, value: this.to01(this.props.value || data.previous) }

    this.circleAnim = (new Animated.Value(0))
  }

  componentWillUnmount() {
    Events.removeListener('resize', () => {
      this.forceUpdate()
      this.calculateLayoutWidth(null)
    })
  }

  calculateLayoutWidth = (e: LayoutChangeEvent | null) => {
    this.sliderContainer.measure((_fx: number, _fy: number, _wi: number, _he: number, px: number, py: number) => {
      this.bounds.x = px
      this.bounds.y = py
    })

    if (this.state.sliderWidth == 0) {
      this.setState({ sliderWidth: e?.nativeEvent.layout.width || 0 })
    }
  }

  getValue01 = () => this.to01(this.props.value || 0)

  componentDidMount() {
    Events.addListener('resize', () => {
      this.forceUpdate()
      this.calculateLayoutWidth(null)
    })
  }

  componentDidUpdate = () => {
    if (this.state.sliderWidth == 0) return
    Animated.timing(this.animatedValue, { toValue: this.getValue01(), duration: 150, useNativeDriver: false }).start()
    previousSliderValues.set(this.props.id, { width: this.state.sliderWidth, previous: this.getValue01() })
  }

  render() {
    let { setValue, id, title, valueDisplayfunc, max, min } = this.props

    const getNormalizedPosition = (e: GestureResponderEvent) => {
      let posx = (e.nativeEvent.pageX - this.bounds.x) / this.state.sliderWidth
      return posx < 0 ? 0 : posx > 1 ? 1 : posx
    }

    return (<View
      onStartShouldSetResponder={_ => true}
      onMoveShouldSetResponder={_ => true}
      onResponderGrant={e => {

        if (this.props.parentScrollViewId != null) {
          Events.invoke(this.props.parentScrollViewId + '_disable')
        }

        Animated.timing(this.circleAnim, { toValue: 1, duration: 100, useNativeDriver: false }).start()
        const px = getNormalizedPosition(e)
        Animated.timing(this.animatedValue, { toValue: px, duration: 100, useNativeDriver: false }).start(() => {
          previousSliderValues.set(id, { width: this.state.sliderWidth, previous: px })
          if (setValue != null) {
            setValue(this.from01(px))
          }
        })
      }}
      onResponderRelease={e => {
        Animated.timing(this.circleAnim, { toValue: 0, duration: 100, useNativeDriver: false }).start()
        if (this.props.parentScrollViewId != null) {
          Events.invoke(this.props.parentScrollViewId + '_enable')
        }
      }
      }
      onResponderMove={e => {
        const px = getNormalizedPosition(e)
        this.animatedValue.stopAnimation()
        this.animatedValue.setValue(px)
        if (setValue != null) {
          setValue(this.from01(px))
        }
      }}
      style={styles.sliderContainer}
    >
      <View
        ref={e => this.sliderContainer = e}
        style={styles.textContainer}
        onLayout={e => this.calculateLayoutWidth(e)}
      >
        <Text style={styles.title}>{title || ''}</Text>
        <ValueDisplay val={this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [min, max] })} valueDisplayfunc={valueDisplayfunc} />
      </View>
      <View style={styles.sliderControlsContainer}>
        <SliderGraphics radius={this.circleAnim.interpolate({ inputRange: [0, 1], outputRange: [circleRadius - 2, circleRadius - 7] })}
          value01={this.animatedValue} width={this.state.sliderWidth} />
      </View>
    </View>)

  }
}

const SliderGraphics = Animated.createAnimatedComponent(class extends React.Component<{
  width: number
  value01: number,
  radius: number
}> {
  render() {
    const boundMin = circleRadius + 1
    const boundMax = this.props.width - circleRadius - 1
    let circlePos = this.props.width * this.props.value01
    circlePos = circlePos < boundMin ? boundMin : circlePos > boundMax ? boundMax : circlePos
    return (
      <Svg width={this.props.width}
        height={20}
        viewBox={`0 0 ${this.props.width} 20`}
        fill="none">
        <Path
          d={`M0 10H${circlePos - circleMargin - circleRadius}`}
          stroke={Theme.separatorColor}
          strokeWidth="2"
        />
        <Path
          d={`M${circlePos + circleRadius + circleMargin} 10H${this.props.width}`}
          stroke="#4A4A4A"
          strokeWidth="2"
        />
        <Circle cx={circlePos}
          cy={10}
          r={circleRadius}
          fill={Theme.separatorColor}
        />
        <Circle
          cx={circlePos}
          cy={10}
          r={this.props.radius}
          fill={Theme.panelColor}
        />
      </Svg>
    )
  }
})

const ValueDisplay = Animated.createAnimatedComponent(class extends React.Component<{ val: number, valueDisplayfunc: (val: number) => string }> {
  render() {
    return <Animated.Text style={styles.valueDisplay}>
      {this.props.valueDisplayfunc(this.props.val)}
    </Animated.Text>
  }
})

const styles = StyleSheet.create({
  sliderControlsContainer: {
    flexDirection: 'row', justifyContent: 'center'
  },
  sliderContainer: {
    alignItems: 'stretch'
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 13,
    marginBottom: 5
  },
  title: {
    fontSize: 15,
    color: '#b9b9b9'
  },
  valueDisplay: {
    fontSize: 15,
    color: '#e3e3e3'
  }
})

export default Slider
