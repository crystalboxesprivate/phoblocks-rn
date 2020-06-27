import { Tool } from "../../../core/application/redux/tool";

export const IconNameMap: Map<Tool, string> = new Map([
  [Tool.Move, 'selectTool'],
  [Tool.Brush, 'brushTool'],
])