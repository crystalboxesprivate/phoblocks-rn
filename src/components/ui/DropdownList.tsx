import { View, Text, StyleProp, StyleSheet, TouchableNativeFeedback, ScrollView, TouchableOpacity, ViewStyle, TouchableHighlight } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { Styles } from './Styles'
import React, { useState, useEffect } from 'react'
import { useGlobalPositionLayout } from '../Hooks'
import Theme from '../Theme'
import { FloatingPanel, useFloatingPanel } from './FloatingPanel'

export const DROPDOWN_SEPARATOR = 'DROPDOWN_SEPARATOR'

type DropdownListProps = {
  title: string,
  items?: string[],
  selectedItem: string,
  setValue: (val: string) => void
}

const Separator = () => (<View>
</View>)

type ItemProps = {
  title: string,
  isSelected: boolean,
  onPress: () => void
}

const Item = ({ title, isSelected, onPress }: ItemProps) => (
  <TouchableHighlight onPress={onPress}>
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemText}>{title}</Text>
      </View>
      <View>
        {isSelected ? (<Svg width={16} height={14} viewBox="0 0 16 14" fill="none">
          <Path
            d="M2 7l4 5 8-10.5"
            stroke="#3571DE"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>) : null}
      </View>
    </View>
  </TouchableHighlight>
)

const listOffsetTop = 10

export const DropdownList = ({ title, items, selectedItem, setValue }: DropdownListProps) => {
  const [listVisible, setListVisible] = useState(false)
  const [buttonLayout, buttonRef] = useGlobalPositionLayout()
  const [floatingPanel, panelCleanup] = useFloatingPanel()

  useEffect(() => {
    return () => { panelCleanup() }
  }, [buttonLayout])


  // calculate top and height correctly
  let height = 300
  const layoutY = buttonLayout?.y || 0
  const availableHeight = layoutY - Theme.getStatusBarHeight() - Theme.headerHeight

  if (height > availableHeight) {
    height = availableHeight
  }

  const floatingStyle = {
    width: buttonLayout?.width || 300,
    left: buttonLayout?.x || 0,
    height: height - listOffsetTop,
    top: layoutY - height
  }

  return (
    <View style={{ marginTop: 14 }}>
      <FloatingPanel id={floatingPanel} visible={listVisible}>
        <View style={[floatingStyle, styles.listContainer]}>
          <ScrollView style={styles.listScrollViewContainer}>
            {items?.map((x, idx) => (x === DROPDOWN_SEPARATOR
              ? <Separator key={`dropdownel:${idx}`} />
              : <Item key={`dropdownel:${idx}`} title={x} isSelected={x == selectedItem} onPress={() => {
                setValue(x)
                setListVisible(false)
              }} />))}
          </ScrollView>
        </View>
      </FloatingPanel>
      {title != null ? <Text style={styles.dropdownTitle}>{title}</Text> : null}
      <TouchableOpacity onPress={() => setListVisible(!listVisible)}>
        <View ref={buttonRef} style={Styles.buttonBodyMargin}>
          <ButtonBody>
            <Text style={Styles.font16}>{selectedItem}</Text>
            <View>
              <Svg width={8} height={5} viewBox="0 0 8 5" fill="none">
                <Path d="M1 1l3 3 3-3" stroke="#B9B9B9" />
              </Svg>
            </View>
          </ButtonBody>
        </View>
      </TouchableOpacity>
    </View>
  )
}

type ButtonBodyProps = {
  children: JSX.Element | JSX.Element[],
  style?: StyleProp<ViewStyle>
}

export const ButtonBody = ({ children, style }: ButtonBodyProps) =>
  (<View style={[style, Styles.buttonBody]}>
    {children}
  </View >)

const styles = StyleSheet.create({
  dropdownTitle: { marginLeft: 15, marginBottom: 9, color: '#b9b9b9' },
  listContainer: {
    position: 'absolute',
    zIndex: 800,
  },
  listScrollViewContainer: {
    backgroundColor: Theme.bgColor,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5A5A5A',
    paddingTop: 5,
    paddingBottom: 5
  },
  itemText: {
    fontSize: 14,
    color: Theme.textBright0,

  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 17,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  }
})