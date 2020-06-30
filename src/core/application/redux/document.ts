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
  width = 640
  height = 480
  resolution = 72
  resolutionUnits = ResolutionUnits.PPI
}

export class Document {
  closed = false
  name = 'Untitled-1'
  dimensions = new DocumentDimensions
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
export const DA_BUMP_HIERARCHY_CHANGE_ID = 'DA_BUMP_HIERARCHY_CHANGE_ID'

export const DocumentActionType = [
  DA_NONE,
  DA_CLOSE,
  DA_SET_NAME,
  DA_SET_COLOR_MODE,
  DA_SET_IMAGE_RESOLUTION,
  DA_ADD_LAYER,
  DA_PARENT_LAYER,
  DA_SET_MASK_EDITING,
  DA_SET_SELECTED_LAYER,
  DA_BUMP_HIERARCHY_CHANGE_ID
]

// const activeLayer = (state = 0, action: any) =>
//   action.type === DA_SET_SELECTED_LAYER ? action.id : state

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


export type LayersRegistry = {
  entries: Layer[]
  docChildren: number[]
  activeLayer: number
  hierarchyChangeId: number
}

const arrayMove = (arr: any[], old_index: number, new_index: number) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

type AddLayerAction = {
  layerType: LayerType,
  parent: number,
  previousLayer: number
}


const layersRegistry = (state: LayersRegistry = { docChildren: [], activeLayer: 0, entries: [], hierarchyChangeId: 0 }, action: any) => {
  if (LayerActionType.indexOf(action.type) !== -1) {

    const layerAction = action
    const newEntries = [...state.entries]
    const newChildren = [...state.docChildren]
    newEntries[layerAction.id] = layerReducer(newEntries[layerAction.id], layerAction)
    return { ...state, entries: newEntries, docChildren: newChildren }

  } else {
    switch (action.type) {
      case DA_SET_SELECTED_LAYER:
        return { ...state, activeLayer: action.id }
      case DA_ADD_LAYER:
        {
          const { layerType, parent, previousLayer } = action as AddLayerAction
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
            const newId = parentObject.layers.length
            parentObject.layers.push(nextId)
            if (previousLayer !== -1) {
              const idx = parentObject.layers.indexOf(previousLayer) + 1
              if (idx != parentObject.layers.length) {
                arrayMove(parentObject.layers, newId, idx)
              }
            }
          } else {
            const newId = newChildren.length
            newChildren.push(nextId)
            if (previousLayer !== -1) {
              const idx = newChildren.indexOf(previousLayer) + 1
              if (idx != newChildren.length) {
                arrayMove(newChildren, newId, idx)
              }
            }
          }

          return { activeLayer: layer.id, hierarchyChangeId: state.hierarchyChangeId + 1, entries: newEntries, docChildren: newChildren }
        }
      case DA_PARENT_LAYER:
        const entries = [...state.entries]
        const children = [...state.docChildren]
        const { layerId, parentId, listPosition } = action
        const layer = entries[layerId]
        const getCollection = (id: number) => (id === -1 ? children : entries[id].layers)
        if (layer.parent === parentId) {
          const collection = getCollection(parentId)
          arrayMove(collection, collection.indexOf(layerId), listPosition)
        } else {
          // remove from the old parent
          let collection = getCollection(layer.parent)
          collection.splice(collection.indexOf(layerId), 1)
          // reparent
          layer.parent = parentId
          collection = getCollection(parentId)
          collection.push(layerId)
          if (listPosition != undefined) {
            arrayMove(collection, collection.indexOf(layerId), listPosition)
          }
        }
        return { ...state, entries, docChildren: children, hierarchyChangeId: state.hierarchyChangeId + 1, }
      case DA_BUMP_HIERARCHY_CHANGE_ID:
        return { ...state, hierarchyChangeId: state.hierarchyChangeId + 1, }
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
  addLayer: (layerType: LayerType, parent = -1, previousLayer = -1) =>
    ({ type: DA_ADD_LAYER, layerType, parent, previousLayer }),
  parentLayer: (layerId: number, parentId: number, listPosition?: number) => ({ type: DA_PARENT_LAYER, layerId, parentId, listPosition }),
  setWidthHeight: (width: number, height: number) =>
    ({ type: DA_SET_IMAGE_RESOLUTION, width: width, height: height }),
  bumpHierarchyChangeId: () => ({ type: DA_BUMP_HIERARCHY_CHANGE_ID })
}

export const document = combineReducers({
  closed, name, colorMode, dimensions, layersRegistry, maskEditing
})
