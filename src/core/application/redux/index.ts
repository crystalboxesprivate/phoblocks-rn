import { document, ColorMode, DocumentDimensions, LayersRegistry } from './document'
import { viewer } from './viewer'
import { combineReducers, } from 'redux'

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
  activeLayer: number
  maskEditing: boolean
}

export type PhoblocksState = {
  document: DocumentState,
  viewer: ViewerState,
}

export const Combined = combineReducers({
  document,
  viewer,
})
