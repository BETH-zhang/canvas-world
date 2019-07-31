import { addEvent, getOffSet, timer } from 'us-common-utils'
import Draw from './draw'
import Mousefollow from './mousefollow'
import Screenshots from './screenshots'

const toolType = [
  'pen', 'line', 'rect', 'circle', 'poly', 'eraser',
]

class Whiteboard {
  constructor(options) {
    this.options = options
    this.canvasId = this.options.id
    this.canvas = document.getElementById(this.options.id)
    this.canvas.width = options.width
    this.canvas.height = options.height
    this.context = this.canvas.getContext('2d')
    this.isDraw = false
    this.disabled = options.disabled
    this.arr = []
    this.scrollTop = 0
    this.allowMousefollow = this.options.allowMousefollow
    this.followEle = document.getElementById(`${this.options.id}Follow`)
    this.allowScreenshot = false
    this.offset = getOffSet(this.canvas)
    this.isSupportTouch = document.hasOwnProperty('ontouchstart')
    if (this.allowMousefollow && this.followEle) {
      this.canvas.style.zIndex = 0
    } else {
      this.canvas.style.zIndex = 2
    }

    if (this.allowScreenshot) {
      this.screenshots = new Screenshots({
        videoClassName: 'agora-smart',
        id: this.options.id,
        width: options.width,
        height: options.height,
      })
    }

    this.mousefollow = null
    this.frame = 0


    this.quadraticCurveBeginPoint = null
    // this.quadraticCurve = {
    //   points: [],
    //   beginPoint: null,
    //   radius: 25,
    // }

    this.whiteboard = {
      type: 'pen',
      color: options.color,
      lineWidth: this.options.lineWidth || 8,
      width: this.canvas.width,
      height: this.canvas.height,
      n: 3,
      style: 'stroke', // stroke fill
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      arr: [],
    }

    if (!this.disabled) {
      this.init()
      this.addScrollEvent()
    }
  }

  addScrollEvent = () => {
    addEvent(window, 'scroll', () => {
      const scrollTop = document.documentElement.scrollTop
      this.updateScrollTop(scrollTop)
    })
  }

  fillColor = (color) => {
    this.draw = new Draw(this.context, {
      styleType: 'fill',
      color: color || '#000000',
      rainbow: false,
      screenWidth: this.whiteboard.width,
      screenHeight: this.whiteboard.height,

      lineWidth: this.whiteboard.lineWidth,
    })
    this.draw.rect(0, 0, this.whiteboard.width, this.whiteboard.height)
  }

  init = () => {
    // 初始化鼠标跟随类
    if (this.allowMousefollow && this.followEle) {
      this.mousefollow = new Mousefollow({
        id: `${this.options.id}Follow`,
        width: this.canvas.width,
        height: this.canvas.height,
      })
    }

    const canvas = (this.allowMousefollow && this.followEle) ? this.mousefollow.canvas : this.canvas
    if (this.options.allowDraw) {
      addEvent(canvas, 'mousedown', this.canvasMouseDown, false)
      addEvent(canvas, 'mousemove', this.canvasMouseMove, false)
      addEvent(canvas, 'mouseup', this.canvasMouseUp, false)
      addEvent(canvas, 'mouseleave', this.canvasMouseUp, false)

      addEvent(canvas, 'touchstart', this.canvasMouseDown, false)
      addEvent(canvas, 'touchmove', this.canvasMouseMove, false)
      addEvent(canvas, 'touchend', this.canvasMouseUp, false)
    }
  }

  initData = () => {
    this.whiteboard.arr = []
    this.quadraticCurveBeginPoint = null
    this.currentDrawRole = '' // 用来区分是自己画的，还是同步的其他角色画的
  }

  updateData = (data) => {
    this.whiteboard = Object.assign({}, this.whiteboard, data, {
      // 这两个参数是自己端的还是自己端的
      color: this.whiteboard.color,
      width: this.canvas.width,
      height: this.canvas.height,
    })
  }

