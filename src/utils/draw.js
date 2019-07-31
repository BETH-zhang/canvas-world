import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

const colors = ['', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3', '#FB001F', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3']

class Draw {
  constructor(obj, setting) {
    this.ctx = obj

    this.initStyle(setting || {})
  }

  initStyle = (setting) => {
    this.rainbow = setting.rainbow
    this.screenWidth = setting.screenWidth || 800 
    this.screenHeight = setting.screenHeight || 800

    // 设置圆角笔头
    this.ctx.lineCap = 'round'
    // 设置平滑圆角折线
    this.ctx.lineJoin = 'round'

    this.setStyle(setting)
  }

  setStyle = (setting) => {
    if (!setting) return null

    this.styleType = []
    if (setting.fill) this.styleType.push('fill')
    if (setting.stroke) this.styleType.push('stroke')

    this.ctx.strokeStyle = setting.stroke || '#000000'
    this.ctx.fillStyle = setting.fill || '#cc0000'
    this.ctx.lineWidth = setting.strokeWidth || 3
  }

  endToDraw = () => {
    if (this.styleType.length) {
      this.styleType.forEach((item) => {
        this.ctx[item]()
      })
    } else {
      this.ctx.stroke()
    }
  }

  // rect -> rectangle
  rectangle = (x, y, w, h, options) => {
    this.setStyle(options)

    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)

    this.endToDraw()
  }

  line = (x, y, x1, y1, options) => {
    this.setStyle(options)

    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x1, y1)
   
    this.endToDraw()
  }

  circle = (x, y, r, options) => {
    this.setStyle(options)
    console.log(x, y, r)

    this.ctx.beginPath()
    this.ctx.arc(x, y, r / 2, 0, 2 * Math.PI)

    this.endToDraw()
  }

  // new add api
  arc = (x, y, x1, y1, options) => {
    this.setStyle(options)

    this.ctx.beginPath()
    this.ctx.translate(x, y);
    const r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2))
    this.ctx.arc(x + (x1 - x) / 2, y + (y1 - y) / 2, r, 0, 2 * Math.PI)

    this.endToDraw()
  }

  // new add api
  ellipse = (x, y, w, h, options) => {
    this.setStyle(options)

    // 存在兼容性问题
    // this.ctx.ellipse(400, 400, 300, 200, 0, 0, Math.PI*2);
    // 使用三次贝塞尔曲线
    // 关键是bezierCurveTo中两个控制点的设置
    // 0.5 和 0.6 是两个关键系数（在本函数中为试验而得）
    const ox = 0.5 * w;
    const oy = 0.6 * h;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    // 从椭圆纵轴下端开始逆时针方向绘制
    this.ctx.moveTo(0, h / 2); 
    this.ctx.bezierCurveTo(ox / 3, h / 2, w / 2, oy / 3 * 2, w / 2, 0)
    this.ctx.bezierCurveTo(w / 2, -oy / 3 * 2, ox / 3, -h / 2, 0, -h / 2);
    this.ctx.bezierCurveTo(-ox / 3, -h / 2, -w / 2, -oy / 3 * 2, -w / 2, 0);
    this.ctx.bezierCurveTo(-w / 2, oy / 3, -ox / 3 * 2, h / 2, 0, h / 2);
    this.ctx.closePath();

    // 右下
    // this.ctx.moveTo(0, h / 2);
    // this.ctx.lineTo(ox / 3, h / 2);
    // this.ctx.lineTo(w / 2, oy / 3 * 2)
    // this.ctx.lineTo(w / 2, 0)
    // 右上
    // this.ctx.moveTo(w / 2, 0)
    // this.ctx.lineTo(w / 2, -oy / 3)
    // this.ctx.lineTo(ox / 3 * 2, -h / 2)
    // this.ctx.lineTo(0, -h / 2)
    // 左上
    // this.ctx.moveTo(0, -h / 2)
    // this.ctx.lineTo(-ox / 3, -h / 2)
    // this.ctx.lineTo(-w / 2, -oy / 3 * 2)
    // this.ctx.lineTo(-w / 2, 0)
    // 左下
    // this.ctx.moveTo(-w / 2, 0)
    // this.ctx.lineTo(-w / 2, oy / 3)
    // this.ctx.lineTo(-ox / 3 * 2, h / 2)
    // this.ctx.lineTo(0, h / 2)
    // this.ctx.closePath();

    this.endToDraw()
    this.ctx.restore();
  }

  // poly -> polygon
  polygon = (params, options) => {
    this.setStyle(options)

    if (isArray(params[0])) {
      this.ctx.beginPath()
      this.ctx.moveTo(...params[0])
      for (let i = 1; i < params.length; i++) {
        this.ctx.lineTo(...params[i]) 
      }
    } else {
      const x = params[0]
      const y = params[1]
      const x1 = params[2]
      const y1 = params[3]
      const n = params[4]
      const r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2))
      this.ctx.save()
      this.ctx.translate(x, y)
      this.ctx.rotate(Math.PI / 2)
      const nx = r * Math.cos(Math.PI / n)
      const ny = r * Math.sin(Math.PI / n)
      this.ctx.beginPath()
      this.ctx.lineCap = 'round'
      this.ctx.moveTo(nx, ny)

      for (let i = 0; i <= n; i++) {
        this.ctx.rotate(Math.PI * 2 / n)
        this.ctx.lineTo(nx, -ny)
      }
    }
    this.ctx.closePath()

    this.endToDraw()
    this.ctx.restore()
  }

  linearGradient = () => {
    this.canvasGradient = this.ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight)
    colors.forEach((item, index) => {
      if (item) {
        this.canvasGradient.addColorStop(index / colors.length, item)
      }
    })
    // 将strokeStyle的属性设置为该CanvasGradient对象
    this.ctx.strokeStyle = this.canvasGradient
  }

  // new add api
  linearPath = (params, options) => {
    this.setStyle(options)
    
    this.ctx.beginPath()
    this.ctx.moveTo(...params[0])
    for (let i = 1; i < params.length; i++) {
      this.ctx.lineTo(...params[i]) 
    }

    this.endToDraw()
    this.ctx.restore()
  }

  curve = () => {}

  pen = (x, y, x1, y1) => {
    if (this.rainbow) {
      this.linearGradient()
    }
    this.ctx.save()
    this.ctx.quadraticCurveTo(x, y, x1, y1);
    this.ctx.stroke()
    this.ctx.closePath()
  }

  eraser = (x, y, x1, y1) => {
    this.ctx.clearRect(x1 - 5, y1 - 5, 10, 10)
  }

  cut = (x, y, x1, y1) => {
    this.ctx.save()
    this.ctx.setLineDash([4, 2])
    this.ctx.beginPath()
    this.ctx.lineWidth = 1
    this.ctx.rect(x, y, x1 - x, y1 - y)
    this.ctx.stroke()
    this.ctx.restore()
  }
}

export default Draw
