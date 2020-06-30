import { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { PhoblocksState } from "../../core/application/redux"
import { ViewportActions } from "../../core/application/redux/ui/viewport"

export const useViewportState = (): [[number, number], number, number, any, any, any] => {
  const [position, setPosition] = useState([0, 0])
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  return [position as [number, number], scale, rotation, (x: number, y: number) => setPosition([x, y]), setScale, setRotation]
}

export const useViewportState2 = (): [[number, number], number, number, any, any, any] => {
  const position = useSelector((state: PhoblocksState) => state.ui.viewport.position)
  const scale = useSelector((state: PhoblocksState) => state.ui.viewport.scale)
  const rotation = useSelector((state: PhoblocksState) => state.ui.viewport.rotation)
  const dispatch = useDispatch()


  const setPosition = (x: number, y: number) => dispatch(ViewportActions.setPosition([x, y]))
  const setScale = (scale: number) => dispatch(ViewportActions.setZoom(scale))
  const setRotation = (rot: number) => dispatch(ViewportActions.setRotation(rot))
  return [position, scale, rotation, setPosition, setScale, setRotation]
}

export const useDocumentSize = () => {
  const width = useSelector((state: PhoblocksState) => state.document.dimensions.width)
  const height = useSelector((state: PhoblocksState) => state.document.dimensions.height)
  return [width, height]
}
