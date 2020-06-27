import React from 'react'
import { ToolIcon, ToolSeparator } from './ToolIcon'
import { Sidebar, ToolGroup } from '../Sidebar'
import ColorSelector from '../ColorSelector'
import { useSelector, useDispatch } from 'react-redux'
import { PhoblocksState } from '../../../core/application/redux'
import { StyleProp, ViewStyle, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import { Tool, ToolActions } from '../../../core/application/redux/tool'
import { IconNameMap } from './IconNameMap'


const ToolIconButton = ({ tool, style }: { tool: Tool, style?: StyleProp<ViewStyle> }) => {
  const dispatch = useDispatch()
  const isActive = useSelector((state: PhoblocksState) => state.tool.current === tool)

  return <TouchableOpacity onPress={() => { if (!isActive) { dispatch(ToolActions.setCurrent(tool)) } }}>
    <ToolIcon
      style={style}
      isActive={isActive}
      name={IconNameMap.get(tool) || ''}
    />
  </TouchableOpacity>
}


const Toolbar = () => {
  return (<Sidebar>
    <ToolGroup style={{ justifyContent: 'center' }}>
      <ToolIconButton
        tool={Tool.Move}
        style={{ margin: '3px 0 0 2px' }}
      />
      <ToolIconButton tool={Tool.Brush} />
      <ToolSeparator />
      <ColorSelector />
    </ToolGroup>
  </Sidebar>)
}

// const Toolbar = () => <Sidebar>
//   <ToolGroup>
//     <ToolIcon name='transformTool' />
//     <ToolIcon name='lassoTool' hasOptions={true} />
//     <ToolIcon name='brushTool' hasOptions={true} />
//     <ToolIcon name='eraserTool' hasOptions={true} />
//     <ToolIcon name='paintBucketTool' hasOptions={true} />
//     <ToolIcon name='patchTool' hasOptions={true} />
//     <ToolIcon name='cropTool' />
//     <ToolSeparator />
//     <ToolIcon name='textTool' />
//     <ToolIcon name='pictureTool' />
//     <ToolSeparator />
//     <ToolIcon name='eyeDropper' />
//     <ColorSelector />
//   </ToolGroup>
// </Sidebar>

export default Toolbar
