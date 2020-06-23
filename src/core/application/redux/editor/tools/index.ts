/*

tool = {
  current : tool id
}
*/

// enum ToolId {
//   Move, Transform, Lasso, Brush, Eraser, PaintBucket, Healing, Crop, Text, Image, ColorPicker
// }

// const TLL_SET_CURRENT = 'TLL_SET_CURRENT'

// const current = (state = ToolId.Move, action: any) => action.type === TLL_SET_CURRENT ? action.tool : state


// export const ToolActions = {
//   setCurrent(tool: ToolId) { return { type: TLL_SET_CURRENT, tool } },

// }


const Tools = [
  { name: 'Move' },
  { name: 'Transform' },
  [{ name: 'Transform' },]
]