function Arrow (x, y, color, angle) {
  // 箭头中心x坐标，默认值为0
  this.x = x || 0
  // 箭头中心y坐标，默认值为0
  this.y = y || 0
  // 颜色，默认值为 #ff0099
  this.color = color || '#ff0099'
  // 旋转角度，默认值为0
  this.angle = angle || 0
}

Arrow.prototype = {
  stroke: function (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.strokeStyle = this.color
    ctx.beginPath()
    ctx.moveTo(-20, -10)
    ctx.lineTo(0, -10)
    ctx.lineTo(0, -20)
    ctx.lineTo(20, 0)
    ctx.lineTo(0, 20)
    ctx.lineTo(0, 10)
    ctx.lineTo(-20, 10)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  },
  fill: function (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.strokeStyle = this.color
    ctx.beginPath()
    ctx.moveTo(-20, -10)
    ctx.lineTo(0, -10)
    ctx.lineTo(0, -20)
    ctx.lineTo(20, 0)
    ctx.lineTo(0, 20)
    ctx.lineTo(0, 10)
    ctx.lineTo(-20, 10)
    ctx.closePath()
    ctx.fill()
    ctx.restore() 
  }
}

export default Arrow