  updateScreenSize = (data) => {
    this.canvas.width = data.width
    this.canvas.height = data.height
    this.whiteboard = Object.assign({}, this.whiteboard, {
      width: data.width,
      height: data.height,
    })

    setTimeout(() => {
      this.offset = getOffSet(this.canvas)
    }, 0)
  }

  reDraw = (data) => {
    const widthRadio = this.whiteboard.width / data.width;
    const heightRadio = this.whiteboard.height / data.height;
    this.updateData(Object.assign({}, data, {
      arr: [],
      startX: data.startX * widthRadio,
      startY: data.startY * heightRadio,
      endX: data.endX * widthRadio,
      endY: data.endY * heightRadio,
    }))

    if (!this.isDraw && this.currentDrawRole !== 'myself') {
      this.isDraw = true
      this.currentDrawRole = 'other'
      this.quadraticCurveBeginPoint = [this.whiteboard.startX, this.whiteboard.startY]
      this.whiteboard.arr.push(this.quadraticCurveBeginPoint)
      this.drawDown(data.color)
    }
    for (let i = 1; i < data.arr.length - 1; i++) {
      if (data.arr[i][0] && data.arr[i][1]) {
        this.whiteboard.endX = data.arr[i][0] * widthRadio
        this.whiteboard.endY = data.arr[i][1] * heightRadio
        if (this.whiteboard.endX && this.whiteboard.endY) {
          this.whiteboard.arr.push([this.whiteboard.endX, this.whiteboard.endY])
        }
        if (this.whiteboard.type === 'pen') {
          this.drawPenMove()
        } else if (this.whiteboard.type === 'eraser') {
          this.drawEraserMove()
        } else {
          this.drawMove()
        }
      }
    }
    this.drawUp()
    this.initData()
  }

