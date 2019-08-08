import Cube from './cube'

class Atomic {
  constructor(canvas, draw) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.draw = draw
  }

  anchor = (x, y, options = { stroke: '#ee6621' }, otherOptions = { scale: 1, borderRadius: 3 }) => {
    const self = this
    return {
      x,
      y,
      scale: otherOptions.scale || 1,
      borderRadius: otherOptions.borderRadius || 3,
      draw: function () {
        const point1 = [x, y]
        const point2 = [x - 10 * this.scale, y + 10 * this.scale]
        const point3 = [x + 10 * this.scale, y + 10 * this.scale]
        const params = [
          [point1[0] - this.borderRadius, point1[1]],
          [point1[0], point1[1] - this.borderRadius],
          [point1[0] + this.borderRadius, point1[1]],
          [point3[0] - this.borderRadius, point3[1] - this.borderRadius],
         
          [point3[0] - this.borderRadius, point3[1] - this.borderRadius],
          [point3[0], point3[1] + this.borderRadius],
          [point3[0] - 2 * this.borderRadius, point3[1] + this.borderRadius],
          [point2[0] + 2 * this.borderRadius, point2[1] + this.borderRadius],

          [point2[0] + 2 * this.borderRadius, point2[1] + this.borderRadius],
          [point2[0], point2[1] + this.borderRadius],
          [point2[0] + this.borderRadius, point2[1] - this.borderRadius],
          [point1[0] - this.borderRadius, point1[1]],
        ]
        self.draw.setStyle(options)
        self.ctx.beginPath()
        self.ctx.moveTo(params[0][0], params[0][1]);
        for (let i = 0; i < params.length - 1; i = i + 4) {
          self.ctx.quadraticCurveTo(params[i + 1][0], params[i + 1][1], params[i + 2][0], params[i + 2][1]);
          self.ctx.lineTo(params[i + 3][0], params[i + 3][1])
        }

        self.ctx.closePath()
        self.draw.endToDraw()
        self.ctx.restore()
      },
    }
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

  customShape = (type, params, onClick) => {
    const self = this
    return {
      onClick,
      draw: function () {
        self.draw[type](...params)
      }
    }
  }
}

export default Atomic
