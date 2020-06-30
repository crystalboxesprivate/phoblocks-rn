export type Color = number | [number, number, number, number]
export const getRgba = (col: Color) => {
  if (typeof (col) === "number") {
    return [col, col, col, 1] as [number, number, number, number]
  } else {
    return col
  }
}
export const getRandomColor = (): Color => {
  return [
    Math.random(),
    Math.random(),
    Math.random(),
    1]
}