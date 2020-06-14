const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2

class Animation {
  active = false
  duration = 0.1
  state = 0
  start = 0
  end = 1
  callback = null

  timeStart = null

  play(start, end, state, duration, callback) {
    this.timeStart = new Date()

    this.state = state
    this.start = start
    this.end = end
    this.duration = duration || this.duration
    this.callback = callback

    this.active = true
    this.loop()
  }

  loop() {
    if (this.active) {
      requestAnimationFrame(() => {
        this.update()
        this.loop()
      })
    }
  }
  finished = false
  isFinished() {
    if (this.finished) {
      this.finished = false
      return true
    }
    return false
  }
  update() {
    if (!this.active) {
      return false
    }

    let timePassed = Date.now() - this.timeStart
    this.state = timePassed / this.duration

    if (timePassed >= this.duration) {
      this.state = 1
      this.active = false
      this.finished = true
    }
    if (this.callback) {
      this.callback()
    }
    return true
  }

  get t() {
    return map(this.state, 0, 1, this.start, this.end)
  }
}

export { Animation, map }
