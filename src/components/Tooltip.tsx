import React from 'react'
import { View, TouchableHighlight, Text, LayoutChangeEvent, LayoutRectangle, StyleProp, ViewStyle } from 'react-native'

type TooltipState = {
  modalVisible: boolean,
}

type TooltipProps = {
  content: any,
  backgroundColor?: string,
  borderWidth?: number,
  borderColor?: string,
  style?: StyleProp<ViewStyle>
}

export enum TooltipPlacement {
  Top, Right, Bottom, Left
}

const tipSize = 6

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  contentLayout: LayoutRectangle | null = null
  contentLayoutUpdated = false

  childLayout: LayoutRectangle | null = null
  childLayoutUpdated = false

  state = { modalVisible: false }


  onChildLayout(e: LayoutChangeEvent) {
    if (!this.childLayoutUpdated) {
      this.childLayout = e.nativeEvent.layout
      this.childLayoutUpdated = true
      this.forceUpdate()
    }

  }

  onLayout(e: LayoutChangeEvent) {
    if (!this.contentLayoutUpdated) {
      this.contentLayout = e.nativeEvent.layout
      this.contentLayoutUpdated = true
      this.forceUpdate()
    }
  }

  render() {
    const tooltipStyle = {
      opacity: this.childLayoutUpdated && this.contentLayoutUpdated ? 1.0 : 0.0,
      top: (() => {
        if (this.childLayout != null) {
          return this.childLayout.height / 2
        }
        return 0
      })(),
      left: 30
    }
    const tooltipContentStyle = { marginTop: this.contentLayout != null ? this.contentLayout.height / 2 * -1 : 0 }

    return (
      <View>
        {this.state.modalVisible
          ? (<View style={{
            ...tooltipStyle,
            position: 'absolute',
            flex: 1,
            flexDirection: "row",
            zIndex: 200,
          }}>
            <View style={{
              width: tipSize,
              height: tipSize,
              backgroundColor: this.props.backgroundColor ? this.props.backgroundColor as string : 'white',
              borderLeftWidth: this.props.borderWidth || 1,
              borderLeftColor: this.props.borderColor || 'black',
              borderBottomWidth: this.props.borderWidth || 1,
              borderBottomColor: this.props.borderColor || 'black',
              transform: [{ rotate: '45deg' }],
              zIndex: 300,
            }}></View>
            <View onLayout={e => this.onLayout(e)} style={[{
              ...tooltipContentStyle,
              marginLeft: -tipSize / 2,
              paddingLeft: tipSize / 2,
              backgroundColor: this.props.backgroundColor ? this.props.backgroundColor as string : 'white',
              borderWidth: this.props.borderWidth || 1,
              borderColor: this.props.borderColor || 'black',
            }, this.props.style]}>{this.props.content}</View></View>)
          : null
        }
        <TouchableHighlight
          onPress={() => {
            this.setState({ modalVisible: !this.state.modalVisible })
          }}>
          <View onLayout={e => this.onChildLayout(e)}>
            {this.props.children}
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