  canvasMouseUp = (e) => {
    // console.log('up=====', e)
    if (this.isDraw && this.currentDrawRole !== 'other') {
      if (this.screenshots) {
        const formData = this.screenshots.download()
        this.options.postUpload(formData)
      }

      if (this.allowMousefollow && this.followEle) {
        timer.clear('mouseflowTimer')
        this.mousefollow.initCanvas()
        this.mousefollow.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
      // console.log('up---', this.isDraw, this.whiteboard)
      this.drawUp()
      const getTouchPointPosition = this.getTouchPointPosition(e)

      this.whiteboard.endX = getTouchPointPosition.clientX
      this.whiteboard.endY = getTouchPointPosition.clientY
      if (this.whiteboard.endX && this.whiteboard.endY) {
        this.whiteboard.arr.push([this.whiteboard.endX, this.whiteboard.endY])
      }

      if (this.options.onDrawUp) {
        this.options.onDrawUp(Object.assign({},
          this.whiteboard, {
            arr: this.whiteboard.arr, // ??? 为什么，arr的数据丢了，必须重新赋值才可以
          }))
      }
      this.initData()
    }
  }

  drawUp = () => {
    this.isDraw = false
    this.arr.push(this.context.getImageData(0, 0, this.whiteboard.width, this.whiteboard.height))
  }

  canvasMouseMove = (e) => {
    e.preventDefault()
    if (this.isDraw && this.currentDrawRole !== 'other') {
      // console.log('move-------', this.isDraw, this.whiteboard)
      const getTouchPointPosition = this.getTouchPointPosition(e)
      this.whiteboard.endX = getTouchPointPosition.clientX
      this.whiteboard.endY = getTouchPointPosition.clientY
      if (this.whiteboard.endX && this.whiteboard.endY) {
        this.whiteboard.arr.push([this.whiteboard.endX, this.whiteboard.endY])
      }

      if (this.allowMousefollow && this.followEle) {
        this.mousefollow.drawCircles(this.whiteboard.endX, this.whiteboard.endY, this.frame)
      }

      if (this.whiteboard.type === 'pen') {
        this.drawPenMove()
      } else if (this.whiteboard.type === 'eraser') {
        this.drawEraserMove()
      } else {
        this.drawMove()
      }
      if (this.options.onDrawMove) {
        this.options.onDrawMove(this.whiteboard)
      }
    }
  }

  drawPenMove = () => {
    if (this.whiteboard.arr.length > 3) {
      const lastTwoPoints = this.whiteboard.arr.slice(-2);
      const controlPoint = lastTwoPoints[0];
      const endPoint = [
        (lastTwoPoints[0][0] + lastTwoPoints[1][0]) / 2,
        (lastTwoPoints[0][1] + lastTwoPoints[1][1]) / 2,
      ]

      this.drawLine(this.quadraticCurveBeginPoint, controlPoint, endPoint);
      this.quadraticCurveBeginPoint = endPoint;
      console.log(this.quadraticCurveBeginPoint, '??')
    }
  }

  drawLine = (beginPoint, controlPoint, endPoint) => {
    this.context.beginPath();
    this.context.moveTo(beginPoint[0], beginPoint[1]);
    this.draw.pen(controlPoint[0], controlPoint[1], endPoint[0], endPoint[1])
  }

  drawEraserMove = () => {
    if (this.whiteboard.arr.length > 2) {
      const lastTwoPoints = this.whiteboard.arr.slice(-2);
      const beginPoint = this.quadraticCurveBeginPoint;
      const controlPoint = lastTwoPoints[1];
      if (JSON.stringify(beginPoint) !== JSON.stringify(controlPoint)) {
        // 获取两个点的裁剪区域四个端点
        // const sinA = (y2 - y1) / Math.sqrt(Math.pow((x2 - x1), 2) + Map.pow(y2 - y1, 2)) = a / r
        // const cosA = (x2 - x1) / Math.sqrt(Math.pow((x2 - x1), 2) + Map.pow(y2 - y1, 2)) = b / r
        const c = Math.sqrt(Math.pow((controlPoint[1] - beginPoint[1]), 2) + Math.pow(controlPoint[0] - beginPoint[0], 2))
        const sinA = (this.whiteboard.lineWidth / 2) * (controlPoint[1] - beginPoint[1]) / c
        const cosA = (this.whiteboard.lineWidth / 2) * (controlPoint[0] - beginPoint[0]) / c
        const point1 = [beginPoint[0] + sinA, beginPoint[1] - cosA]
        const point2 = [beginPoint[0] - sinA, beginPoint[1] + cosA]
        const point3 = [controlPoint[0] - sinA, controlPoint[1] + cosA]
        const point4 = [controlPoint[0] + sinA, controlPoint[1] - cosA]

        // 保证线条的连贯，所以在矩形一端画圈
        this.context.save()
        this.context.beginPath()
        this.context.arc(controlPoint[0], controlPoint[1], (this.whiteboard.lineWidth / 2), 0, 2 * Math.PI)
        this.context.clip()
        this.context.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height)
        this.context.restore();

        // 清除矩形裁剪区域的像素
        this.context.save()
        this.context.beginPath()
        this.context.moveTo(point1[0], point1[1])
        this.context.lineTo(point2[0], point2[1])
        this.context.lineTo(point3[0], point3[1])
        this.context.lineTo(point4[0], point4[1])
        this.context.closePath()
        this.context.clip()
        this.context.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height)
        this.context.restore();

        // 记录最后坐标
        this.quadraticCurveBeginPoint = controlPoint
      }
    }
  }

  drawMove = () => {
    if (this.whiteboard.type !== 'eraser') {
      this.context.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height)
      if (this.arr.length !== 0) {
        this.context.putImageData(
          this.arr[this.arr.length - 1],
          0, 0, 0, 0,
          this.whiteboard.width,
          this.whiteboard.height,
        )
      }
    }
    if (this.whiteboard.type === 'poly') {
      this.draw[this.whiteboard.type](
        this.whiteboard.startX,
        this.whiteboard.startY,
        this.whiteboard.endX,
        this.whiteboard.endY,
        this.whiteboard.n
      )
    } else {
      this.draw[this.whiteboard.type](
        this.whiteboard.startX,
        this.whiteboard.startY,
        this.whiteboard.endX,
        this.whiteboard.endY,
      )
    }
  }

  canvasMouseDown = (e) => {
    // console.log('down', e)
    if (!this.isDraw && this.currentDrawRole !== 'other') {
      // console.log('down----', this.isDraw, this.whiteboard)
      this.isDraw = true
      this.currentDrawRole = 'myself'

      if (this.screenshots) {
        this.screenshots.snap()
      }

      if (this.allowMousefollow && this.followEle) {
        // 创建mouseflow
        timer.add({
          name: 'mouseflowTimer',
          fn: (num) => {
            this.frame = num
            this.mousefollow.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            for (let i = this.mousefollow.circleArray.length - 1; i > 0; i--) {
              this.mousefollow.circleArray[i].update(
                this.canvas.width,
                this.canvas.height,
                this.mousefollow.circleArray,
                num,
              )
            }
          },
          _this: this,
        })
      }

      const getTouchPointPosition = this.getTouchPointPosition(e)
      this.whiteboard.startX = getTouchPointPosition.clientX
      this.whiteboard.startY = getTouchPointPosition.clientY
      this.whiteboard.arr.push([this.whiteboard.startX, this.whiteboard.startY])
      this.quadraticCurveBeginPoint = [this.whiteboard.startX, this.whiteboard.startY]

      this.drawDown()

      if (this.options.onDrawDown) {
        this.options.onDrawDown(this.whiteboard)
      }
    }
  }

  drawDown = (color) => {
    if (this.whiteboard.type === 'pen') {
      this.context.beginPath()
      this.context.moveTo(this.whiteboard.startX, this.whiteboard.startY)
    } else if (this.whiteboard.type === 'eraser') {
      this.context.lineCap = 'round'
      this.context.lineJoin = 'round'
      this.context.lineWidth = (this.whiteboard.lineWidth / 2) * 2
    }

    let currentColor = null
    let currentRainbow = true
    if (color) { // 接收其他画板颜色
      currentColor = color
      currentRainbow = false
    } else if (color === false) { // 接收其他画板彩虹笔
      currentRainbow = true
    } else if (this.whiteboard.color) { // 接收自己画板颜色
      currentColor = this.whiteboard.color
      currentRainbow = false
    } else if (this.whiteboard.color === false) {
      currentRainbow = true
    }

    this.draw = new Draw(this.context, {
      styleType: this.whiteboard.style,
      color: currentColor,
      rainbow: currentRainbow,
      screenWidth: this.whiteboard.width,
      screenHeight: this.whiteboard.height,
      lineWidth: this.whiteboard.lineWidth,
    })
  }

  getTouchPointPosition = (e) => {
    if (!this.offset.left && !this.offset.top) {
      this.offset = getOffSet(this.canvas)
    }
    const touch = e.touches && e.targetTouches && e.targetTouches[0]
    const clientX = touch ? touch.clientX : e.clientX
    const clientY = touch ? touch.clientY : e.clientY
    return {
      clientX: clientX - this.offset.left,
      clientY: clientY - this.offset.top + this.scrollTop,
    }
  }

  undo = () => {
    this.arr.pop()
    this.context.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height)
    if (this.arr.length > 0) {
      this.context.putImageData(
        this.arr[this.arr.length - 1],
        0, 0, 0, 0,
        this.whiteboard.width,
        this.whiteboard.height
      )
    }
  }

  clear = () => {
    this.arr = []
    this.context.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height)
  }

  typeChoose = (type) => {
    this.whiteboard.type = type || 'pen'
  }

  colorChoose = (value) => {
    this.whiteboard.color = value
  }

  widthChoose = (value) => {
    this.whiteboard.lineWidth = value
  }

  polyChoose = (value) => {
    this.whiteboard.n = value
  }

  typeChoose = (type) => {
    if (toolType.indexOf(type) > -1) {
      this.whiteboard.type = type
    }
  }

  styleChoose = (type) => {
    if (type === 'stroke' || type === 'fill') {
      this.whiteboard.style = type
    }
  }

  updateScrollTop = (value) => {
    if (this.scrollTop !== value) {
      this.scrollTop = value
    }
  }
}

export default Whiteboard
