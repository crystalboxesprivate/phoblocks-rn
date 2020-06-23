import React, { useState, } from 'react'
import { View, TouchableHighlight, LayoutChangeEvent, LayoutRectangle, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { useLayout } from './Hooks'

type TooltipProps = {
  content: any,
  backgroundColor?: string,
  borderWidth?: number,
  borderColor?: string,
  style?: StyleProp<ViewStyle>,
  tipSize?: number,
  children: JSX.Element | JSX.Element[],
  visible: boolean
}

export enum TooltipPlacement {
  Top, Right, Bottom, Left
}



export const Tooltip = ({ tipSize, backgroundColor, borderWidth, borderColor,
  style, visible,
  content,
  children }: TooltipProps) => {
  const [contentLayout, onContentLayout] = useLayout()
  const [childLayout, onChildLayout] = useLayout()

  const tipSize2 = tipSize || 6

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
        marginLeft: -tipSize2 / 2,
        paddingLeft: tipSize2 / 2,
        marginTop: contentLayout != null
          ? contentLayout.height / 2 * -1
          : 0,
        backgroundColor: backgroundColor ? backgroundColor as string : 'white',
        borderWidth: borderWidth || 1,
        borderColor: borderColor || 'black',
      },
      arrowStyle: {
        width: tipSize2,
        height: tipSize2,
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
          <View onLayout={onContentLayout} style={[tooltipContentStyle, style]}>{content()}</View></View>)
        : null
      }
      <View onLayout={onChildLayout}>
        {children}
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    flexDirection: "row",
    zIndex: 200,
  },
  arrow: {
    transform: [{ rotate: '45deg' }],
    zIndex: 300,
  }
})