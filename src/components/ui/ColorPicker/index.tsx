import React, { useRef } from 'react'
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import { Styles } from '../Styles'
import Theme from '../../Theme'
import { useLayout, useEventLocalPosition } from '../../Hooks'
import { Texture, PixelImage } from './PixelImage'

import convert from 'color-convert'

const HueSlider = ({ hue, setHue }: { hue: number, setHue: (val: number) => void }) => {
  const [layout, onLayout] = useLayout()
  const [getLocalPosition, onResponderGrant] = useEventLocalPosition()
  const isDown = useRef(false)

  const size = 16

  const tex = useRef(new Texture(size, size)).current
  if (layout == null) {
    for (let y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        tex.setPixel(x, y, convert.hsv.rgb([x / size * 360, 100, 100]));
      }
    }
  }

  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderGrant={(e) => { 
        onResponderGrant(e)
        isDown.current = true
        setHue(getLocalPosition(e)[0]/(layout?.width || 1))

      }}
      onResponderRelease={() => { isDown.current = false }}
      onResponderMove={(e) => {
        if (isDown.current) {
          setHue(getLocalPosition(e)[0]/(layout?.width || 1))
        }
      }}
      onLayout={onLayout}
      style={[styles.hueSliderContainer, { position: 'relative', }]}>
      <PixelImage style={{ position: 'absolute', width: layout?.width || 1, borderRadius: 6, height: layout?.height || 1 }} texture={tex} />
      <View style={{ marginLeft: hue * (layout?.width || 1) }}>
        <View style={styles.hueSliderHandle} />
      </View>
    </View>)
}

type SaturationPadProps = {
  hsv: [number, number, number]
  setValue: (s: number, v: number) => void
}

const SaturationValuePad = ({ hsv, setValue }: SaturationPadProps) => {
  const [layout, onLayout] = useLayout()
  const size = 64
  const textureData = useRef({ tex: new Texture(size, size), h: -1 }).current
  const isDown = useRef(false)

  const [getLocalPosition, onResponderGrant] = useEventLocalPosition()

  if (hsv[0] != textureData.h) {
    textureData.h = hsv[0]
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        textureData.tex.setPixel(x, y, convert.hsv.rgb([hsv[0], x / size * 100, 100 - y / size * 100]))
      }
    }
  }

  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderGrant={(e) => {
        onResponderGrant(e)
        isDown.current = true
        const localPosition = getLocalPosition(e)
        setValue(localPosition[0] / (layout?.width || 1) * 100,
          (1 - (localPosition[1] / (layout?.height || 1))) * 100)
      }}
      onResponderRelease={() => { isDown.current = false }}
      onResponderMove={(e) => {
        if (isDown.current) {
          const localPosition = getLocalPosition(e)
          setValue(localPosition[0] / (layout?.width || 1) * 100,
            (1 - (localPosition[1] / (layout?.height || 1))) * 100)
        }
      }}

      onLayout={onLayout} style={[styles.saturationValuePicker, { position: 'relative' }]}>
      <PixelImage style={{ position: 'absolute', width: layout?.width || 1, borderRadius: 6, height: layout?.height || 1 }} texture={textureData.tex} />
      <View style={[
        styles.saturationValuePickerHandle,
        {
          left: (layout?.width || 1) * hsv[1] / 100,
          top: (layout?.height || 1) * (100 - hsv[2]) / 100,
        }
      ]} />
    </View>)
}


export const ColorPicker = ({ color, setColor }: { color: [number, number, number], setColor: (val: [number, number, number]) => void }) => {
  const hex = convert.hsv.hex(color)
  const hsv = color

  return (<View style={styles.main}>
    <View style={styles.pickerTitle}>
      <Text style={Styles.font16}>Color</Text>
    </View>
    <SaturationValuePad hsv={hsv} setValue={(s, v) => {
      setColor([hsv[0], s, v])
    }} />
    <HueSlider hue={hsv[0] / 360} setHue={(val: number) => {
      setColor([val * 360, hsv[1], hsv[2]])
    }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22, marginRight: 4 }}>
      <Text style={Styles.font14}>HEX</Text>
      <View style={styles.hexDisplayTextBlock}>
        <Text style={Styles.font14}>{`#${hex}`}</Text>
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
  </View>)
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