import { combineReducers } from "redux"
import { LayerButtonsActions, LayersButtons, layersButtons } from "./layerButtons"
import { ViewportState, viewport } from "./viewport"


export type UIState = {
  layersButtons: LayersButtons
  viewport: ViewportState
}

export const ui = combineReducers({ layersButtons, viewport })

export const UIAction = {
  ...LayerButtonsActions
}
