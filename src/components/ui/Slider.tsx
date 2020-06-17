
import React from 'react'
import { Animation, map } from './Animation'
import { Events } from '../../core/events'
import { View, Text } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'


const circleRadius = 9
const circleMargin = 4
const sliderDelay = 100

const textStyle = {
  fontSize: 15,
}

type SliderProps = {
  title: string,
  min: number, max: number,
  defaultValue: number,
  step: number,
  valueDisplayfunc: any,
  parentScrollViewId?: string,

  setValueCallback?: (value: number) => void
}

type SliderState = {
  width: number,
  value: number
}

class Slider extends React.Component<SliderProps, SliderState> {
  circleAnim: Animation
  sliderAnim: Animation
  constructor(props: SliderProps) {
    super(props)

    this.circleAnim = new Animation()
    this.sliderAnim = new Animation()

    this.state = {
      value: this.props.defaultValue,
      width: 0,
    }
  }

  isDown = false
  lastX = 0
  lastY = 0

  isInsideCircle(posX01: number) {
    const circlePos = this.circlePosition
    const width = this.sliderWidth
    const posXRel = posX01 * width
    return posXRel > circlePos - circleRadius && posXRel < circlePos + circleRadius
  }

  handleMouseDown(e: any) {
    if (this.props.parentScrollViewId != null) {
      Events.invoke(this.props.parentScrollViewId + '_disable')
    }
    this.isDown = true

    const [clientX, clientY] = this.getClientXY(e)
    const posX01 = this.getPosX01(clientX, clientY)
    const targetVal = this.getValueFromCursor(posX01)
    if (this.isInsideCircle(posX01)) {
      this.sliderAnim.active = false
      this.value = targetVal
    }
    else {
      this.sliderAnim.play(this.value, targetVal, 0, sliderDelay, () => this.forceUpdate())
    }
    // change circle animation
    this.circleAnim.play(0, 1, 0, 100, () => this.forceUpdate())

  }



  handleMouseMove(e: any) {
    if (this.isDown) {
      const [clientX, clientY] = this.getClientXY(e)
      const posX01 = this.getPosX01(clientX, clientY)
      const targetVal = this.getValueFromCursor(posX01)
      if (this.sliderAnim.active) {
        this.sliderAnim.end = targetVal
      }
      this.value = targetVal
    }
  }

  handleMouseUp(e: any) {
    if (this.isDown) {
      if (this.props.parentScrollViewId != null) {
        Events.invoke(this.props.parentScrollViewId + '_enable')
      }

      this.circleAnim.play(1, 0, 0, 100, () => this.forceUpdate())

      const [clientX, clientY] = [this.lastX, this.lastY]
      const posX01 = this.getPosX01(clientX, clientY)
      const targetVal = this.getValueFromCursor(posX01)
      if (this.sliderAnim.active) {
        this.value = this.sliderAnim.t
        this.sliderAnim.active = false
      } else {
        this.value = targetVal
      }
    }
    this.isDown = false
  }


  getClientXY(e: any) {
    const pos = [e.nativeEvent.pageX, e.nativeEvent.pageY]
    this.lastX = pos[0]
    this.lastY = pos[1]

    return pos
  }

  getValueFromCursor(posX01: number) {
    return (posX01 * (this.props.max - this.props.min)) + this.props.min
  }

  getPosX01(clientX: number, clientY: number) {
    const bounds: any = this.bounds
    const [x, y] = [
      (clientX - bounds.x),
      (clientY - bounds.y),
    ]
    let posX01 = x / (bounds.width)
    posX01 = posX01 < 0 ? 0 : posX01 > 1 ? 1 : posX01

    return posX01
  }


  get displayValue() {
    if (this.sliderAnim.active) {
      return this.sliderAnim.t
    }
    return this.value
  }

  get percents() {
    return (this.displayValue / this.props.max - this.props.min) * 100
  }

  componentDidUpdate() {

    if (this.sliderAnim.isFinished()) {
      this.value = this.sliderAnim.t
    }
  }

  get value() {
    return this.state.value
  }

  get sliderWidth() {
    return this.state.width
  }

  set sliderWidth(value) {
    this.setState({ width: value })
  }

  set value(value) {
    if (this.props.setValueCallback) {
      this.props.setValueCallback(value)
    }
    this.setState({ value: value })
  }

  get circlePosition() {
    const boundMin = circleRadius + 1
    const boundMax = this.sliderWidth - circleRadius - 1

    let circlePos = this.sliderWidth * 0.01 * this.percents
    circlePos = circlePos < boundMin ? boundMin : circlePos > boundMax ? boundMax : circlePos
    return circlePos
  }

  bounds: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 }
  sliderContainer: any = null

  onLayout(e: any) {
    this.bounds = e.nativeEvent.layout
    this.sliderWidth = this.bounds.width

    this.sliderContainer.measure((_fx: number, _fy: number, _wi: number, _he: number, px: number, py: number) => {
      this.bounds.x = px
      this.bounds.y = py
    })
  }

  render() {
    let circlePos = this.circlePosition
    if (isNaN(circlePos)) {
      circlePos = 0
    }
    return (
      <View style={{ alignItems: 'stretch' }}
        onStartShouldSetResponder={_ => true}
        onMoveShouldSetResponder={_ => true}
        onResponderGrant={e => this.handleMouseDown(e)}
        onResponderMove={e => this.handleMouseMove(e)}
        onResponderRelease={e => this.handleMouseUp(e)}
        onResponderTerminationRequest={_ => false}
      >
        <View onLayout={(e) => this.onLayout(e)}
          ref={(view) => this.sliderContainer = view}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 15,
            marginRight: 13,
            marginBottom: 5
          }}>
          {this.props.title != null
            ? <Text style={{ ...textStyle, color: '#b9b9b9' }}>{this.props.title}</Text>
            : {}
          }
          <Text style={{ ...textStyle, color: '#e3e3e3' }}>
            {this.props.valueDisplayfunc(this.displayValue)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Svg width={this.sliderWidth}
            height={20}
            viewBox={`0 0 ${this.sliderWidth} 20`}
            fill="none">
            <Path
              d={`M0 10H${circlePos - circleMargin - circleRadius}`}
              stroke="#B9B9B9"
              strokeWidth="2"
            />
            <Path
              d={`M${circlePos + circleRadius + circleMargin} 10H${this.sliderWidth}`}
              stroke="#4A4A4A"
              strokeWidth="2"
            />
            <Circle cx={circlePos}
              cy="10"
              r={circleRadius}
              fill="#B9B9B9"
            />
            <Circle
              cx={circlePos}
              cy="10"
              r={map(this.circleAnim.t, 0, 1, circleRadius - 2, circleRadius - 7)}
              fill="#323232"
            />
          </Svg>
        </View>
      </View>
    )
  }
}

export default Slider