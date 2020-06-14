import React from 'react'
import Icon from '../Icon'
import Theme from '../Theme'
import { View } from 'react-native'
import Svg, { Path } from "react-native-svg"

const ToolIcon = ({ name, isActive, style, activeColor, hasOptions }: {
  name: string, isActive?: boolean, style?: object, activeColor?: string, hasOptions?: boolean
}) => {
  activeColor = activeColor || '#3571DE'
  style = style || {}
  isActive = isActive || false
  const activeStyle = isActive ? {
    backgroundColor: activeColor,
    borderRadius: 5
  } : {}

  return (
    <View style={{
      position: 'relative',
      width: 40, height: 40,
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center', ...activeStyle
    }}>
      <View >
        <Icon name={name} fill={null} />
      </View>
      {hasOptions ? (<View style={{ position: 'absolute', right: 4, bottom: 1 }}>
        <Svg width={6} height={6} viewBox="0 0 6 6" fill="none">
          <Path d="M6 6V0L0 6h6z" fill="#B9B9B9" />
        </Svg>
      </View>) : null}
    </View>
  )
}

const ToolSeparator = ({ color }: { color?: string }) => (<View style={{
  borderColor: color ? color : Theme.separatorColor,
  width: 26,
  height: 1,
  borderTopWidth: 1,
  borderStyle: 'solid',
  marginTop: 4,
  marginBottom: 4,
}}></View>)

export { ToolIcon, ToolSeparator }
