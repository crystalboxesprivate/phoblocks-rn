import { combineReducers } from "redux"

const UI_LAYER_THUMBNAILS_BUTTON = 'UI_LAYER_THUMBNAILS_BUTTON'
const UI_LAYERS_LIST_BUTTON = 'UI_LAYERS_LIST_BUTTON'
const UI_LAYER_PROPERTIES_BUTTON = 'UI_LAYER_PROPERTIES_BUTTON'

export enum LayerListDisplayMode {
  List, Thumbnails, None
}

export const layersButtons = combineReducers({
  layerPropertiesButton: (state: boolean = false, action: any) => {
    if (action.type === UI_LAYER_PROPERTIES_BUTTON) {
      return !state
    }
    return state
  },
  layerListDisplayMode: (state: LayerListDisplayMode = LayerListDisplayMode.None, action: any) => {
    switch (action.type) {
      case UI_LAYER_THUMBNAILS_BUTTON:
        return state == LayerListDisplayMode.Thumbnails ? LayerListDisplayMode.None : LayerListDisplayMode.Thumbnails;
      case UI_LAYERS_LIST_BUTTON:
        return state == LayerListDisplayMode.List ? LayerListDisplayMode.None : LayerListDisplayMode.List;
      default:
        return state
    }
  }
})

type LayersButtons = {
  layerPropertiesButton: boolean,
  layerListDisplayMode: LayerListDisplayMode
}

export type UIState = {
  layersButtons: LayersButtons
}

export const ui = combineReducers({ layersButtons, })


export const UIAction = {
  layersThumbnailsButton: () => ({ type: UI_LAYER_THUMBNAILS_BUTTON }),
  layersListButton: () => ({ type: UI_LAYERS_LIST_BUTTON }),
  layerPropertiesButton: () => ({ type: UI_LAYER_PROPERTIES_BUTTON }),
}
