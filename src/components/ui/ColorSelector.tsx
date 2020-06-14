import React, { useState } from 'react'
import { TooltipLarge } from './Tooltips'
import Theme from '../Theme'
import Svg, { Circle, G } from 'react-native-svg'
import { View, TouchableWithoutFeedback } from 'react-native'

const ColorPicker = () => {
  return null
}

const ColorSelector = ({ backgroundColor, foregroundColor, isBackgroundActive }: { backgroundColor: string, foregroundColor: string, isBackgroundActive: boolean }) => {
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
        marginTop: '4px'
      }}>
        <View>
          <Svg width={30} height={48} viewBox="0 0 30 48" fill="none">
            <G data-tip data-for="colorPicker">
              {isBackgroundActive ? (<TopColorSwatch />) : (<BottomColorSwatch />)}
            </G>
            <G data-tip data-for="colorPicker">
              {isBackgroundActive ? (<BottomColorSwatch />) : (<TopColorSwatch />)}
            </G>
          </Svg>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ColorSelector
