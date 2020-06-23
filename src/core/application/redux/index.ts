import { document, ColorMode, DocumentDimensions, LayersRegistry } from './document'
import { viewer } from './viewer'
import { color, ColorState } from './color'
import { combineReducers, } from 'redux'
import { UIState, ui } from './ui'

type ViewerState = {
  position: [number, number],
  rotation: number,
  scale: number
}

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
  viewer: ViewerState,
  ui: UIState,
}

export const Combined = combineReducers({
  color,
  document,
  viewer,
  ui
})
