import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import { Styles } from '../Styles'
import Theme from '../../Theme'

const HueSlider = () => (
  <View style={styles.hueSliderContainer}>
    <View style={{ marginLeft: '40%' }}>
      <View style={styles.hueSliderHandle} />
    </View>
  </View>)


export const ColorPicker = () => {
  return (
    <View style={styles.main}>
      <View style={styles.pickerTitle}>
        <Text style={Styles.font16}>Color</Text>
      </View>
      <View style={styles.saturationValuePicker}>
        <View style={styles.saturationValuePickerHandle} />
      </View>
      <HueSlider />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22, marginRight: 4 }}>
        <Text style={Styles.font14}>HEX</Text>
        <View style={styles.hexDisplayTextBlock}>
          <Text style={Styles.font14}>#3ACA4E</Text>
        </View>
        <View style={{ flexGrow: 4 }}></View>
        <View >
          <Svg width={18} height={22} viewBox="0 0 18 22" fill="none">
            <Path
              d="M1.129 18.895c.818.779 2.593.25 4.043-1.205l6.836-6.86.526.502a1.03 1.03 0 001.433-.013.976.976 0 00-.023-1.402l-.77-.734 3.664-3.677a1.63 1.63 0 00-.04-2.339 1.715 1.715 0 00-2.389.02l-3.664 3.678-.77-.735a1.032 1.032 0 00-1.434.012.978.978 0 00.025 1.404l.525.502-6.835 6.86C.806 16.363.31 18.114 1.129 18.895zM9.577 8.51l1.945 1.855-6.836 6.86C3.441 18.477 2.06 18.861 1.6 18.422c-.46-.44-.103-1.8 1.143-3.051l6.835-6.86z"
              fill="#B9B9B9"
            />
          </Svg>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 27, marginRight: 4 }}>
        <View>
          <Svg width={7} height={11} viewBox="0 0 7 11" fill="none">
            <Path d="M1.5 1.5l4 4-4 4" stroke="#B9B9B9" />
          </Svg>
        </View>
        <View style={{ flexGrow: 4, marginLeft: 18 }}>
          <Text style={Styles.font14}>HSB</Text>
        </View>
        <View >
          <Svg width={17} height={4} viewBox="0 0 17 4" fill="none">
            <Circle cx={2.5} cy={2} r={2} fill="#C4C4C4" />
            <Circle cx={8.5} cy={2} r={2} fill="#C4C4C4" />
            <Circle cx={14.5} cy={2} r={2} fill="#C4C4C4" />
          </Svg>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 10,
    paddingLeft: 8,
    paddingRight: 11,
    paddingBottom: 12
  },
  hueSliderHandle: {
    width: 19,
    height: 19,
    borderRadius: 19 / 2,
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  hueSliderContainer: {
    marginTop: 15,
    backgroundColor: 'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))',
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6
  },
  saturationValuePicker: {
    width: 206, height: 180,
    backgroundColor: '#c4c4c4',
    borderRadius: 6,
    position: "relative"
  },
  saturationValuePickerHandle: {
    position: 'absolute',
    top: 20, left: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    width: 20, height: 20, borderRadius: 10
  },
  hexDisplayTextBlock: {
    marginLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.separatorColor0
  },
  pickerTitle: {
    marginBottom: 11
  }
})