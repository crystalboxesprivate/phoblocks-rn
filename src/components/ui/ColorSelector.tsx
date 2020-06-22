import React, { useState } from 'react'
import Theme from '../Theme'
import Svg, { Circle, G } from 'react-native-svg'
import { View, TouchableWithoutFeedback, Text } from 'react-native'
import { Tooltip } from '../Tooltip'
import { ColorPicker } from './ColorPicker'

type ColorSelectorProps = {
  backgroundColor: string,
  foregroundColor: string,
  isBackgroundActive: boolean
}

const ColorSelector = ({ backgroundColor, foregroundColor, isBackgroundActive }: ColorSelectorProps) => {
  const highlightedColor = '#427EE3'
  const strokeColor = '#5A5A5A'

  const getStrokeProps = (active: boolean) => active ? {
    r: 14, stroke: highlightedColor, strokeWidth: 2
  } : {
      r: 14.5, stroke: strokeColor
    }

  const TopColorSwatch = () => (<G>
    <Circle cx="15" cy="15" r="15" fill={Theme.panelColor} />
    <Circle cx="15" cy="15" r="11" fill={foregroundColor} />
    {React.createElement(Circle, { cx: 15, cy: 15, ...getStrokeProps(!isBackgroundActive) })}
  </G>)

  const BottomColorSwatch = () => (<G>
    <Circle cx="15" cy="33" r="15" fill={Theme.panelColor} />
    <Circle cx="15" cy="33" r="11" fill={backgroundColor} />
    {React.createElement(Circle, { cx: 15, cy: 33, ...getStrokeProps(isBackgroundActive) })}
  </G>)

  const [clicked, setClicked] = useState(false)


  return (
    <TouchableWithoutFeedback onPress={() => setClicked(!clicked)} >
      <View style={{
        position: 'relative',
        marginTop: 4
      }}>
        <View>
          <Tooltip
            tipSize={12}
            borderWidth={1}
            borderColor='#555555'
            backgroundColor='#252525'
            content={(<ColorPicker />)}
            style={{ borderRadius: 6 }}>
            <Svg width={30} height={48} viewBox="0 0 30 48" fill="none">
              <G data-tip data-for="colorPicker">
                {isBackgroundActive ? (<TopColorSwatch />) : (<BottomColorSwatch />)}
              </G>
              <G data-tip data-for="colorPicker">
                {isBackgroundActive ? (<BottomColorSwatch />) : (<TopColorSwatch />)}
              </G>
            </Svg>
          </Tooltip>

        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ColorSelector
