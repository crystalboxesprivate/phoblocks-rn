import { combineReducers } from "redux";
import { LayerType, createLayer, Layer, layerReducer, LayerActionType } from "./layer";
export enum DocumentUnits {
  PIXELS = 'Pixels',
  INCHES = 'Inches',
  CENTIMETERS = 'Centimeters',
  MILLIMETERS = 'Millimeters',
  POINTS = 'Points',
}

export enum DocumentOrientation {
  PORTRAIT = 'Portrait',
  LANDSCAPE = 'Landscape'
}

export enum ResolutionUnits {
  PPI = 'ppi',
  PPCM = 'ppcm'
}

export enum DocumentContents {
  WHITE = 'white',
  BLACK = 'black',
  TRANSPARENT = 'transparent'
}

export enum ColorMode {
  RGB8 = 'RGB, 8 bit'
}

export class DocumentDimensions {
  units = DocumentUnits.PIXELS
  width = 1920
  height = 1080
  resolution = 72
  resolutionUnits = ResolutionUnits.PPI
}

export class Document {
  closed = false
  name = 'Untitled-1'
  dimensions = new DocumentDimensions()
  colorMode = ColorMode.RGB8
  layersRegistry = []
}

export const DA_NONE = 'DA_NONE'
export const DA_CLOSE = 'DA_CLOSE'
export const DA_SET_NAME = 'DA_SET_NAME'
export const DA_SET_COLOR_MODE = 'DA_SET_COLOR_MODE'
export const DA_SET_IMAGE_RESOLUTION = 'DA_SET_IMAGE_RESOLUTION'
export const DA_ADD_LAYER = 'DA_ADD_LAYER'
export const DA_PARENT_LAYER = 'DA_PARENT_LAYER'
export const DA_SET_MASK_EDITING = 'DA_SET_MASK_EDITING'
export const DA_SET_SELECTED_LAYER = 'DA_SET_SELECTED_LAYER'

export const DocumentActionType = [
  DA_NONE,
  DA_CLOSE,
  DA_SET_NAME,
  DA_SET_COLOR_MODE,
  DA_SET_IMAGE_RESOLUTION,
  DA_ADD_LAYER,
  DA_PARENT_LAYER,
  DA_SET_MASK_EDITING,
  DA_SET_SELECTED_LAYER
]

const activeLayer = (state = 0, action: any) =>
  action.type === DA_SET_SELECTED_LAYER ? action.id : state

const maskEditing = (state = false, action: any) => {
  return action.type === DA_SET_MASK_EDITING ? action.enabled : state
}

const closed = (state = false, action: any) =>
  action.type === DA_CLOSE ? true : state

const name = (state = 'Untitled-1', action: any) =>
  action.type === DA_SET_NAME ? (action as { name: string }).name : state

const colorMode = (state = ColorMode.RGB8, action: any) =>
  action.type === DA_SET_COLOR_MODE ? (action as { colorMode: ColorMode }).colorMode : state

const dimensions = (state = new DocumentDimensions, action: any) => {
  switch (action.type) {
    case DA_SET_IMAGE_RESOLUTION:
      const { width, height } = (action as { width: number, height: number })
      return ({ ...state, width: width, height: height }) as DocumentDimensions
    default:
      return state
  }
}


export class LayersRegistry {
  entries: Layer[]
  docChildren: number[]
  constructor(entries: Layer[] = [], children: number[] = []) {
    this.entries = entries
    this.docChildren = children
  }
}


const layersRegistry = (state = new LayersRegistry, action: any) => {
  if (LayerActionType.indexOf(action.type) !== -1) {

    const layerAction = action
    const newEntries = [...state.entries]
    const newChildren = [...state.docChildren]
    newEntries[layerAction.id] = layerReducer(newEntries[layerAction.id], layerAction)
    return new LayersRegistry(newEntries, newChildren)

  } else {
    switch (action.type) {
      case DA_ADD_LAYER:
        {
          const { layerType, parent, listOrder } = action as { layerType: LayerType, parent: number, listOrder: number }
          const layer = createLayer(layerType)
          const newEntries = [...state.entries, layer]
          const nextId = state.entries.length
          layer.id = nextId
          const newChildren = [...state.docChildren]

          const prefix = (() => {
            if (layerType === LayerType.LAYER) {
              return 'Layer'
            } else if (layerType === LayerType.GROUP) {
              return 'Group'
            }
            return 'Adjustment'
          })()
          layer.name = `${prefix} ${nextId + 1}`

          if (parent !== -1) {
            const parentObject = newEntries[parent]
            layer.parent = parent
            parentObject.layers.push(nextId)
            console.log(parent)
          } else {
            newChildren.push(nextId)
          }
          return new LayersRegistry(newEntries, newChildren)
        }
      case DA_PARENT_LAYER:
        const newEntries = [...state.entries]
        const newChildren = [...state.docChildren]

        const { layerId, parentId } = action as { layerId: number, parentId: number }

        // remove from the old parent
        const layer = newEntries[layerId]
        if (layer.parent === parentId) {
          // WARN: illegal operation
          return state
        }
        if (layer.parent === -1) {
          newChildren.splice(newChildren.indexOf(layerId), 1)
        } else {
          newEntries[layer.parent].layers.splice(newEntries[layer.parent].layers.indexOf(layerId), 1)
        }

        // add to the new parent
        if (parentId === -1) {
          newChildren.push(layerId)
        } else {
          newEntries[parentId].layers.push(layerId)
        }

        // set the new parent id for the layer
        layer.parent = parentId
        return new LayersRegistry(newEntries, newChildren)
      default:
        return state
    }
  }
}

export const DocumentActions = {

  setActiveLayer: (id: number) => ({ type: DA_SET_SELECTED_LAYER, id }),
  setMaskEditing: (enabled: boolean) => ({ type: DA_SET_MASK_EDITING, enabled }),
  close: () => ({ type: DA_CLOSE }),
  setColorMode: (colorMode: ColorMode) => ({ type: DA_SET_COLOR_MODE, colorMode }),

  setName: (name: string) => ({ type: DA_SET_NAME, name }),
  addLayer: (layerType: LayerType, parent = -1, listOrder = -1) =>
    ({ type: DA_ADD_LAYER, layerType, parent, listOrder }),
  parentLayer: (layerId: number, parentId: number) => ({ type: DA_PARENT_LAYER, layerId, parentId }),
  setWidthHeight: (width: number, height: number) =>
    ({ type: DA_SET_IMAGE_RESOLUTION, width: width, height: height })
}

export const document = combineReducers({
  closed, name, colorMode, dimensions, layersRegistry, activeLayer, maskEditing
})
