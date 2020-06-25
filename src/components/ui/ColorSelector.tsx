import React, { useState } from 'react'
import Theme from '../Theme'
import { View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native'
import { Tooltip } from '../Tooltip'
import { ColorPicker } from './ColorPicker'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import { ColorActions, color } from '../../core/application/redux/editor/color'
import convert from 'color-convert'

const tooltipProps = {
  tipSize: 12,
  borderWidth: 1,
  borderColor: '#555555',
  backgroundColor: '#252525',
  style: { borderRadius: 6 }
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center', justifyContent: 'center',
  },
  colorSwatch: {
    width: 22, height: 22,
    borderRadius: 22 / 2
  },
  outsideColorSwatch: {
    width: 30, height: 30, borderRadius: 30 / 2
  },
  innerColorSwatchHighlighted: {
    width: 26, height: 26, borderRadius: 26 / 2
  },
  innerColorSwatch: {
    width: 28, height: 28, borderRadius: 28 / 2
  },
})

const ColorSelector = () => {
  const highlightedColor = '#427EE3'
  const strokeColor = '#5A5A5A'


  const primary = useSelector((state: PhoblocksState) => state.color.primary)
  const secondary = useSelector((state: PhoblocksState) => state.color.secondary)

  const backgroundColor = `#${convert.hsv.hex(secondary)}`
  const foregroundColor = `#${convert.hsv.hex(primary)}`

  const TopColorSwatch = () => (
    <View style={[{ backgroundColor: highlightedColor }, styles.outsideColorSwatch, styles.centered]}>
      <View style={[{ backgroundColor: Theme.panelColor, }, styles.innerColorSwatchHighlighted, styles.centered]}>
        <View style={[{ backgroundColor: foregroundColor }, styles.colorSwatch, styles.centered]} />
      </View>
    </View>
  )

  const BottomColorSwatch = () => (
    <View style={[{ backgroundColor: strokeColor }, styles.outsideColorSwatch, styles.centered]}>
      <View style={[{ backgroundColor: Theme.panelColor, }, styles.innerColorSwatch, styles.centered]}>
        <View style={[{ backgroundColor: backgroundColor }, styles.colorSwatch, styles.centered]} />
      </View>
    </View>
  )
  enum ClickedState {
    None, Primary, Secondary
  }

  const [clicked, setClicked] = useState(ClickedState.None)
  const dispatch = useDispatch()
  const setPrimary = (val: [number, number, number]) => dispatch(ColorActions.setPrimary(val))
  const setSecondary = (val: [number, number, number]) => dispatch(ColorActions.setSecondary(val))

  return (
    <View style={{
      position: 'relative',
      marginTop: 4
    }}>
      <View>
        <View style={{ width: 30, height: 48 }}>

          <View style={{ marginBottom: -12, zIndex: 2 }}>
            <Tooltip visible={clicked === ClickedState.Primary} {...tooltipProps}
              content={() => (<ColorPicker color={primary} setColor={setPrimary} />)}>
              <TouchableWithoutFeedback onPress={() => setClicked(ClickedState.Primary != clicked ? ClickedState.Primary : ClickedState.None)} >
                <View>
                  <TopColorSwatch />
                </View>
              </TouchableWithoutFeedback>
            </Tooltip>
          </View>

          <Tooltip visible={clicked === ClickedState.Secondary} {...tooltipProps}
            content={() => (<ColorPicker color={secondary} setColor={setSecondary} />)}>
            <TouchableWithoutFeedback onPress={() => setClicked(clicked != ClickedState.Secondary ? ClickedState.Secondary : ClickedState.None)} >
              <View>
                <BottomColorSwatch />
              </View>
            </TouchableWithoutFeedback>
          </Tooltip>
        </View>
      </View>
    </View>
  )
}

export default ColorSelector
