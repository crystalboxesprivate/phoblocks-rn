import { combineReducers } from 'redux'

export type ViewportState = {
  position: [number, number],
  rotation: number,
  scale: number
}


const VS_SET_POSITION = 'VS_SET_POSITION'
const VS_SET_SCALE = 'VS_SET_SCALE'
const VS_SET_ROTATION = 'VS_SET_ROTATION'

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

export const viewport = combineReducers({ position, scale, rotation })

export const ViewportActions = {
  setZoom: (newZoom: number) => ({ type: VS_SET_SCALE, value: newZoom }),
  setPosition: (pos: [number, number]) => ({ type: VS_SET_POSITION, value: pos }),
  setRotation: (rotation: number) => ({ type: VS_SET_ROTATION, value: rotation }),
}
