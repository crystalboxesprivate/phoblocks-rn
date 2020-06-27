import { document, ColorMode, DocumentDimensions, LayersRegistry } from './document'
import { color, ColorState } from './editor/color'
import { combineReducers, } from 'redux'
import { UIState, ui } from './ui'
import { ToolState, tool } from './tool'

type DocumentState = {
  closed: boolean,
  name: string,
  colorMode: ColorMode,
  dimensions: DocumentDimensions,
  layersRegistry: LayersRegistry,
  maskEditing: boolean
}

export type PhoblocksState = {
  color: ColorState
  document: DocumentState,
  ui: UIState,
  tool: ToolState
}

export const Combined = combineReducers({
  color,
  document,
  ui,
  tool
})
