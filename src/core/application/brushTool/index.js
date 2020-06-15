// import Graphics from '../../gl/Graphics'
// import { vec2 } from 'gl-matrix'
// import Framebuffer from '../../gl/Framebuffer'
// import { Color } from '../../gl/Color'
// import { overlayLog } from '../../../components/DebugOverlay'
// class BrushTool {
//   constructor(state) {
//     console.log(state)

//     // create shader
//     this.state = state
//     this.isBeingUsed = false

//     this.lastPos = [0, 0]
//     this.settings = {
//       step: 1,
//       opacity: 0.5,
//       size: 10,
//       hardness: 100,
//     }
//     this.initialized = false
//   }

//   get canvasFramebuffer() {
//     return this.state.canvas.framebuffer
//   }
//   get framebuffer() {
//     return this.brushFramebuffer
//   }
//   initfb() {
//     if (this.initialized) {
//       return
//     }
//     this.initialized = true
//     this.previousStateFb = new Framebuffer()
//     this.brushFramebuffer = new Framebuffer()
//     this.previousStateFb.allocate(
//       this.canvasFramebuffer.width,
//       this.canvasFramebuffer.height
//     )
//     this.brushFramebuffer.allocate(
//       this.canvasFramebuffer.width,
//       this.canvasFramebuffer.height
//     )

//     this.brushBlendShader = null /* Graphics.createShader(
//       require('../../gl/shaders/image-uvflip.vert.glsl'),
//       require('./brush-blend.glsl')
//     ) */
//   }

//   onToolBegin(x, y) {
//     overlayLog('onToolBegin')
//     this.initfb()
//     // keep the framebuffer image before the stroke
//     this.previousStateFb.begin()
//     // Graphics.clearColor(255, 255, 255, 1)
//     this.canvasFramebuffer.draw()
//     this.previousStateFb.end()

//     this.lastPos = [x, y]
//     this.framebuffer.begin()
//     Graphics.clearColor(255, 255, 255, 0)
//     this.drawBrushPoint(x, y)
//     this.framebuffer.end()
//   }

//   drawBrushPoint(x, y) {
//     Graphics.drawCircle(x, y, this.settings.size, Color.make(0, 0, 0, 0.1))
//   }

//   onToolEnd() {
//     overlayLog('onToolEnd')
//     this.renderBrush()
//   }

//   renderBrush() {
//     this.canvasFramebuffer.begin()
//     Graphics.clearColor(255, 255, 255, 255)

//     const x = 0
//     const y = 0
//     const w = this.previousStateFb.width
//     const h = this.previousStateFb.height

//     const mat = (function () {
//       Graphics.pushMatrix()
//       Graphics.translate(x, y, 0)
//       Graphics.scale(w, h)
//       const m = Graphics.currentMatrix
//       Graphics.popMatrix()
//       return m
//     })()

//     const shader = this.brushBlendShader
//     shader.setMatrix('xform', mat)
//     shader.setTexture('textureA', this.previousStateFb.texture)
//     shader.setTexture('textureB', this.brushFramebuffer.texture)
//     shader.setVector4('color', [
//       this.state.color.current.r,
//       this.state.color.current.g,
//       this.state.color.current.b,
//       this.settings.opacity,
//     ])

//     const shapeData = Graphics.solidShape.shapes.rect

//     Graphics.draw(
//       shader,
//       ['pos'],
//       [
//         {
//           size: 2,
//           glType: Graphics.gl.FLOAT,
//           normalized: false,
//           stride: 0,
//           offset: 0,
//         },
//       ],
//       0,
//       shapeData.size,
//       shapeData.arrayBuffer,
//       null
//     )

//     this.canvasFramebuffer.end()
//   }

//   toolCallback(x, y) {
//     let a = vec2.fromValues(this.lastPos[0], this.lastPos[1])
//     let b = vec2.fromValues(x, y)

//     vec2.sub(b, b, a)

//     const dist = vec2.length(b)
//     if (dist > this.settings.step) {
//       vec2.normalize(b, b)

//       b[0] *= this.settings.step
//       b[1] *= this.settings.step

//       let count = Math.floor(dist / this.settings.step)
//       this.framebuffer.begin()

//       for (let x = 0; x < count; x++) {
//         this.drawBrushPoint(a[0], a[1])
//         vec2.add(a, a, b)
//       }
//       this.framebuffer.end()
//       this.renderBrush()
//     }
//     this.lastPos = [x, y]
//   }
// }

// export default BrushTool
