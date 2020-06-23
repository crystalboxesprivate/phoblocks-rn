const COL_SET_PRIMARY = 'COL_SET_PRIMARY'
const COL_SET_SECONDARY = 'COL_SET_SECONDARY'

export type ColorState = {
  primary: [number, number, number]
  secondary: [number, number, number]
}

export const color = (state: ColorState = { primary: [0, 0, 0], secondary: [0, 0, 100] }, action: any) => {
  switch (action.type) {
    case COL_SET_PRIMARY:
      {
        const value = action.value
        return { ...state, primary: value }
      }
    case COL_SET_SECONDARY:
      {
        const value = action.value
        return { ...state, secondary: value }
      }
  }
  return state
}


export const ColorActions = {
  setPrimary: (value: [number, number, number]) => ({ type: COL_SET_PRIMARY, value }),
  setSecondary: (value: [number, number, number]) => ({ type: COL_SET_SECONDARY, value }),
} 