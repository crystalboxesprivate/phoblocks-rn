
import React from 'react'
import { overlayLog } from '../DebugOverlay'
import { Animation, map } from './Animation'
import { Events } from '../../core/events'

const circleRadius = 9
const circleMargin = 4
const sliderDelay = 100

class Slider extends React.Component {
  constructor(props) {
    super(props)
    this.sliderContainer = React.createRef()

    this.title = props.title
    this.min = props.min || 0
    this.max = props.max || 1
    this.defaultValue = props.defaultValue || 1
    this.step = props.step || 0.01
    this.valueDisplayfunc = props.valueDisplayfunc || (x => x)

    this.circleAnim = new Animation()
    this.sliderAnim = new Animation()

    this.state = {
      isDown: false,
      value: this.defaultValue,
      width: 0,
    }
  }

  isDown = false
  lastX = 0
  lastY = 0

  isInsideCircle(posX01) {
    const circlePos = this.circlePosition
    const width = this.sliderWidth
    const posXRel = posX01 * width
    return posXRel > circlePos - circleRadius && posXRel < circlePos + circleRadius
  }

  handleMouseDown(e, isTouch) {
    this.isDown = true


    const [clientX, clientY] = this.getClientXY(e, isTouch)
    const posX01 = this.getPosX01(clientX, clientY, true)
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

  handleMouseUp(e, isTouch) {
    if (this.isDown) {
      this.circleAnim.play(1, 0, 0, 100, () => this.forceUpdate())

      const [clientX, clientY] = [isTouch ? this.lastX : e.clientX,
      isTouch ? this.lastY : e.clientY]
      const posX01 = this.getPosX01(clientX, clientY, true)
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


  getClientXY(e, isTouch) {
    const pos = [isTouch ? e.touches[0].pageX : e.clientX,
    isTouch ? e.touches[0].pageY : e.clientY]
    this.lastX = pos[0]
    this.lastY = pos[1]
    return pos
  }

  getValueFromCursor(posX01) {
    return (posX01 * (this.max - this.min)) + this.min
  }

  getPosX01(clientX, clientY) {
    const bounds = this.sliderContainer.current.getBoundingClientRect()
    const [x, y] = [
      (clientX - bounds.left) * window.devicePixelRatio,
      (clientY - bounds.top) * window.devicePixelRatio,
    ]
    let posX01 = x / (bounds.width * window.devicePixelRatio)
    posX01 = posX01 < 0 ? 0 : posX01 > 1 ? 1 : posX01
    return posX01
  }


  handleMouseMove(e, isTouch) {
    if (this.isDown) {
      const [clientX, clientY] = this.getClientXY(e, isTouch)
      const posX01 = this.getPosX01(clientX, clientY)
      const targetVal = this.getValueFromCursor(posX01)
      if (this.sliderAnim.active) {
        this.sliderAnim.end = targetVal
      }
      this.value = targetVal
    }
  }

  get displayValue() {
    if (this.sliderAnim.active) {
      return this.sliderAnim.t
    }
    return this.value
  }

  get percents() {
    return (this.displayValue / this.max - this.min) * 100
  }

  componentDidUpdate() {

    if (this.sliderAnim.isFinished()) {
      this.value = this.sliderAnim.t
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', e => this.handleMouseUp(e), true)
    document.addEventListener('mousemove', e => this.handleMouseMove(e), true)

    Events.addListener('touchend', e => this.handleMouseUp(e, true))
    Events.addListener('touchmove', e => this.handleMouseMove(e, true))

    this.sliderWidth = this.sliderContainer.current.getBoundingClientRect().width
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', e => this.handleMouseUp(e), true)
    document.removeEventListener('mousemove', e => this.handleMouseMove(e), true)

    Events.removeListener('touchend', e => this.handleMouseUp(e, true))
    Events.removeListener('touchmove', e => this.handleMouseMove(e, true))
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
    this.setState({ value: value })
  }


  get circlePosition() {
    const boundMin = circleRadius + 1
    const boundMax = this.sliderWidth - circleRadius - 1

    let circlePos = this.sliderWidth * 0.01 * this.percents
    circlePos = circlePos < boundMin ? boundMin : circlePos > boundMax ? boundMax : circlePos
    return circlePos
  }

  render() {
    const circlePos = this.circlePosition
    return (
      <View onMouseDown={e => this.handleMouseDown(e)} onTouchStart={e => this.handleMouseDown(e, true)}>
        <View ref={this.sliderContainer}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: 15,
            marginRight: 13,
            marginBottom: 5
          }}>
          {this.title != null
            ? <Text>{this.title}</Text>
            : {}
          }
          <Text>
            {this.valueDisplayfunc(this.displayValue)}
          </Text>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <Svg width={this.sliderWidth}
            height="20"
            viewBox={`0 0 ${this.sliderWidth} 20`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
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