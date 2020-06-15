import Theme from '../Theme'
import { View, Text } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import Slider from './Slider'
import { Layer } from '../../core/application/redux/layer'
import { connect } from 'react-redux'
import { PhoblocksState } from '../../core/application/redux'


const CollapseIcon = ({ isClosed }: { isClosed: boolean }) => (
  <View style={{
    transform: [{ rotate: `${isClosed ? -90 : 0}deg` }],
    marginRight: 8.5
  }}>
    <Svg width={11} height={7} viewBox="0 0 11 7" fill="none">
      <Path d="M1.5 1l4 4 4-4" stroke="#B9B9B9" />
    </Svg>
  </View>)


const PropertiesTitle = ({ title, hasToggle, isClosed }: { title: string, hasToggle: boolean | undefined, isClosed: boolean | undefined }) => {
  if (typeof (hasToggle) !== 'boolean') { hasToggle = true }
  if (typeof (isClosed) !== 'boolean') { isClosed = false }
  let marginBottomTitle = 0
  if (hasToggle && !isClosed) {
    marginBottomTitle = 20
  }
  return (
    <div style={{ marginLeft: 15, marginBottom: marginBottomTitle, fontSize: 16, display: 'flex', alignItems: 'center' }}>
      {hasToggle ? <CollapseIcon isClosed={isClosed} /> : ''}
      <div>{title}</div>
    </div>
  )
}

const Module = ({
  children,
  title,
  hasToggle,
  isClosed,
  noPaddingTop,
  padding,
  style
}: {
  children?: JSX.Element | JSX.Element[],
  title?: string,
  hasToggle?: boolean,
  isClosed?: boolean,
  noPaddingTop?: boolean,
  padding?: number | string,
  style?: object
}) => {
  padding = padding || 20
  let defaultStyle: object = {
    paddingBottom: padding
  }
  if (style) {
    defaultStyle = style
  }
  return (
    <View style={{
      flex: 1,
      paddingTop: noPaddingTop ? 0 : padding,
      // borderTop: noPaddingTop ? 0 : `1 solid ${Theme.bgColor}`,
      ...defaultStyle
    }}>
      {title != null ? <PropertiesTitle title={title} hasToggle={hasToggle} isClosed={isClosed} /> : null}
      {children}
    </View>
  )
}

const ButtonBody = ({ children }: { children: JSX.Element | JSX.Element[] }) => (<View style={{
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'space-between',
  // marginLeft: 16,
  // marginRight: 16,
  // background: Theme.buttonColor,
  // border: `1px solid ${Theme.separatorColor0}`,
  // borderRadius: 4,
  // padding: '11px 17px 11px 15px',
  // fontSize: 16
}}>
  {children}
</View >)

const DropdownList = ({ title, items, selectedItem }: {
  title: string,
  items?: string[],
  selectedItem: string
}) => {
  return (<View style={{ marginTop: 14 }}>
    {title != null ? <div style={{ marginLeft: 15, marginBottom: 9 }}>{title}</div> : {}}
    <ButtonBody>
      <Text>{selectedItem}</Text>
      <View>
        <Svg width={8} height={5} viewBox="0 0 8 5" fill="none">
          <Path d="M1 1l3 3 3-3" stroke="#B9B9B9" />
        </Svg>
      </View>
    </ButtonBody>
  </View>)
}

const LayerProperties_ = ({ layer }: { layer: Layer }) => (
  <View style={{
    // fontFamily: Theme.fontFamily,
    // color: Theme.textBright0,
  }}>
    <Module title='Layer Properties' hasToggle={false} noPaddingTop={true} padding={12} style={{ paddingBottom: 0 }}>
      <View style={{ display: 'flex', marginTop: 11, alignItems: 'center', marginLeft: 17, marginBottom: 12 }}>
        <View style={{
          width: 32,
          height: 32,
          backgroundColor: '#FFFFFF',
          // border: '1px solid #909090',
          // boxSizing: 'border-box',
          borderRadius: 2,
          marginRight: 18
        }}></View>
        <Text style={{ fontSize: 14 }}>{layer.name}</Text>
      </View>
    </Module>
    <Module title='Blending options'>
      {/*
      <Slider title='Opacity' defaultValue={0.5} valueDisplayfunc={(x: number) => Math.floor(x * 100) + '%'} />
      
      */}
      <DropdownList title='BlendMode' selectedItem={layer.blendMode} />
    </Module>

    <Module padding={11}>
      <ButtonBody>
        <View>
          <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.343 14.657A8 8 0 1014.604 3.29L14.5 3.5 14 4 3.343 14.657z"
              fill="#C4C4C4"
            />
            <Circle cx={9} cy={9} r={8} stroke="#C4C4C4" />
          </Svg>
        </View>
        <Text>Add clipped adjustment</Text>
      </ButtonBody>
    </Module>
    <Module title='Effects' isClosed={true} />
    <Module title='Smart Filters' isClosed={true} />
  </View>
)

const LayerProperties = connect((state: PhoblocksState) => ({
  layer: state.document.layersRegistry.entries[state.document.activeLayer]
}), {})(LayerProperties_)

export default LayerProperties