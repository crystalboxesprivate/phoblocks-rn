import React from 'react'
import Theme from '../Theme'
import { View, StyleProp, ViewStyle } from 'react-native'

const Sidebar = ({ children, alignment, style }: { children: JSX.Element[] | JSX.Element, alignment?: string, style?: any }) => {
  const align = alignment === 'right' ? { left: Theme.getFullWidth() - Theme.sidebarWidth } : { left: 0 }
  style = style || {}
  return <View style={{
    backgroundColor: Theme.bgColor,
    top: Theme.headerHeight,
    flex: 1,
    position: 'absolute',
    height: Theme.getFullHeight(),
    ...align
  }}>
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      width: Theme.sidebarWidth,
      height: Theme.getFullHeight(),
      position: 'relative',
      marginTop: 1,
      paddingTop: 8,
      backgroundColor: Theme.panelColor,
      ...style
    }}>
      {children}
    </View>
  </View>
}

type ToolGroupProps = {
  children: JSX.Element | JSX.Element[]
  style?: StyleProp<ViewStyle>
}

const ToolGroup = ({ children, style }: ToolGroupProps) => {
  return (
    <View style={[{
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column'
    }, style]}>
      {children}
    </View>
  )
}

export { Sidebar, ToolGroup }