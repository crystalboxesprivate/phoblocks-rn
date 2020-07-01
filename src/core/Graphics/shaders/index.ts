import image from './image'
import solid from './solid'
import sample from './sample'
import { Shader, createShader } from '../shader'
import { checkerFrag } from './checker'

export const Shaders = { image, solid, sample }

let solidShader: Shader | null = null
export const getSolidShader = () => {
  if (!solidShader) {
    solidShader = createShader(solid.vert, solid.frag)
  }
  return solidShader
}

let checkerShader: Shader | null = null
export const getCheckerShader = () => {
  if (!checkerShader) {
    checkerShader = createShader(image.vert, checkerFrag)
  }
  return checkerShader
}