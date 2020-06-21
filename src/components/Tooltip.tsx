import React, { useState, } from 'react'
import { View, TouchableHighlight, LayoutChangeEvent, LayoutRectangle, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { useLayout } from './Hooks'

type TooltipProps = {
  content: any,
  backgroundColor?: string,
  borderWidth?: number,
  borderColor?: string,
  style?: StyleProp<ViewStyle>,
  children: JSX.Element | JSX.Element[]
}

export enum TooltipPlacement {
  Top, Right, Bottom, Left
}



export const Tooltip = ({ backgroundColor, borderWidth, borderColor,
  style,
  content,
  children }: TooltipProps) => {
  const [visible, setVisible] = useState(false)
  const [contentLayout, onContentLayout] = useLayout()
  const [childLayout, onChildLayout] = useLayout()

  const { containerStyle, tooltipContentStyle, arrowStyle } = (() => {
    return {
      containerStyle: {
        opacity: childLayout && contentLayout ? 1.0 : 0.0,
        top: (() => {
          if (childLayout != null) {
            return childLayout.height / 2
          }
          return 0
        })(),
        left: 30
      },
      tooltipContentStyle: {
        marginTop: contentLayout != null
          ? contentLayout.height / 2 * -1
          : 0,
        backgroundColor: backgroundColor ? backgroundColor as string : 'white',
        borderWidth: borderWidth || 1,
        borderColor: borderColor || 'black',
      },
      arrowStyle: {
        backgroundColor: backgroundColor ? backgroundColor as string : 'white',
        borderLeftWidth: borderWidth || 1,
        borderLeftColor: borderColor || 'black',
        borderBottomWidth: borderWidth || 1,
        borderBottomColor: borderColor || 'black',
      }
    }
  })()

  return (
    <View>
      {visible
        ? (<View style={[containerStyle, styles.container]}>
          <View style={[arrowStyle, styles.arrow]}></View>
          <View onLayout={onContentLayout} style={[tooltipContentStyle, styles.content, style]}>{content}</View></View>)
        : null
      }
      <TouchableHighlight onPress={() => { setVisible(!visible) }}>
        <View onLayout={onChildLayout}>
          {children}
        </View>
      </TouchableHighlight>
    </View >
  )
}

const tipSize = 6
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    flexDirection: "row",
    zIndex: 200,
  },
  content: {
    marginLeft: -tipSize / 2,
    paddingLeft: tipSize / 2,
  },
  arrow: {
    width: tipSize,
    height: tipSize,
    transform: [{ rotate: '45deg' }],
    zIndex: 300,
  }
})