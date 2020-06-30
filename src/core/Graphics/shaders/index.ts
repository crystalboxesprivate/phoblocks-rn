import image from './image'
import solid from './solid'
import sample from './sample'
import { Shader, createShader } from '../shader'

export const Shaders = { image, solid, sample }

let solidShader: Shader | null = null
export const getSolidShader = () => {
  if (!solidShader) {
    solidShader = createShader(solid.vert, solid.frag)
  }
  return solidShader
}
