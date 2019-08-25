import tools from './tools.js'
import isArray from 'lodash/isArray';

function Ball(x, y, radius, color) {
  // 小球中心的x坐标，默认值为0
  this.x = x || 0
  // 小球中心的y坐标，默认值为0
  this.y = y || 0
  // 小球半径，默认值为12
  this.radius = radius || 12
  // 小球颜色，默认值为 #ff0000
  this.color = color || '#ff0000'

  this.scaleX = 1
  this.scaleY = 1

  // 反弹消耗
  this.bounce = -1
  this.vx = 0
  this.vx = 0
}

Ball.prototype = {
  init: function(canvas) {
    this.x = canvas.width / 2
    this.y = canvas.width / 2
  },
  setPosition: function (borderDirections, canvas) {
    // 只有触碰到边界的时候才会存在反弹消耗
    if (borderDirections && isArray(borderDirections)) {
      borderDirections.forEach((borderDirection) => {
        if (borderDirection === 'left') {
          this.x = this.radius
          this.vx = this.vx * this.bounce
        } else if (borderDirection === 'right') {
          this.x = canvas.width - this.radius
          this.vx = this.vx * this.bounce
        } else if (borderDirection === 'top') {
          this.y = this.radius
          this.vy = this.vy * this.bounce
        } else if (borderDirection === 'down') {
          this.y = canvas.height - this.radius
          this.vy = this.vy * this.bounce
        }
      })
    } 
  },
  checkMouse: function (mouse) {
    if (tools.checkCaptureCircleElement(mouse, this)) {
      return true
    }
    return false
  },
  getRect: function () {
    var rect = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    }
    return rect
  }, 
  stroke: function (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.scale(this.scaleX, this.scaleY)
    ctx.strokeStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 360 * Math.PI / 180, false)
    ctx.closePath();
    ctx.stroke()
    ctx.restore()
  },
  fill: function (ctx) {
    ctx.save()
    // 缩放时，会缩放整个画布，如果希望，整体位置不变，需要处理一下偏移量    
    ctx.translate(this.x * (1 - this.scaleX), this.y * (1 - this.scaleY))
    ctx.scale(this.scaleX, this.scaleY)
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 360 * Math.PI / 180, false)
    ctx.closePath();
    ctx.fill()
    ctx.restore()
  }
}

export default Ball