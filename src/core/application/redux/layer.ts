
export enum LayerType {
  LAYER = 'Layer',
  ADJUSTMENT = 'Adjustment',
  GROUP = 'Group'
}

export enum BlendMode {
  NORMAL = 'Normal', // Normal
  DISSOLVE = 'Dissolve', // Dissolve
  // ---
  DARKEN = 'Darken', // Darken
  MULTIPLY = 'Multiply', // Multiply
  COLORBURN = 'Color Burn', // Color Burn
  LINEARBURN = 'Linear Burn', // Linear Burn
  DARKENCOLOR = 'Darken Color', // Darken Color
  // ----
  LIGHTEN = 'Lighten', // Lighten
  SCREEN = 'Screen', // Screen
  COLORDODGE = 'Color Dodge', // Color Dodge
  LINEARDODGE_ADD = 'Linear Dodge (Add)', // Linear Dodge (Add)
  LIGHTENCOLOR = 'Lighten Color', // Lighten Color
  // ----
  OVERLAY = 'Overlay', // Overlay
  SOFTLIGHT = 'Soft Light', // Soft Light
  HARDLIGHT = 'Hard Light', // Hard Light
  VIVIDLIGHT = 'Vivid Light', // Vivid Light
  LINEARLIGHT = 'Linear Light', // Linear Light
  PINLIGHT = 'Pin Light', // Pin Light
  HARDMIX = 'Hard Mix', // Hard Mix
  // ----
  DIFFERENCE = 'Difference', // Difference
  EXCLUSION = 'Exclusion', // Exclusion
  SUBTRACT = 'Subtract', // Subtract
  DIVIDE = 'Divide', // Divide
  // ----
  HUE = 'Hue', // Hue
  SATURATION = 'Saturation', // Saturation
  COLOR = 'Color', // Color
  LUMINOSITY = 'Luminosity', // Luminosity
  PASSTHROUGH = 'Passthrough'
}

export const LA_NONE = 'LA_NONE'
export const LA_SET_NAME = 'LA_SET_NAME'
export const LA_TOGGLE_VISIBLE = 'LA_TOGGLE_VISIBLE'
export const LA_SET_LOCKED = 'LA_SET_LOCKED'
export const LA_ADD_LAYER_MASK = 'LA_ADD_LAYER_MASK'
export const LA_SET_MASK_ENABLED = 'LA_SET_MASK_ENABLED'
export const LA_SET_MASK_TRANSFORM_LOCKED = 'LA_SET_MASK_TRANSFORM_LOCKED'
export const LA_ENABLE_CLIPPING_MASK = 'LA_ENABLE_CLIPPING_MASK'
export const LA_TOGGLE_GROUP_CLOSED = 'LA_TOGGLE_GROUP_CLOSED'
export const LA_SET_OPACITY = 'LA_SET_OPACITY'
export const LA_SET_BLEND_MODE = 'LA_SET_BLEND_MODE'

export const LayerActionType = [
  LA_NONE,
  LA_SET_NAME,
  LA_TOGGLE_VISIBLE,
  LA_SET_LOCKED,
  LA_ADD_LAYER_MASK,
  LA_SET_MASK_ENABLED,
  LA_SET_MASK_TRANSFORM_LOCKED,
  LA_ENABLE_CLIPPING_MASK,
  LA_TOGGLE_GROUP_CLOSED,
  LA_SET_OPACITY,
  LA_SET_BLEND_MODE,
]

export class Layer {
  id = -1
  type = LayerType.LAYER
  name = 'Layer'
  visible = true
  locked = false
  mask: LayerMask | null = null
  parent = -1
  opacity = 1.0
  blendMode = BlendMode.NORMAL
  closed = false
  layers: number[] = []
  clippingMask: boolean = false
}


export class LayerMask {
  enabled = true
  transformLock = true
}

export const createLayer = (type: LayerType) => {
  const l = new Layer
  l.type = type
  return l
}

export const layerReducer = (state: Layer, action: any) => {
  switch (action.type) {
    case LA_SET_BLEND_MODE:
      return { ...state, blendMode: action.blendMode }
    case LA_SET_OPACITY:
      return { ...state, opacity: action.opacity }
    case LA_ENABLE_CLIPPING_MASK:
      return { ...state, clippingMask: action.clippingMask }
    case LA_SET_NAME:
      return { ...state, name: (action as { name: string }).name }
    case LA_TOGGLE_VISIBLE:
      return { ...state, visible: !state.visible }
    case LA_TOGGLE_GROUP_CLOSED:
      return { ...state, closed: !state.closed }
    case LA_SET_LOCKED:
      return { ...state, locked: (action as { locked: boolean }).locked }
    case LA_SET_MASK_TRANSFORM_LOCKED:
      {
        if (!state.mask) {
          // WARN invalid op
          return state
        }
        return {
          ...state, mask: { ...state.mask, transformLock: (action as { locked: boolean }).locked }
        }
      }
    case LA_ADD_LAYER_MASK:
      return { ...state, mask: new LayerMask }
    case LA_SET_MASK_ENABLED: {
      if (!state.mask) {
        // WARN invalid op
        return state
      }
      return {
        ...state, mask: { ...state.mask, enabled: (action as { enabled: boolean }).enabled }
      }
    }
    default: return state
  }
}

export const LayerActions = {
  setOpacity: (id: number, opacity: number) => ({ id, type: LA_SET_OPACITY, opacity }),
  setClippingMask: (id: number, enabled: boolean) => ({ type: LA_ENABLE_CLIPPING_MASK, id, clippingMask: enabled }),
  setName: (id: number, name: string) => ({ type: LA_SET_NAME, name, id }),
  setLocked: (id: number, locked: boolean) => ({ type: LA_SET_LOCKED, locked, id }),
  addLayerMask: (id: number) => ({ type: LA_ADD_LAYER_MASK, id }),
  toggleVisible: (id: number) => ({ type: LA_TOGGLE_VISIBLE, id }),
  toggleGroupClosed: (id: number) => ({ type: LA_TOGGLE_GROUP_CLOSED, id }),
  setMaskEnabled: (id: number, enabled: boolean) => ({ type: LA_SET_MASK_ENABLED, enabled, id }),
  setMaskTransformLocked: (id: number, locked: boolean) => ({ type: LA_SET_MASK_TRANSFORM_LOCKED, locked, id }),
  setBlendMode: (id: number, blendMode: BlendMode) => ({ type: LA_SET_BLEND_MODE, blendMode, id })
}
