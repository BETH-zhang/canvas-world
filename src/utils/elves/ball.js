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
}

Ball.prototype = {
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
    // ctx.translate(this.x, this.y)
    // ctx.rotate(this.rotation)
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