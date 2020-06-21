import { View, Text, Button, StyleSheet, TouchableNativeFeedback, ScrollView, TouchableOpacity } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { Styles } from '../Styles'
import React, { useState } from 'react'

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
  <View><Text>{title}</Text></View>
)

export const DropdownList = ({ title, items, selectedItem, setValue }: DropdownListProps) => {
  const [listVisible, setListVisible] = useState(false)
  console.log({ listVisible })
  return (
    <View style={{ marginTop: 14 }}>
      {listVisible ? (
        <View style={{ position: 'absolute', top: 0, left: 0, width: 250, height: 300 }}>
          <ScrollView>
            {items?.map(x => (x === DROPDOWN_SEPARATOR
              ? <Separator />
              : <Item title={x} isSelected={x == selectedItem} onPress={() => setValue(x)} />))}
          </ScrollView>
        </View>
      ) : null}
      {title != null ? <Text style={styles.dropdownTitle}>{title}</Text> : null}
      <TouchableOpacity onPress={() => setListVisible(true)}>
        <ButtonBody>
          <Text style={Styles.font16}>{selectedItem}</Text>
          <View>
            <Svg width={8} height={5} viewBox="0 0 8 5" fill="none">
              <Path d="M1 1l3 3 3-3" stroke="#B9B9B9" />
            </Svg>
          </View>
        </ButtonBody>
      </TouchableOpacity>
    </View>
  )
}

export const ButtonBody = ({ children }: { children: JSX.Element | JSX.Element[] }) =>
  (<View style={Styles.buttonBody}>
    {children}
  </View >)

const styles = StyleSheet.create({
  dropdownTitle: { marginLeft: 15, marginBottom: 9, color: '#b9b9b9' },
})