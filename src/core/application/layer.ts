

// enum LayerType {
//   LAYER = 'Layer',
//   ADJUSTMENT = 'Adjustment',
//   GROUP = 'Group'
// }

// enum BlendMode {
//   NORMAL = 'Normal',
//   PASSTHROUGH = 'Passthrough'
// }

// interface ILayerHolder {
//   layers: ILayer[]
//   closed: boolean
// }

// interface ILayer {
//   id: number,
//   parent: ILayerHolder
//   name: string,
//   mask: LayerMask | null
//   visible: boolean
// }

// class LayerMask {
//   enabled = true
//   transformLock = true
// }

// class LayerBase implements ILayer {
//   constructor(parent: ILayerHolder) {
//     this.parent = parent
//   }
//   id = -1
//   name = 'Layer'
//   visible = true
//   type = LayerType.LAYER
//   locked = false
//   mask = null

//   parent: ILayerHolder

//   opacity = 1
//   blendMode = BlendMode.NORMAL
// }


// class AdjustmentLayer extends LayerBase {
//   clippingMask = false
//   adjustment = null
// }

// class Layer extends LayerBase {
//   clippingMask = false
//   dimensions = [0, 0, 0, 0]
// }

// class GroupLayer extends LayerBase implements ILayerHolder {
//   constructor(parent: ILayerHolder) {
//     super(parent)
//     this.blendMode = BlendMode.PASSTHROUGH
//   }
//   layers = []
//   closed = false
// }


// export { LayerType, Layer, ILayerHolder, GroupLayer, AdjustmentLayer, LayerMask, ILayer }