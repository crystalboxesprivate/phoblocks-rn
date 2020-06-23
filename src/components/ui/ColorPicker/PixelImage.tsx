import React from 'react'
import { encode } from 'base-64'
import { Image, StyleProp, ImageStyle } from 'react-native'

const gen = (w: number, h: number, pixels: Uint8Array) => {
  const filesize = 54 + 3 * w * h

  const header = ['B'.charCodeAt(0), 'M'.charCodeAt(0), 0, 0, 0, 0, 0, 0, 0, 0, 54, 0, 0, 0];
  const infoHeader = new Array(40).map(_ => 0)
  const bm = [40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 24, 0]
  bm.forEach((x, index) => infoHeader[index] = x)
  const bmppad = [0, 0, 0]

  header[2] = filesize;
  header[3] = filesize >> 8
  header[4] = filesize >> 16
  header[5] = filesize >> 24

  infoHeader[4] = w
  infoHeader[5] = w >> 8
  infoHeader[6] = w >> 16
  infoHeader[7] = w >> 24
  infoHeader[8] = h
  infoHeader[9] = h >> 8
  infoHeader[10] = h >> 16
  infoHeader[11] = h >> 24

  const bmp = new Uint8Array(filesize)
  let off = 0
  for (let x = 0; x < 14; x++) {
    bmp[off++] = header[x]
  }

  for (let x = 0; x < 40; x++) {
    bmp[off++] = infoHeader[x]
  }

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w * 3; j += 3) {
      bmp[off++] = pixels[(w * (h - i - 1) * 3) + j + 0]
      bmp[off++] = pixels[(w * (h - i - 1) * 3) + j + 1]
      bmp[off++] = pixels[(w * (h - i - 1) * 3) + j + 2]
    }
    for (let j = 0; j < (4 - (w * 3) % 4) % 4; j++) {
      bmp[off++] = bmppad[j]
    }
  }
  return bmp
}

function _arrayBufferToBase64(bytes: Uint8Array) {
  var binary = '';
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return encode(binary);
}

export class Texture {
  width: number
  height: number
  _pixels: Uint8Array

  constructor(width: number, height: number) {
    this.width = width < 1 ? 1 : width
    this.height = height < 1 ? 1 : height
    this._pixels = new Uint8Array(this.width * this.height * 3)
  }
  setPixel(x: number, y: number, rgb: [number, number, number]) {
    this._pixels[(x + y * this.width) * 3 + 2] = rgb[0]
    this._pixels[(x + y * this.width) * 3 + 1] = rgb[1]
    this._pixels[(x + y * this.width) * 3 + 0] = rgb[2]
    this._pixelUpdate++
  }
  get base64String() {
    if (this._pixelUpdate != this._base64Update) {
      this._base64Update = this._pixelUpdate
      this._base64Representation = `data:image/bmp;base64,${_arrayBufferToBase64(gen(this.width, this.height, this._pixels))}`
    }
    return this._base64Representation
  }
  _pixelUpdate = 0
  _base64Update = -1
  _base64Representation: string = ''
}


export const PixelImage = ({ texture, style }: { texture: Texture, style?: StyleProp<ImageStyle> }) => (<Image style={style} source={{ uri: texture.base64String }} />)
