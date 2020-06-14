import React from 'react'
import { ToolIcon, ToolSeparator } from './ToolIcon'
import { Sidebar, ToolGroup } from './Sidebar'
import ColorSelector from './ColorSelector'


const Toolbar = () => <Sidebar>
  <ToolGroup>
    <ToolIcon
      style={{ margin: '3px 0 0 2px' }}
      isActive={true}
      name='selectTool'
    />
    <ToolIcon name='transformTool' />
    <ToolIcon name='lassoTool' hasOptions={true} />
    <ToolIcon name='brushTool' hasOptions={true} />
    <ToolIcon name='eraserTool' hasOptions={true} />
    <ToolIcon name='paintBucketTool' hasOptions={true} />
    <ToolIcon name='patchTool' hasOptions={true} />
    <ToolIcon name='cropTool' />
    <ToolSeparator />
    <ToolIcon name='textTool' />
    <ToolIcon name='pictureTool' />
    <ToolSeparator />
    <ToolIcon name='eyeDropper' />
    <ColorSelector
      backgroundColor='#FFF'
      foregroundColor='#000'
      isBackgroundActive={false}
    />
  </ToolGroup>
</Sidebar>

export default Toolbar
