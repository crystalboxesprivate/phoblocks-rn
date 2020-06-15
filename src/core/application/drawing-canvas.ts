// import Graphics from '../gl/Graphics'
// import FrameBuffer from '../gl/Framebuffer'

// class DrawingCanvas {
//   width: number
//   height: number
//   position: { x: number, y: number }
//   zoom: number
//   framebuffer: FrameBuffer

//   constructor(width?: number, height?: number) {
//     this.width = width || 640
//     this.height = height || 480
//     this.position = { x: 0, y: 0 }
//     this.zoom = 1.0

//     this.framebuffer = new FrameBuffer()
//   }

//   // this is called once the actual webgl canvas is initialized
//   // since the page dimensions are referenced
//   onInit() {
//     // init framebuffer
//     this.position.x = Graphics.width / 2 - this.width / 2
//     this.position.y = Graphics.height / 2 - this.height / 2

//     this.framebuffer.allocate(this.width, this.height)
//     this.framebuffer.begin()
//     Graphics.clearColor(255, 255, 255, 1.0)
//     this.framebuffer.end()
//   }
// }

// export default DrawingCanvas
