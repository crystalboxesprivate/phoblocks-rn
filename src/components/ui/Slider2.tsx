import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Text, LayoutChangeEvent, Animated } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'
import Theme from '../Theme'

const circleRadius = 9
const circleMargin = 4
const sliderDelay = 100

type SliderProps = {
  id: string
  title?: string,
  min: number, max: number,
  defaultValue?: number,
  step?: number,
  valueDisplayfunc: (val: number) => string,
  parentScrollViewId?: string,

  value: number,
  setValue: (val: number) => void

  setValueCallback?: (value: number) => void
}

const SliderGraphics = Animated.createAnimatedComponent(class extends React.Component<{
  width: number
  value: number,
  min: number, max: number,
  radius: number
}> {
  render() {
    const boundMin = circleRadius + 1
    const boundMax = this.props.width - circleRadius - 1
    let circlePos = this.props.width * (this.props.value / (this.props.max - this.props.min))
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
          r={this.props.radius} //{map(this.circleAnim.t, 0, 1, circleRadius - 2, circleRadius - 7)}
          fill={Theme.panelColor}
        />
      </Svg>
    )
  }
})

const previousSliderValues = new Map<string, { width: number, previous: number }>()

const Slider = ({ id, title, valueDisplayfunc, value, max, min }: SliderProps) => {
  let data = previousSliderValues.get(id) || { width: 0, previous: min }
  let [sliderWidth, setSliderWidth] = useState(data.width)

  const animatedValue = useRef(new Animated.Value(data.previous)).current
  const circleAnim = useRef(new Animated.Value(0)).current

  const calculateLayoutWidth = (e: LayoutChangeEvent) => {
    if (sliderWidth == 0)
      setSliderWidth(e.nativeEvent.layout.width)
  }

  useEffect(() => {
    if (sliderWidth == 0) return
    Animated.timing(animatedValue, { toValue: value, duration: 200 }).start()
    previousSliderValues.set(id, { width: sliderWidth, previous: value })
  })

  return (<View
    onStartShouldSetResponder={_ => true}
    onMoveShouldSetResponder={_ => true}
    onResponderGrant={e => {
      Animated.timing(circleAnim, { toValue: 1, duration: 100 }).start()
    }}
    onResponderRelease={e =>
      Animated.timing(circleAnim, { toValue: 0, duration: 100 }).start()
    }

    style={styles.sliderContainer}
  >
    <View style={styles.textContainer} onLayout={calculateLayoutWidth}>
      <Text style={styles.title}>{title || ''}</Text>
      <Text style={styles.valueDisplay}>{valueDisplayfunc(value)}</Text>
    </View>
    <View style={styles.sliderControlsContainer}>
      <SliderGraphics radius={circleAnim.interpolate({ inputRange: [0, 1], outputRange: [circleRadius - 2, circleRadius - 7] })}
        value={animatedValue} min={min} max={max} width={sliderWidth} />
    </View>
  </View>)
}

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