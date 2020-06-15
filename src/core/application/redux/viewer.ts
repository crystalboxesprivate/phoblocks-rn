import { combineReducers } from 'redux'

class ViewerState {
  position: [number, number] = [0, 0]
  scale: number = 1
  rotation: number = 0
}

export const VS_SET_POSITION = 'VS_SET_POSITION'
export const VS_SET_SCALE = 'VS_SET_SCALE'
export const VS_SET_ROTATION = 'VS_SET_ROTATION'

const position = (state = [0, 0], action: any) => {
  if (action.type === VS_SET_POSITION) { return action.value as [number, number] }
  return state
}

const scale = (state = 1, action: any) => {
  if (action.type === VS_SET_SCALE) { return action.value as number }
  return state
}

const rotation = (state = 0, action: any) => {
  if (action.type === VS_SET_ROTATION) { return action.value as number }
  return state
}

export const viewer = combineReducers({ position, scale, rotation })

export const ViewerAction = {
  setZoom: (newZoom: number) => ({ type: VS_SET_SCALE, value: newZoom }),
  setPosition: (pos: [number, number]) => ({ type: VS_SET_POSITION, value: pos }),
  setRotation: (rotation: number) => ({ type: VS_SET_ROTATION, value: rotation }),
}
