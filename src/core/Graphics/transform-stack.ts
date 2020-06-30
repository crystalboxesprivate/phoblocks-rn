
import { vec2, vec3, mat4 } from 'gl-matrix'
import { getWidth, getHeight } from './context'

export class Transform {
  rotate = 0
  scale = vec2.fromValues(1, 1)
  translate = vec2.create()

  get matrix() {

    let mat = mat4.create()
    mat4.translate(mat, mat,
      vec3.fromValues(this.translate[0], this.translate[1], 0))
    mat4.rotate(mat, mat, this.rotate, [0, 0, 1])
    mat4.scale(mat, mat, vec3.fromValues(this.scale[0], this.scale[1], 1))

    return mat
  }
}

export class TransformStack {
  transforms: Array<Transform> = []
  cachedMatrix = mat4.create()
  isDirtyTransform = true

  get matrix() {
    if (this.isDirtyTransform) {
      this.cachedMatrix = mat4.create()
      mat4.ortho(this.cachedMatrix, 0, getWidth(), getHeight(), 0, -1, 1)
      for (let x = this.transforms.length - 1; x >= 0; x--) {
        let transform = this.transforms[x]
        mat4.mul(this.cachedMatrix, this.cachedMatrix, transform.matrix)
      }
      this.isDirtyTransform = false
    }
    return this.cachedMatrix
  }

  setDirty() {
    this.isDirtyTransform = true
  }
}
