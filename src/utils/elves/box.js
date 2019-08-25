function Box(x, y, width, height, color) {
    // 小球中心的坐标，默认值为0
    this.x = x || 0
    this.y = y || 0
    this.width = width || 80
    this.height = height || 40

    this.color = color || 'red'
    // x和y速度
    this.vx = 0
    this.vy = 0
}

Box.prototype = {
    stroke: function(ctx) {
        ctx.save()
        ctx.strokeStyle = this.color
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    },
    fill: function(ctx) {
        ctx.save()
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.closePath()
        ctx.fill()
        ctx.restore() 
    }
}

export default Box