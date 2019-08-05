import Cube from './cube'

class Atomic {
  constructor(canvas, draw) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.draw = draw
  }

  ball = (x, y, diameter, options, speedOptions = {}) => {
    const self = this
    return {
      x,
      y,
      vx: speedOptions.vx || 0,
      vy: speedOptions.vy || 0,
      radius: diameter / 2,
      update: function (params) {
        Object.keys(params).forEach((key) => {
          this[key] = params[key]
        })
      },
      draw: function () {
        self.draw.circle(this.x, this.y, diameter, options)
        // chrome://flags/ Set the flag ExperimentalCanvasFeatures to true to enable it.
        // self.ctx.addHitRegion({ id: speedOptions.id || 'ball' })
      }
    }
  }

  smile = (x, y, diameter, options, speedOptions = {}) => {
    const self = this
    const leftEyeX = x - (diameter / 4) * 2 * (2 / 5)
    const leftEyeY = y - (diameter / 5)
    const rightEyeX = x + (diameter / 4) * 2 * (2 / 5)
    const rightEyeY = y - (diameter / 5)
    const leftMouthX = x - (diameter / 4) / 2
    const leftMouthY = y + (diameter / 5)
    const rightMouthX = x + (diameter / 4) / 2
    const rightMouthY = y + (diameter / 5)
    return {
      x,
      y,
      draw: function () {
        self.draw.circle(this.x, this.y, diameter, options)
        const innerOptions = options.fill ? Object.assign({}, options, { fill: '', stroke: '#fff' }) : options
        self.draw.circle(leftEyeX, leftEyeY, diameter / 7.5, innerOptions)
        self.draw.circle(rightEyeX, rightEyeY, diameter / 7.5, innerOptions)
        self.draw.line(leftMouthX, leftMouthY, rightMouthX, rightMouthY, innerOptions)
      }
    }
  }

  cube = (x, y) => {
    const self = this
    return {
      x: x || this.canvas.width,
      y: y || this.canvas.height,
      // center: null,
      instance: null,
      mousedown: false,
      draw: function () {
        var instance = new Cube(0, 100, 0, 50);
        this.instance = instance
        // this.center = instance.center
        instance.render(self.ctx, this.x, this.y);
      },
    }
  }
}

export default Atomic
