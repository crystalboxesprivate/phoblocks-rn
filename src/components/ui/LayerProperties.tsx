import Theme from '../Theme'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import Slider from './Slider'
import { Layer } from '../../core/application/redux/layer'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'
import React, { useState } from 'react'
import { Events } from '../../core/events'


const CollapseIcon = ({ isClosed }: { isClosed: boolean }) =>
  (<Svg style={{
    transform: [{ rotate: `${isClosed ? -90 : 0}deg` }],
    marginRight: 8.5
  }} width={11} height={7} viewBox="0 0 11 7" fill="none">
    <Path d="M1.5 1l4 4 4-4" stroke="#B9B9B9" />
  </Svg>)


const ButtonBody = ({ children }: { children: JSX.Element | JSX.Element[] }) =>
  (<View style={styles.buttonBody}>
    {children}
  </View >)

const DropdownList = ({ title, items, selectedItem }: {
  title: string,
  items?: string[],
  selectedItem: string
}) => {
  return (<View style={{ marginTop: 14 }}>
    {title != null ? <Text style={styles.dropdownTitle}>{title}</Text> : null}
    <ButtonBody>
      <Text style={styles.font16}>{selectedItem}</Text>
      <View>
        <Svg width={8} height={5} viewBox="0 0 8 5" fill="none">
          <Path d="M1 1l3 3 3-3" stroke="#B9B9B9" />
        </Svg>
      </View>
    </ButtonBody>
  </View>)
}

const Module = ({ title, children, closed, padding }:
  { title?: string, children?: JSX.Element | JSX.Element[], closed?: boolean, padding?: number }) => {
  const [isClosed, setIsClosed] = useState(closed as boolean)
  return (
    <View style={[styles.module, {
      paddingTop: padding || 20,
      paddingBottom: padding || 20
    }]}>
      {title == null ? null : (
        <TouchableWithoutFeedback onPress={() => {
          setIsClosed(!isClosed)
        }}>
          <View style={styles.moduleTitle}>
            <CollapseIcon isClosed={isClosed} />
            <Text style={styles.font16}>{title as string}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
      {
        isClosed ? null : children
      }
    </View>
  )
}

const s = {
}

const LayerDragTitle = () => {
  let posY = 0

  return (
    <View
      onStartShouldSetResponder={_ => true}
      onResponderGrant={e => {
        Events.invoke('LayerDragTitleStart')
        posY = e.nativeEvent.pageY
      }}
      onResponderMove={e => Events.invoke('LayerDragTitleMove', e.nativeEvent.pageY - posY)}
    >
      <View style={styles.layerDragTitle}>
        <Svg width={30} height={4} viewBox="0 0 30 4" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 2a2 2 0 012-2h26a2 2 0 110 4H2a2 2 0 01-2-2z"
            fill="#6E6E6E"
          />
        </Svg>
      </View>
      <Text style={[{ marginLeft: 15 }, styles.font16]}>Layer Properties</Text>
    </View>
  )
}

class LockableScrollView extends React.Component<{ id: string }, {
  enabled: boolean
}> {
  constructor(props: { id: string }) {
    super(props)
    this.state = { enabled: true }
  }
  componentDidMount() {
    Events.addListener(this.props.id + '_enable', () => this.setState({ enabled: true }))
    Events.addListener(this.props.id + '_disable', () => this.setState({ enabled: false }))
  }
  render() {
    return (<ScrollView scrollEnabled={this.state.enabled}>
      {this.props.children}
    </ScrollView>)
  }
}

const LayerProperties_ = ({ layer }: { layer: Layer }) => (
  <View style={styles.layerProperties}>
    <View style={styles.layerPropertiesInnerBlock}>
      <LayerDragTitle />
      <View style={styles.layerPreviewContainer}>
        <View style={styles.layerPropertiesPreview}></View>
        <Text style={styles.font14}>{layer.name}</Text>
      </View>
    </View>
    <LockableScrollView id='LayerProperties0'>
      <Module title='Blending Options' closed={false}>
        <Slider
          parentScrollViewId='LayerProperties0'
          title='Opacity'
          min={0}
          max={1}
          step={0.01}
          defaultValue={layer.opacity}
          valueDisplayfunc={(x: number) => Math.floor(x * 100) + '%'}
        />
        <DropdownList title='Blend Mode' selectedItem={layer.blendMode} />
      </Module>

      <Module padding={11}>
        <ButtonBody>
          <Svg style={{ marginRight: 1 }} width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.343 14.657A8 8 0 1014.604 3.29L14.5 3.5 14 4 3.343 14.657z"
              fill="#C4C4C4"
            />
            <Circle cx={9} cy={9} r={8} stroke="#C4C4C4" />
          </Svg>
          <Text style={styles.font16}>Add clipped adjustment</Text>
        </ButtonBody>
      </Module>
      <Module title='Effects' closed={true} />
      <Module title='Smart Filters' closed={true} />
    </LockableScrollView>
  </View>
)

const LayerProperties = connect((state: PhoblocksState) => ({
  layer: state.document.layersRegistry.entries[state.document.activeLayer]
}), {})(LayerProperties_)

const styles = StyleSheet.create({
  font16: {
    color: Theme.textBright0,
    fontSize: 16
  },
  font14: {
    color: Theme.textBright0,
    fontSize: 14
  },
  buttonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: Theme.buttonColor,
    borderWidth: 1,
    borderColor: Theme.separatorColor0,
    borderRadius: 4,
    paddingTop: 11, paddingRight: 17, paddingBottom: 11, paddingLeft: 15,

  },
  moduleTitle: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
  module: {
    borderTopWidth: 1,
    borderColor: Theme.bgColor,
  },
  dropdownTitle: { marginLeft: 15, marginBottom: 9, color: '#b9b9b9' },
  layerDragTitle: { justifyContent: 'center', flexDirection: 'row', marginBottom: 12 },
  layerProperties: {
    backgroundColor: Theme.panelColor,
    flex: 1
  },
  layerPropertiesInnerBlock: {
    paddingTop: 3,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderColor: Theme.bgColor
  },
  layerPropertiesPreview: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#909090',
    borderRadius: 2,
    marginRight: 18
  },
  layerPreviewContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 17, marginTop: 11 },
})

export default LayerProperties