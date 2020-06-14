import parse from 'color-parse'

const divisor = 1 / 255.0

type BasicColor = {
  r: number, g: number, b: number, a: number
}

class Color {
  red: number = 0
  green: number = 0
  blue: number = 0
  alpha: number = 1

  static validate(o: any): Color | null {
    if (!o) {
      return null
    }
    if (Array.isArray(o) && o.length === 1) {
      o = o[0]
    }
    let objectType = typeof o
    if (objectType === 'string') {
      return Color.parse(o)
    } else if (objectType === 'object' && !Array.isArray(o)) {
      if ('r' in o && 'g' in o && 'b' in o && 'a' in o) {
        return o
      }
    } else if (objectType === 'number') {
      return Color.make(o * 255, o * 255, o * 255)
    } else if (Array.isArray(o)) {
      if (o.length > 2) {
        return Color.make(o[0], o[1], o[2], o.length > 3 ? o[3] : null)
      }
    }
    return null
  }

  static parse(str: string) {
    let parsed = parse(str)
    return Color.make(
      parsed.values[0],
      parsed.values[0],
      parsed.values[0],
      parsed.space === 'rgb' ? null : parsed.alpha
    )
  }

  static make(r: number, g?: number, b?: number, a?: number) {
    g = g || r
    b = b || r
    a = a || 1
    let c = new Color()
    c.red = r | 0
    c.green = g | 0
    c.blue = b | 0

    if (a) {
      c.alpha = a
    }
    return c
  }

  get r() {
    return this.red
  }
  get g() {
    return this.green
  }
  get b() {
    return this.blue
  }
  get a() {
    return 'alpha' in this ? this.alpha : 1.0
  }

  set r(value) {
    this.red = value
  }
  set g(value) {
    this.green = value
  }
  set b(value) {
    this.blue = value
  }
  set a(value) {
    if (!('alpha' in this)) {
      return
    }
    this.alpha = value
  }

  static getFloat(col: any): BasicColor {
    let c = Color.validate(col)
    if (!c) {
      return { r: 0, g: 0, b: 0, a: 0 }
    }

    return {
      r: c.r * divisor,
      g: c.g * divisor,
      b: c.b * divisor,
      a: c.a,
    }
  }
}

export { Color, BasicColor }
