import { undoableOperationLog } from '../../components/DebugOverlay'
import { Layer, LayerType, ILayerHolder, GroupLayer, AdjustmentLayer, ILayer } from './layer'
import { Events, EventType } from '../events'
import AppState from './app-state'

const DocumentUnits = {
  PIXELS: 'Pixels',
  INCHES: 'Inches',
  CENTIMETERS: 'Centimeters',
  MILLIMETERS: 'Millimeters',
  POINTS: 'Points',
}

const DocumentOrientation = {
  PORTRAIT: 'Portrait',
  LANDSCAPE: 'Landscape'
}

const ResolutionUnits = {
  PPI: 'ppi',
  PPCM: 'ppcm'
}

const DocumentContents = {
  WHITE: 'white',
  BLACK: 'black',
  TRANSPARENT: 'transparent'
}

const ColorMode = {
  RGB8: 'RGB, 8 bit'
}

class Document implements ILayerHolder {
  constructor(appState: AppState) {
    this.appState = appState
  }
  closed = false
  // Creation
  name = 'Untitled-1'
  units = DocumentUnits.PIXELS
  width = 1920
  height = 1080

  // orientation
  resolution = 72
  resolutionUnits = ResolutionUnits.PPI

  // background contents
  colorMode = ColorMode.RGB8

  layers = []
  appState: AppState

  layerCounter = 0

  layersPool: Map<number, ILayer> = new Map()


  removeLayer(index: number) {
    if (typeof (index) !== 'number') {
      index = this.appState.activeLayer
    }
    undoableOperationLog('Remove Layer ' + index)
    const targetLayer = this.layersPool.get(index)
    if (targetLayer == null) {
      return
    }
    this.layersPool.delete(index)
    targetLayer.parent.layers.splice(targetLayer.parent.layers.indexOf(targetLayer), 1)
  }


  addLayer(type: string, parent?: ILayerHolder, name?: string, prefix?: string) {
    parent = parent || this
    let createdLayer = (() => {
      switch (type) {
        default:
        case LayerType.LAYER:
          {
            prefix = prefix || 'Layer'
            return new Layer(parent)
          }
        case LayerType.GROUP:
          {
            prefix = prefix || 'Group'
            return new GroupLayer(parent)
          }
        case LayerType.ADJUSTMENT:
          {
            prefix = prefix || 'Adjustment'
            return new AdjustmentLayer(parent)
          }
      }
    })()

    const layer = <ILayer>createdLayer
    layer.name = name || prefix + ' ' + (this.layerCounter + 1)
    undoableOperationLog('Add Layer ' + layer.name)

    this.layersPool.set(this.layerCounter, layer)
    layer.id = this.layerCounter
    parent.layers.push(layer)
    this.layerCounter++

    Events.invoke(EventType.LayerHierarchyChanged)
    return layer
  }
}

export {
  DocumentUnits,
  DocumentOrientation,
  ResolutionUnits,
  DocumentContents,
  ColorMode,
  Document
}
