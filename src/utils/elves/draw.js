import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

const colors = ['', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3', '#FB001F', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3']

class Draw {
  constructor(context, setting) {
    this.ctx = context

    this.initStyle(setting || {})
  }

  initStyle = (setting) => {
    if (!setting || !this.ctx) return null
    
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
    if (!setting || !this.ctx) return null

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

  circle = (cx, cy, diameter, options) => {
    this.setStyle(options)

    this.ctx.beginPath()
    this.ctx.arc(cx, cy, diameter / 2, 0, 360 * Math.PI / 180)

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
    const wr = 0.5 * w;
    const hr = 0.6 * h;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    // 从椭圆纵轴下端开始逆时针方向绘制
    this.ctx.moveTo(0, hr); 
    this.ctx.bezierCurveTo(wr / 3, hr, wr, hr / 3 * 2, wr, 0)
    this.ctx.bezierCurveTo(wr, -hr / 3 * 2, wr / 3, -hr, 0, -hr);
    this.ctx.bezierCurveTo(-wr / 3, -hr, -wr, -hr / 3 * 2, -wr, 0);
    this.ctx.bezierCurveTo(-wr, hr / 3, -wr / 3 * 2, hr, 0, hr);
    this.ctx.closePath();

    this.endToDraw()
    this.ctx.restore();

    // this.ctx.translate(x, y);
    // this.ctx.beginPath();
    // this.ctx.strokeStyle = 'red'
    // // 右下
    // this.ctx.moveTo(0, hr);
    // this.ctx.lineTo(wr / 3, hr);
    // this.ctx.lineTo(wr, hr / 3 * 2)
    // this.ctx.lineTo(wr, 0)
    // // 右上
    // // this.ctx.moveTo(wr, 0)
    // this.ctx.lineTo(wr, -hr / 3)
    // this.ctx.lineTo(wr / 3 * 2, -hr)
    // this.ctx.lineTo(0, -hr)
    // // 左上
    // // this.ctx.moveTo(0, -hr)
    // this.ctx.lineTo(-wr / 3, -hr)
    // this.ctx.lineTo(-wr, -hr / 3 * 2)
    // this.ctx.lineTo(-wr, 0)
    // // 左下
    // // this.ctx.moveTo(-wr, 0)
    // this.ctx.lineTo(-wr, hr / 3)
    // this.ctx.lineTo(-wr / 3 * 2, hr)
    // this.ctx.lineTo(0, hr)
    // this.ctx.closePath();
    // this.endToDraw()
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

  curveTag = (x, y, x1, y1, options) => {
    let points = [];
    const interval = 100

    for (let i = 0; i < (x1 - x) / 7; i++) {
      let pointX = x + (x1 / interval) * i + 10;
      let xdeg = (30 * Math.PI / 180) * i * 20;
      let pointY = y + Math.round(Math.sin(xdeg) * 5);

      points.push([pointX, pointY]);
    }
    this.curve(points, options)
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

  curve = (params, options) => {
    this.setStyle(options)
    
    for (let i = 0; i < params.length - 1; i = i + 3) {
      this.ctx.beginPath()
      this.ctx.moveTo(params[i][0], params[i][1]);
      this.pen(params[i + 1][0], params[i + 1][1], params[i + 2][0], params[i + 2][1], options)
    }
    this.endToDraw()
    this.ctx.restore()
  }

  pen = (x, y, x1, y1, options) => {
    this.setStyle(options)

    if (this.rainbow) {
      this.linearGradient()
    }
    this.ctx.save()
    this.ctx.quadraticCurveTo(x, y, x1, y1);
    this.endToDraw()
    this.ctx.restore()
  }

  image = (x, y, w, h, src) => new Promise((resolve) => {
    var img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      // 画图片
      this.ctx.drawImage(img, x, y, w, h);
      resolve()
    };
  })

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
