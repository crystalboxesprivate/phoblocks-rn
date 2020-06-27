import { combineReducers } from "redux"

export enum Tool {
  Move, Brush
}

export type ToolState = {
  current: Tool
}

const TOOL_SET_CURRENT = 'TOOL_SET_CURRENT'

export const current = (state = Tool.Move, action: any) => action.type === TOOL_SET_CURRENT ? action.tool : state


export const tool = combineReducers({
  current
})


export const ToolActions = {
  setCurrent: (tool: Tool) => ({ type: TOOL_SET_CURRENT, tool })
}