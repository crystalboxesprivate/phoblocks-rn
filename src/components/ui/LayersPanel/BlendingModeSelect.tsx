import { View } from "react-native"
import { BlendMode, LayerActions } from "../../../core/application/redux/layer"
import { DROPDOWN_SEPARATOR, DropdownList } from "./DropdownList"
import { useSelector, useDispatch } from "react-redux"
import { PhoblocksState } from "../../../core/application/redux"
import React from 'react'


const options = [
  BlendMode.NORMAL,
  BlendMode.DISSOLVE,
  DROPDOWN_SEPARATOR,
  BlendMode.DARKEN,
  BlendMode.MULTIPLY,
  BlendMode.COLORBURN,
  BlendMode.LINEARBURN,
  BlendMode.DARKENCOLOR,
  DROPDOWN_SEPARATOR,
  BlendMode.LIGHTEN,
  BlendMode.SCREEN,
  BlendMode.COLORDODGE,
  BlendMode.LINEARDODGE_ADD,
  BlendMode.LIGHTENCOLOR,
  DROPDOWN_SEPARATOR,
  BlendMode.OVERLAY,
  BlendMode.SOFTLIGHT,
  BlendMode.HARDLIGHT,
  BlendMode.VIVIDLIGHT,
  BlendMode.LINEARLIGHT,
  BlendMode.PINLIGHT,
  BlendMode.HARDMIX,
  DROPDOWN_SEPARATOR,
  BlendMode.DIFFERENCE,
  BlendMode.EXCLUSION,
  BlendMode.SUBTRACT,
  BlendMode.DIVIDE,
  DROPDOWN_SEPARATOR,
  BlendMode.HUE,
  BlendMode.SATURATION,
  BlendMode.COLOR,
  BlendMode.LUMINOSITY,
]

type BlendingModeSelectProps = {
  id: number
}

export const BlendingModeSelect = ({ id }: BlendingModeSelectProps) => {
  const blendingMode = useSelector((state: PhoblocksState) =>
    state.document.layersRegistry.entries[id].blendMode)
  const dispatch = useDispatch()
  const setBlendMode = (blendMode: string) => dispatch(LayerActions.setBlendMode(id, blendMode as BlendMode))

  return <DropdownList
    title='Blend Mode'
    setValue={setBlendMode}
    items={options}
    selectedItem={blendingMode}
  />
}