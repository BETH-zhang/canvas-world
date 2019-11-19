import { Canvas2DApplication } from '../canvas/Application.ts'
import { vec2, Size, Rectangle, ELayout, EImageFillType, Math2D } from '../canvas/math2D.ts'
import Tank from '../canvas/Tank.ts'
// import { ELayout } from '../canvas/math2D';

console.log('Math2D: ', Math2D)
const Colors: string[] = [
  'aqua', // 浅绿色
  'black', // 黑色
  'blue', // 蓝色
  'fuchsia', // 紫红色
  'gray', // 灰色
  'green', // 绿色
  'lime', // 绿黄色
  'maroon', // 褐红色
  'navy', // 海军蓝
  'olive',// 橄榄色
  'orange', // 橙色
  'purple', // 紫色
  'red', // 红色
  'silver',// 银灰色
  'teal', // 蓝绿色
  'white', // 白色
  'yellow', // 黄色
]

class TestApplication extends Canvas2DApplication {  
  // 声明_lineDashOffset 成员变量 初始化0
  private _lineDashOffset: number = 0;
  private _mouseX: number = 0;
  private _mouseY: number = 0;
  // this.isSupportMouseMove = true;

  // 太阳自转的角速度，以角度为单位
  private _rotationSunSpeed: number = 50
  // 月球自转的角速度，以角度为单位
  private _rotationMoonSpeed: number = 100
  // 月球公转的角速度
  private _revolutionSpeed: number = 60

  private _rotationSun: number = 0 // 太阳自转的角位移
  private _rotationMoon: number = 0 // 月亮自转的角位移
  private _revolution: number = 0 // 月亮围绕太阳公转的角位移

  private _tank: Tank

  // override Application 的 dispatchMouseMove 方法
  public dispatchMouseMove(evt: CanvasMouseEvent): void {
    this._mouseX = evt.canvasPosition.x;
    this._mouseY = evt.canvasPosition.y;

    if (this._tank) {
      this._tank.onMouseMove(evt)
    }
  }

  public check(): void {
    if (this.context2D === null) {
      return;
    }
  }

  public render(): void {
    if (this.context2D !== null) {
      this.clearScreen()
      this.strokeGrid()
      this.drawCanvasCoordCenter()

      // this.rotationAndRevolutionSimulation()

      this.draw4Quadrant()
      this.drawTank()
      this.drawCoordInfo(`坐标：[${this._mouseX}, ${this._mouseY}] 角度：${Math2D.toDegree(this._tank.tankRotation).toFixed(2)}`, this._mouseX, this._mouseY)
    }
  }

  public update(elapsedMsec: number, intervalSec: number): void {
    // 角位移公式: v = s * t
    this._rotationMoon += this._rotationMoonSpeed * intervalSec
    this._rotationSun += this._rotationSunSpeed * intervalSec
    this._revolution += this._revolutionSpeed * intervalSec
  }

  // 实现一个更新lineDashOffset的方法
  private _updateLineDashOffset(): void {
    this._lineDashOffset++

    // 如果偏移量操作10000像素，就再从0像素开始
    if (this._lineDashOffset > 10000) {
      this._lineDashOffset = 0
    }
  }

  public start(): void {
    this.addTimer((id: number, data: any): void => {
      this._updateLineDashOffset()
      this.clearScreen()
    }, 0.05)

    super.start()
  }

  public clearScreen(): void {
    if (this.context2D !== null) {
      // 流程1: 渲染前，先清屏
      this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
      this._drawRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  public printAllStates(): void {
    if (this.context2D !== null) {
      console.log('**** LineState ***')
      console.log('LineWidth: ', this.context2D.lineWidth) // 1
      console.log('lineCap', this.context2D.lineCap) // butt 和其他两个的区别是不会增加宽度
      console.log('lineJoin', this.context2D.lineJoin) // miter
      console.log('miterLimit', this.context2D.miterLimit) // 10

      console.log('**** LineDashState ****')
      console.log('lineDashOffset: ', this.context2D.lineDashOffset)

      console.log('**** shadowState *****')
      console.log('shadowBlur: ', this.context2D.shadowBlur)
      console.log('shadowColor: ', this.context2D.shadowColor)
      console.log('shadowOffsetX: ', this.context2D.shadowOffsetX)
      console.log('shadowOffsetY: ', this.context2D.shoadowOffsetY)

      console.log('****** TextState ******')
      console.log('font: ', this.context2D.font)
      console.log('textAlign: ', this.context2D.textAlign)
      console.log('textBaseline: ', this.context2D.textBaseline)
      
      console.log('***** RenderState *****')
      console.log('strokeStyle: ', this.context2D.strokeStyle)
      console.log('fillStyle: ', this.context2D.fillStyle)
      console.log('globalAlpha: ', this.context2D.globalAlpha) // 
      console.log('globalCompositeOperation: ', this.context2D.globalCompositeOperation)
      // 都收到渲染堆栈管理
      // 图像绘制和渲染状态及渲染堆栈无任何关系
    }
  }

  private _drawRect(x: number, y: number, w: number, h: number): void {
    if (this.context2D !== null) {
      // 流程2: 绘制时，使用save/restore 对
      this.context2D.save()
      // 流程3: 在渲染状态save后，设置当前的渲染状态
      this.context2D.fillStyle = 'white';
      this.context2D.strokeStyle = 'black';
      this.context2D.lineWidth = 1;
      // this.context2D.setLineDash([30, 15])
      // this.context2D.lineDashOffset = this._lineDashOffset
      // this.context2D.lineCap = 'round'
      // this.context2D.lineCap = 'square'

      // 流程4，使用beginPath 产生一个子路径
      this.context2D.beginPath()
      // 坐首席，左手顺时针方向定义定点坐标
      // 流程5，在子路径中添加向量点
      this.context2D.moveTo(x, y)
      this.context2D.lineTo(x + w, y)
      this.context2D.lineTo(x + w, y + h)
      this.context2D.lineTo(x, y + h)
      // 流程6，如果是封装形体，调用closePath方法。封闭轮廓
      this.context2D.closePath()
      // 流程7: 如果是填充，请使用fill方法
      this.context2D.fill()
      // 流程8，如果是描边，请使用stroke方法
      this.context2D.stroke()
      // 恢复渲染状态
      this.context2D.restore()
    }
  }

  public strokeRect(x: number, y: number, w: number, h: number, color: string = 'white'): void {
    if (this.context2D !== null) {
      // 流程2: 绘制时，使用save/restore 对
      this.context2D.save()
        // 流程3: 在渲染状态save后，设置当前的渲染状态
        this.context2D.strokeStyle = color
        this.context2D.lineWidth = 2
        this.context2D.beginPath()
        // 坐首席，左手顺时针方向定义定点坐标
        // 流程5，在子路径中添加向量点
        this.context2D.moveTo(x, y)
        this.context2D.lineTo(x + w, y)
        this.context2D.lineTo(x + w, y + h)
        this.context2D.lineTo(x, y + h)
        // 流程6，如果是封装形体，调用closePath方法。封闭轮廓
        this.context2D.closePath()
        // 流程7: 如果是填充，请使用fill方法
        this.context2D.fill()
        // 流程8，如果是描边，请使用stroke方法
        this.context2D.stroke()
      // 恢复渲染状态
      this.context2D.restore()
    }
  }

  // 在坐标【x，y】出绘制半径为radius的圆，可以设置style（颜色，渐变，图案）
  public fillCircle(x: number, y: number, radius: number, fillStyle: string | CanvasGradient | CanvasPattern = 'red'): void {
    if (!this.context2D !== null) {
      // 流程
      this.context2D.save()
        this.context2D.fillStyle = fillStyle
        this.context2D.beginPath()
        this.context2D.arc(x, y, radius, 0, Math.PI * 2)
        this.context2D.fill()
      // 流程
      this.context2D.restore()
    }
  }

  public strokeCircle(x: number, y: number, radius: number, strokeStyle: string | CanvasGradient | CanvasPattern = 'red'): void {
    if (!this.context2D !== null) {
      // 流程
      this.context2D.save()
        this.context2D.strokeStyle = strokeStyle
        this.context2D.beginPath()
        this.context2D.arc(x, y, radius, 0, Math.PI * 2)
        this.context2D.stroke()
      // 流程
      this.context2D.restore()
    }
  }

  // 该方法可能多次调用，由调用方进行状态管理和状态设置
  public strokeLine(x0: number, y0: number, x1: number, y1: number): void {
    if (!this.context2D !== null) {
      this.context2D.beginPath()
      this.context2D.moveTo(x0, y0)
      this.context2D.lineTo(x1, y1)
      this.context2D.stroke()
    }
  }

  // 绘制坐标系
  public strokeCoord (originX: number, originY: number, width: number, height: number): void {
    if (this.context2D !== null) {
      this.context2D.save()
        // 红色 x 轴
        this.context2D.strokeStyle = 'red'
        this.strokeLine(originX, originY, originX + width, originY)
        // 蓝色 y 轴
        this.context2D.strokeStyle = 'blue'
        this.strokeLine(originX, originY, originX, originY + height)
      this.context2D.restore()
    }
  }

  // 绘制网格
  public strokeGrid (color: string = 'grey', interval: number = 10): void {
    if (this.context2D !== null) {
      this.context2D.save()
        this.context2D.strokeStyle = color
        this.context2D.lineWidth = 0.5
        // 从左到右每隔interval个像素画一条垂直线
        for (let i: number = interval + 0.5; i < this.canvas.width; i += interval) {
          this.strokeLine(i, 0, i, this.canvas.height)
        }

        // 从上到下画水平线
        for (let i: number = interval + 0.5; i < this.canvas.height; i += interval) {
          this.strokeLine(0, i, this.canvas.width, i)
        }
      this.context2D.restore()

      // 绘制网格背景全局坐标系的原点
      this.fillCircle(0, 0, 5, 'green')
      // 绘制全局坐标系
      this.strokeCoord(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  // 绘制文字
  public fillText(text: string, x: number, y: number, color: string = 'white', align: TextAlign = 'left', baseline: TextBaseline = 'top', font: FontType = '10px sans-serif'): void {
    if (this.context2D !== null) {
      this.context2D.save()
        this.context2D.textAlign = align
        this.context2D.textBaseline = baseline
        this.context2D.font = font
        this.context2D.fillStyle = color
        this.context2D.fillText(text, x, y)
      this.context2D.restore()
    }
  }

  // 绘制文字布局
  public testCanvas2DTextLayout(): void {
    // 要绘制的矩形离canvas的margin（外边距）分别是[20, 20, 20, 20]
    let x: number = 20
    let y: number = 20
    let width: number = this.canvas.width - x * 2
    let height: number = this.canvas.height - y * 2
    let drawX: number = x
    let drawY: number = y
    // 原点半径为3px
    let radius: number = 3
    // 1.画背景rect
    this.fillRectWithTitle(x, y, width, height)
    // 使用20px sans-serif 字体绘制（默认为10 sans-serif）
    // 每个位置，先绘制drawX和drawY的坐标原点，然后绘制文本
    // 2.左上
    this.fillText('left - top', drawX, drawY, 'white', 'left', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 3.右上
    drawX = x + width
    drawY = y
    this.fillText('right - top', drawX, drawY, 'white', 'right', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 4.右下
    drawX = x + width
    drawY = y + height
    this.fillText('right - bottom', drawX, drawY, 'white', 'right', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 5.左下
    drawX = x
    drawY = y + height
    this.fillText('left - bottom', drawX, drawY, 'white', 'left', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 6.中心
    drawX = x + width * 0.5
    drawY = y + height * 0.5
    this.fillText('center - middle', drawX, drawY, 'black', 'center', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 7.中上
    drawX = x + width * 0.5
    drawY = y
    this.fillText('center - top', drawX, drawY, 'black', 'center', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 8.右中
    drawX = x + width
    drawY = y + height * 0.5
    this.fillText('right - middle', drawX, drawY, 'black', 'right', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 9.中下
    drawX = x + width * 0.5
    drawY = y + height
    this.fillText('right - middle', drawX, drawY, 'black', 'center', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
    // 10.左中
    drawX = x
    drawY = y + height * 0.5
    this.fillText('right - middle', drawX, drawY, 'black', 'left', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
  }

  // 设置字体尺寸
  public calcTextSize(text: string, char: string = 'W', scale: number = 0.5): Size {
    if (this.context2D !== null) {
      let size: Size = new Size()
      size.width = this.context2D.measureText(text).width
      let w: number = this.context2D.measureText(char).width
      size.height = w + w * scale
      return size;
    }
    alert(' context2D 渲染上下文为null ')
    throw new Error('context2D 渲染上下文为null')
  }

  // 函数返回类型是Rectangle,表示9个文本矩形之一
  public calcLocalTextRectangle(layout: ELayout, text: string, parentWidth: number, parentHeight: number): Rectangle {
    // 计算出要绘制的文本尺寸
    let s:Size = this.calcTextSize(text)
    // 创建一个二维向量
    let o:vec2 = vec2.create()
    // 计算出当前文本子矩形左上角相对父矩形空间中的3个关键点（左上，中心，右下）坐标
    // 1.当前文本子矩形左上角相对父矩形左上角坐标，由于局部表示，所以为【0，0】
    let left: number = 0
    let top: number = 0
    // 2.当前文本子矩形左上角相对父矩形右下角坐标
    let right: number = parentWidth - s.width
    let bottom: number = parentHeight - s.height
    // 3.当前文本子矩形左上角相对父矩形中心点坐标
    let center: number = right * 0.5
    let middle: number = bottom * 0.5
    // 根据ELayout 的值来匹配这3个点的分量
    // 计算子矩形相对父矩形原点[0, 0]偏移量
    switch(layout) {
      case ELayout.LEFT_TOP:
        o.x = left
        o.y = top
        break
      case ELayout.RIGHT_TOP:
        o.x = right
        o.y = top
        break
      case ELayout.RIGHT_BOTTOM:
        o.x = right
        o.y = bottom
        break
      case ELayout.LEFT_BOTTOM:
        o.x = left
        o.y = bottom
        break
      case ELayout.CENTER_MIDDLE:
        o.x = center
        o.y = middle
        break
      case ELayout.CENTER_TOP:
        o.x = center
        o.y = 0
        break
      case ELayout.RIGHT_MIDDLE:
        o.x = right
        o.y = middle
        break
      case ELayout.CENTER_BOTTOM:
        o.x = center
        o.y = bottom
        break
      case ELayout.LEFT_MIDDLE:
        o.x = left
        o.y = middle
        break
    }
    // 返回子矩形
    return new Rectangle(o, s)
  }

  public fillRectWithTitle(
    x: number, y: number, width: number, height: number, title: string = '', layout: ELayout = ELayout.CENTER_MIDDLE, color: string = 'grey', showCoord: boolean = true): void {
    if (this.context2D !== null) {
      this.context2D.save()
        // 1. 绘制矩形
        this.context2D.fillStyle = color
        this.context2D.beginPath()
        this.context2D.rect(x, y, width, height)
        this.context2D.fill()
        // 如果有文字的话，先根据枚举值计算x，y坐标
        if (title.length !== 0) {
          // 2. 绘制文字信息
          // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
          // 调用calcLocalTextRectangle方法
          let rect:Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
          // 绘制文本框
          this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)')
          // 绘制文本框左上角坐标(相对父矩形表示)
          this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
          // 绘制文本
          this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif')
        }
        // 3.绘制变换的局部坐标系
        // 附加一个坐标，x和y比矩形的width和height多20像素
        if (showCoord) {
          this.strokeCoord(x, y, width + 20, height + 20)
          this.fillCircle(x, y, 3)
        }
      this.context2D.restore()
    }
  }

  public textMyTextLayout(): void {
    let x: number = 20
    let y: number = 20
    let width: number = this.canvas.width - x * 2
    let height: number = this.canvas.height - y * 2
    let right: number = x + width
    let bottom: number = y + height
    let drawX: number = x;
    let drawY: number = y
    let drawWidth: number = 80
    let drawHeight: number = 80
    // 1.画背景rect
    this.fillRectWithTitle(x, y, width, height)
    // 2.左上
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left-top', ELayout.LEFT_TOP, 'rgba(255, 255, 0, 0.3)')
    // 3.右上
    drawX = right - drawWidth
    drawY = y
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right-top', ELayout.RIGHT_TOP, 'rgba(255, 255, 0, 0.3)')
    // 4.右下
    drawX = right - drawWidth
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right-bottom', ELayout.RIGHT_BOTTOM, 'rgba(255, 255, 0, 0.3)')
    // 5.左下
    drawX = x
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left-bottom', ELayout.LEFT_BOTTOM, 'rgba(255, 255, 0, 0.3)')

    // 6.中心
    drawX = (right - drawWidth) * 0.5
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center-middle', ELayout.CENTER_MIDDLE, 'rgba(255, 255, 0, 0.3)')
    // 7.中上
    drawX = (right - drawWidth) * 0.5
    drawY = y
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center-top', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.3)')
    // 8.中下
    drawX = (right - drawWidth) * 0.5
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center-bottom', ELayout.CENTER_BOTTOM, 'rgba(255, 255, 0, 0.3)')
    // 9.左中
    drawX = x
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left-middle', ELayout.LEFT_MIDDLE, 'rgba(255, 255, 0, 0.3)')
    // 10.右中
    drawX = right - drawWidth
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right-middle', ELayout.RIGHT_MIDDLE, 'rgba(255, 255, 0, 0.3)')
  }

  public makeFontString(size: FontSize = '10px', weight: FontWeight = 'normal', style: FontStyle = 'normal', variant: FontVariant = 'normal', family: FontFamily = 'sans-serif') : string {
    let strs: string[] = []
    // 第一个是fontStyle
    strs.push(style)
    // 第二个是fontVariant
    strs.push(variant)
    // 第三个是fontWeight
    strs.push(weight)
    // 第四个是fontSize
    strs.push(size)
    // 第五个是fontFamily
    strs.push(family)
    let ret: string = strs.join(' ')
    return ret
  }

  public drawImage(img: HTMLImageElement, destRect: Rectangle, srcRect: Rectangle = Rectangle.create(0, 0, img.width, img.height), fillType: EImageFillType = EImageFillType.STRETCH): boolean {
    // 绘制image要满足一些条件
    if (this.context2D === null) {
      return false
    }
    if (srcRect.isEmpty()) {
      return false
    }
    if (destRect.isEmpty()) {
      return false
    }

    // 分为stretch和repeat两种法方式
    if (fillType === EImageFillType.STRETCH) {
      console.log('stretch')
      this.context2D.drawImage(img,
        srcRect.origin.x,
        srcRect.origin.y,
        srcRect.size.width,
        srcRect.size.height,
        destRect.origin.x,
        destRect.origin.y,
        destRect.size.width,
        destRect.size.height,
      )
    } else { // 使用repeat模式
      console.log('repeat')
      // 测试使用，绘制出目标区域的大小
      this.fillRectangleWithColor(destRect, 'grey')
      // 调用Math.floor方法 round ceil
      let rows: number = Math.ceil(destRect.size.width / srcRect.size.width)
      let colums: number = Math.ceil(destRect.size.height / srcRect.size.height)
      // 下面6个变量在行列双重循环中每次都会更新
      // 表示的是当前要绘制的区域的位置与尺寸
      let left: number = 0
      let top: number = 0
      let right: number = 0
      let bottom: number = 0
      let width: number = 0
      let height: number = 0
      // 计算出目标Rectangle的right和bottom坐标
      let destRight: number = destRect.origin.x + destRect.size.width
      let destBottom: number = destRect.origin.y + destRect.size.height
      // REPEAT_X 和 REPEAT_Y 是REPEAT的一种特殊形式
      if (fillType === EImageFillType.REPEAT_X) {
        colums = 1
      } else if (fillType === EImageFillType.REPEAT_Y) {
        rows = 1
      }
      for (let i: number = 0; i < rows; i++) {
        for (let j: number = 0; j < colums; j++) {
          // 如何计算第i行第j列的坐标
          left = destRect.origin.x + j * srcRect.size.width;
          top = destRect.origin.y + j * srcRect.size.height;
          width = srcRect.size.width
          height = srcRect.size.height

          // 计算出当前要绘制的区域的右下坐标
          right = left + width
          bottom = top + height
          if (right > destRect) {
            width = srcRect.size.width - (right - destRect)
          }
          if (bottom > destBottom) {
            height = srcRect.size.heigt - (bottom - destBottom)
          }

          this.context2D.drawImage(img, srcRect.origin.x, srcRect.origin.y, width, height, left, top, width, height)
        }
      }
    }
  }

  // 获取 4 * 4 = 16 种基本颜色的离屏画布
  public getColorCanvas(amount: number = 32) : HTMLCanvasElement {
    let step: number = 4
    // 第一步： 使用createElement方法，提供tagName为‘canvas'关键字创建一个离屏画布对象
    let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement
    // 第2步：设置该画布的尺寸
    canvas.width = amount * step
    canvas.height = amount * step
    // 第三步：从离屏画布中获取渲染上下文对象
    let context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (context === null) {
      alert('离屏Canvas获取渲染上下文失败！')
      throw new Error('离屏Canvas获取渲染上下文失败')
    }

    for (let i: number = 0; i < step; i++) {
      for (let j: number = 0; j < step; j++) {
        // 将二维索引转成一堆索引，用来在静态的Colors数据中寻址
        let idx: number = step * i + j;
        // 第四步，使用渲染上下文对象绘图
        context.save()
        // 使用其中16中颜色
        context.fillStyle = Colors[idx]
        context.fillRect(i * amount, j * amount, amount, amount)
        context.restore()
      }
    }
    return canvas
  }

  public drawColorCanvas(): void {
    let colorCanvas: HTMLCanvasElement = this.getColorCanvas()
    this.drawImage(colorCanvas, Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height))
  }

  public testChangePartCanvasImageData(rRow: number = 2, rColum: number = 0, cRow: number = 1, cColum: number = 0, size: number = 32): void {
    // 调用getColorCanvas方法生成16中标准色块离屏画布
    let colorCanvas: HTMLCanvasElement = this.getColorCanvas(size)
    // 获取离屏画布的上下文渲染对象
    let context: CanvasRenderingContext2D | null = colorCanvas.getContext('2d')
    if (context === null) {
      alert('Canvas获取渲染上下文失败')
      throw new Error('Canvas获取渲染上下文失败')
    }
    // 显示未修改时的离屏画布的效果
    this.drawImage(colorCanvas, Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height))
    // 接上面的代码继续往下来替换颜色
    // 使用createImageData方法，大小为size * size 个像素
    // 每个像素又有4个分量[r, g, b, a]
    const imgData: ImageData = context.createImageData(size, size)
    // imgData有三个属性，其中data属性存储的是一个Uint8ClampedArray类型数组对象
    // 该数组中存储方式为：[r, g, b, a, r, g, b, a, ...]
    // 所以imgData.data.length = size * size * 4
    // 上面也提到过，imgData.data.length 表示的是所有分量的个数
    // 而为了方便寻址，希望使用像素个数进行遍历，因此要除以4（一个像素由r，g，b，a这4个分量组成）
    const data = imgData.data
    let rgbaCount: number = data.length / 4
    console.log(rgbaCount, data)
    for (let i = 0; i< rgbaCount; i++) {
      // 注意下面索引的计算方式
      imgData.data[i * 4 + 0] = 255
      imgData.data[i * 4 + 1] = 0
      imgData.data[i * 4 + 2] = 0
      imgData.data[i * 4 + 3] = 255
    }

    // 一定要调用putImageData方法来替换context中的像素数据
    context.putImageData(imgData, size * rColum, size * rRow, 0, 0, size, size)
    this.drawImage(colorCanvas, Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height))
  }

  public drawCanvasCoordCenter(): void {
    if (this.context2D === null) {
      return 
    }
    // 计算Canvas的中心坐标
    let halfWidth: number = this.canvas.width * 0.5;
    let halfHeight: number = this.canvas.height * 0.5;
    this.context2D.save()
    this.context2D.lineWidth = 2;
    this.context2D.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    // 使用alpha为0.5的红色来绘制x轴
    this.strokeLine(0, halfHeight, this.canvas.width, halfHeight)
    this.context2D.strokeStyle = 'rgba(0, 0, 255, 0.5)'
    // 使用alpha为0.5的蓝色来绘制y轴
    this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height)
    this.context2D.restore()
    this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0, 0, 0, 0.5)')
  }

  public drawCoordInfo(info: string, x: number, y: number): void {
    this.fillText(info, x, y, 'black', 'center', 'bottom')
  }

  public distance(x0: number, y0: number, x1: number, y1: number): number {
    let diffX: number = x1 - x0
    let diffY: number = y1 - y0
    return Math.sqrt(diffX * diffX + diffY * diffY)
  }

  // 先移动后旋转，可以控制位置
  public doTransform(degree: number = 20, rotateFirst: boolean = true): void {
    // 将角度转换为弧度，本方法的参数degree是以角度而不是弧度表示
    let radians: number = Math2D.toRadian(degree)
    // 顺时针旋转
    this.context2D.save()
    // 根据rotateFirst进行平移和旋转变换
    if (rotateFirst) {
      // 先顺时针旋转20度
      this.context2D.rotate(radians)
      // 然后再平移到画布中心
      this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    } else {
      // 和上面正好相反
      // 先平移到画布中心
      this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
      // 再顺时针旋转20度
      this.context2D.rotate(radians)
    }
    // 注意【0，0】坐标
    this.fillRectWithTitle(0, 0, 100, 60, '+' + degree + '度旋转')
    this.context2D.restore()

    // 逆时针旋转，代码与上满顺时针一样
    this.context2D.save()
    // 根据rotateFirst进行平移和旋转变换
    if (rotateFirst) {
      // 先顺时针旋转20度
      this.context2D.rotate(-radians)
      // 然后再平移到画布中心
      this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    } else {
      // 和上面正好相反
      // 先平移到画布中心
      this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
      // 再顺时针旋转20度
      this.context2D.rotate(-radians)
    }
    this.fillRectWithTitle(0, 0, 100, 60, '-' + degree + '度旋转')
    this.context2D.restore()

    // 调用前面实现的两点距公式
    let radius: number = this.distance(0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5)
    // 绘制一个圆
    this.strokeCircle(0, 0, radius, 'black')
  }

  public fillLocalRectWithTitle(
    width: number,
    height: number,
    title: string = '',
    referencePt: ELayout = ELayout.CENTER_MIDDLE,
    layout: ELayout = ELayout.CENTER_MIDDLE,
    color: string = 'grey',
    showCoord: boolean = true): void {
      if (this.context2D !== null) {
        let x: number = 0
        let y: number = 0
        // 首先根据referencePt的值计算原点相对左上角的偏移量
        // Canvas2D中，左上交是默认的坐标系原点，所有原点变换都相对左上角的偏移
        switch(referencePt) {
          case ELayout.LEFT_TOP: // Canvas2D中，默认是左上角为坐标原点
            x = 0
            y = 0
            break
          case ELayout.LEFT_MIDDLE: // 左中为原点
            x = 0
            y = -height * 0.5
            break
          case ELayout.LEFT_BOTTOM: // 左下为原点
            x = 0
            y = -height
            break
          case ELayout.CENTER_TOP: // 中上为原点
            x = -width * 0.5
            y = 0
            break
          case ELayout.CENTER_MIDDLE: // 中中为原定
            x = -width * 0.5
            y = -height * 0.5
            break
          case ELayout.CENTER_BOTTOM: // 中下为原点
            x = -width * 0.5
            y = -height
            break
          case ELayout.RIGHT_TOP: // 右上为原点
            x = -width
            y = 0
            break
          case ELayout.RIGHT_MIDDLE: // 右中为原点
            x = -width
            y = -height * 0.5
            break
          case ELayout.RIGHT_BOTTOM: // 右下为原点
            x = -width
            y = -height
            break
          default:
            break
        }

        this.context2D.save()
        // 1. 绘制矩形
        this.context2D.fillStyle = color;
        this.context2D.beginPath()
        this.context2D.rect(x, y, width, height)
        this.context2D.fill()
        // 如果有文字的话，先根据枚举值计算x，y坐标
        if (title.length !== 0) {
          // 2. 绘制文字信息
          // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
          // 调用calcLocalTextRectangle方法
          let rect:Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
          // 绘制文本框
          this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)')
          // 绘制文本框左上角坐标(相对父矩形表示)
          this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
          // 绘制文本
          this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif')
        }
        // 3.绘制变换的局部坐标系
        // 附加一个坐标，x和y比矩形的width和height多20像素
        if (showCoord) {
          this.strokeCoord(x, y, width + 20, height + 20)
          this.fillCircle(x, y, 3)
        }
        this.context2D.restore()
      }
  }

  public rotateTranslate(degree: number, layout: ELayout = ELayout.LEFT_TOP, width: number = 40, height: number = 20): void {
    if (this.context2D === null) {
      return
    }
    // 将角度转换为弧度，由此可见，本方法的参数degree是以角度而不是弧度表示
    let radians: number = Math2D.toRadian(degree)
    // 顺时针旋转
    this.context2D.save()
    // 先顺时针20度
    this.context2D.rotate(radians)
    // 然后平移到画布中心
    this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    // 调用新实现的localRect方法
    this.fillLocalRectWithTitle(width, height, layout + ' ' + degree, layout)
    this.context2D.restore()
  }

  // 实现testFillLocalRectWithTitle方法，该方法分别在圆的路径上绘制9种不同的坐标系
  public testFillLocalRectWithTitle(): void {
    if (this.context2D !== null) {
      // 旋转0，坐标原点位于左上角
      this.rotateTranslate(0, ELayout.LEFT_TOP)
      // 顺时针旋转，使用4种不同的ELayout值
      this.rotateTranslate(10, ELayout.LEFT_MIDDLE)
      this.rotateTranslate(20, ELayout.LEFT_BOTTOM)
      this.rotateTranslate(30, ELayout.CENTER_TOP)
      this.rotateTranslate(40, ELayout.CENTER_MIDDLE)
      // 逆时针旋转
      this.rotateTranslate(-10, ELayout.CENTER_BOTTOM)
      this.rotateTranslate(-20, ELayout.RIGHT_TOP)
      this.rotateTranslate(-30, ELayout.RIGHT_MIDDLE)
      this.rotateTranslate(-40, ELayout.RIGHT_BOTTOM)
      // 计算半径
      let radius: number = this.distance(0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5)
      this.strokeCircle(0, 0, radius, 'black')
    }
  }

  public doLocalTransform(): void {
    this.check()
    let width: number = 100
    let height: number = 60

    let coordWidth: number = width * 1.2
    let coordHeight: number = height * 1.2
    let radius: number = 5
    this.context2D.save()
    /**
     * 所有局部坐标系变换演示的代码都放在此处
     */
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillLocalRectWithTitle(width, height, '1 初始状态')
    this.fillCircle(0, 0, radius)

    // 将坐标系向右移动到画布的中心，向下移动10个单位，再绘制局部坐标系
    this.context2D.translate(this.canvas.width * 0.5, 10)
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillCircle(0, 0, radius)

    // 将坐标系向下移动到画布中心，再绘制局部坐标系
    this.context2D.translate(0, this.canvas.height * 0.5 - 10)
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillCircle(0, 0, radius)
    this.fillLocalRectWithTitle(width, height, '3.平移到画布中心')

    // 将坐标系继续旋转-120度
    // this.context2D.rotate(Math2D.toRadian(-120))
    // // 绘制旋转-120矩形
    // this.fillLocalRectWithTitle(width, height, '4.旋转-120度')
    // this.strokeCoord(0, 0, coordWidth, coordHeight)
    // this.fillCircle(0, 0, radius)

    // // 将坐标系在-120基础上再旋转-130
    // this.context2D.rotate(Math2D.toRadian(-130))
    // this.fillLocalRectWithTitle(width, height, '5.旋转-130度')
    // this.strokeCoord(0, 0, coordWidth, coordHeight)
    // this.fillCircle(0, 0, radius)

    this.context2D.scale(1.5, 2.0) // 局部坐标系的x轴放大1.5倍，y轴放大2倍
    this.fillLocalRectWithTitle(width, height, '7.局部坐标系放大')
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillCircle(0, 0, radius)

    this.context2D.restore()
  }

  public fillLocalRectWidthTitleUV(
    width: number = 0,
    height: number,
    title: string = '',
    u: number = 0,
    v: number = 0, // 这里使用 u和v 参数代替原来的Elayout枚举
    layout: ELayout.ELayout.CENTER_MIDDLE, // 文字框的对齐方式
    color: string = 'grey',
    showCoord: boolean = true
  ): void {
    this.check()
    let x: number = -width * u;
    let y: number = -height * v;

    this.context2D.save()
        // 1. 绘制矩形
        this.context2D.fillStyle = color;
        this.context2D.beginPath()
        this.context2D.rect(x, y, width, height)
        this.context2D.fill()
        // 如果有文字的话，先根据枚举值计算x，y坐标
        if (title.length !== 0) {
          // 2. 绘制文字信息
          // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
          // 调用calcLocalTextRectangle方法
          let rect:Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
          // 绘制文本框
          this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)')
          // 绘制文本框左上角坐标(相对父矩形表示)
          this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
          // 绘制文本
          this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif')
        }
        // 3.绘制变换的局部坐标系
        // 附加一个坐标，x和y比矩形的width和height多20像素
        if (showCoord) {
          this.strokeCoord(x, y, width + 20, height + 20)
          this.fillCircle(x, y, 3)
        }
    this.context2D.restore()
  }

  // 这个方法名称按照变换顺序取名
  // 其形成一个圆的路径，而且绘制物体的朝向和圆路径一致
  public translateRotateTranslateDrawRect(
    degree: number = 20,
    u: number = 0,
    v: number = 0,
    radius: number = 200,
    width: number = 40,
    height: number = 20
  ): void {
    // 将角度转换为弧度
    let radians: number = Math2D.toRadian(degree)
    // 记录状态
    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    this.context2D.rotate(radians)
    this.context2D.translate(radius, 0)
    this.fillLocalRectWidthTitleUV(width, height, '', u, v)
    this.context2D.restore()
  }

  public testFillLocalRectWithTitleUV(): void {
    this.check()
    let radius: number = 200 // 圆路径的半径为200px
    let steps: number = 18 // 将圆分成上下个18等分， -180 ～ 180，每个等分10度
    // [0, +180] 绘制u系数从0 ～ 1，v系数不变
    for (let i = 0; i <= steps; i++) {
      let n: number = i / steps
      this.translateRotateTranslateDrawRect(i * 10, n, 0, radius)
    }

    // [0, -180]
    for (let i = 0; i < steps i++) {
      let n: number = i / steps
      this.translateRotateTranslateDrawRect(-i * 10, 0, n, radius)
    }

    // 在画布中心的4个象限绘制不同u，v的矩形，可以看一下u，v不同系数产生的不同效果
    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 - radius * 0.4, this.canvas.height * 0.5 - radius * 0.4)
    this.fillLocalRectWidthTitleUV(100, 60, 'u = 0.5/v=0.5', 0.5, 0.5)
    this.context2D.restore()

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 + radius * 0.2, this.canvas.height * 0.5 - radius * 0.2)
    this.fillLocalRectWidthTitleUV(100, 60, 'u = 0/v = 1', 0, 1)
    this.context2D.restore()

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 + radius * 0.3, this.canvas.height * 0.5 + radius * 0.4)
    this.fillLocalRectWidthTitleUV(100, 60, 'u = 0.3 /v = 0.6', 0.3, 0.6)
    this.context2D.restore()

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 - radius * 0.1, this.canvas.height * 0.5 + radius * 0.25)
    this.fillLocalRectWidthTitleUV(100, 60, 'u = 1/v = 0.2', 1, 0.2)
    this.context2D.restore()

    // 使用10px线宽，绘制半透明的圆路径
    this.strokeCircle(this.canvas.width * 0.5, this.canvas.width * 0.5, radius, 'black', 10)
  }

  // 公转自转模拟
  public rotationAndRevolutionSimulation(radius: number = 250): void {
    this.check()

    // 将自转rotation转换为弧度表示
    let rotationMoon: number = Math2D.toRadian(this._rotationMoon)
    // 将公转revolution转换为弧度表示
    let rotationSun: number = Math2D.toRadian(this._rotationSun)
    let revolution: number = Math2D.toRadian(this._revolution)
    // 记录当前渲染状态
    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    // this.context2D.save()
    // 绘制矩形在画布中心自转
    this.context2D.rotate(rotationSun)
    // 绕局部坐标系原点自转
    this.fillLocalRectWidthTitleUV(100, 100, '自转', 0.5, 0.5)

    // this.context2D.restore()
    // // 公转+自转，注意顺序
    // 基于上面的结果，进行处理
    this.context2D.save()
    this.context2D.rotate(revolution) // 公转
    this.context2D.translate(radius, 0)
    // 然后沿着当前的x轴平移radius个单位，radius半径形成圆路径
    this.context2D.rotate(rotationMoon) // 自转
    // 一旦平移到圆的路径上，开始绕局部坐标系原点进行自转
    this.fillLocalRectWidthTitleUV(80, 80, '自转+公转', 0.5, 0.5)
    this.context2D.restore()
    // 恢复上一次记录的渲染状态
    this.context2D.restore()

    this.context2D.save()
    // 绘制矩形在画布中心自转
    this.context2D.rotate(revolution)
    // 因为要绘制的矩形和宽度都是100，而原点在矩形左上角
    // 为了将自转的原点位移到中心
    this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    this.context2D.translate(-50, -50)
    this.fillLocalRectWidthTitleUV(100, 100, '自转', 0, 0)
    this.context2D.restore()

    this.context2D.save()
    this.drawCanvasCoordCenter()
    this.strokeCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, radius)
    this.strokeCircle(0, 0, this.distance(0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5, radius))
    this.context2D.restore()
  }

  // 坦克世界
  /**
   * Canvas2D中象限及每个象限对应的角度范围
   * 坦克整体朝向，以及移动时涉及 atan2，sin，cos 三角函数应用
   * 炮管依赖于底座，但是能够独立控制，此时需要特殊处理，涉及坐标系变换时的层次操作
   */
  // 绘制想象
  public draw4Quadrant(): void {
    this.check()
    this.context2D.save()
    this.fillText('第一象限', this.canvas.width, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'right', 'bottom', '20px sans-serif')
    this.fillText('第二象限', 0, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'left', 'bottom', '20px sans-serif')
    this.fillText('第三象限', 0, 0, 'rgba(0, 0, 255, 0.5)', 'left', 'top', '20px sans-serif')
    this.fillText('第四象限', this.canvas.width, 0, 'rgba(0, 0, 255, 0.5)', 'right', 'top', '20px sans-serif')
    this.context2D.restore()
    canvas2d.drawCanvasCoordCenter()
  }

  // 绘制坦克
  public drawTank(): void {
    if (!this._tank) {
      this._tank = new Tank()
      this._tank.x = this.canvas.width * 0.5
      this._tank.y = this.canvas.height * 0.5

      // 让坦克按比例扩展两倍
      // this._tank.scaleX = 2
      // this._tank.scale = 2
      // // 分别旋转坦克和炮管，将角度转换为弧度表示
      // this._tank.tankRotation = Math2D.toRadian(30)
      // this._tank.turretRotation = Math2D.toRadian(-30)
    }

    this._tank.draw(this)
  }
}

const addToolButton = (text: string = '按钮', handleClick: Function = (): void => {}): void => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', handleClick)
  document.querySelector('#tools').appendChild(button)
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
if (canvas === null) {
    alert('无法获取HTMLCanvasElement')
    throw new Error('无法获取HTMLCanvasElement')
}
let canvas2d: Canvas2DApplication = new TestApplication(canvas)
console.log(canvas2d)
addToolButton('Start', () => { canvas2d.start() })
addToolButton('Stop', () => { canvas2d.stop() })
addToolButton('Clear', () => { canvas2d.clearScreen(); })
addToolButton('PrintLineStates', () => { canvas2d.clearScreen(); canvas2d.printLineStates() })
addToolButton('Text Layout', () => { canvas2d.clearScreen(); canvas2d.textMyTextLayout() })
addToolButton('strokeRect', () => { canvas2d.clearScreen(); canvas2d.strokeRect(0, 0, 300, 100, 'red') })
addToolButton('fillCircle', () => { canvas2d.clearScreen(); canvas2d.fillCircle(0, 0, 100, 'red') })
addToolButton('strokeLine', () => { canvas2d.clearScreen(); canvas2d.strokeLine(0, 0, 100, 100) })
addToolButton('strokeCoord', () => { canvas2d.clearScreen(); canvas2d.strokeCoord(100, 100, 300, 100) })
addToolButton('strokeGrid 10px 网格', () => { canvas2d.clearScreen(); canvas2d.strokeGrid('black') })
addToolButton('strokeGrid 50px 网格', () => { canvas2d.clearScreen();canvas2d.strokeGrid('black', 50) })
addToolButton('strokeGrid 100px 网格', () => { canvas2d.clearScreen();canvas2d.strokeGrid('black', 100) })
addToolButton('fillText', () => { canvas2d.clearScreen(); canvas2d.fillText('中华小当家', 300, 300, 'red', 'center', 'middle', canvas2d.makeFontString(40)) })
addToolButton('testCanvas2DTextLayout', () => { canvas2d.clearScreen(); canvas2d.testCanvas2DTextLayout() })
addToolButton('testChangePartCanvasImageData', () => { canvas2d.clearScreen(); canvas2d.testChangePartCanvasImageData() })
addToolButton('drawColorCanvas', () => { canvas2d.clearScreen(); canvas2d.drawColorCanvas() })
addToolButton('drawCanvasCoordCenter', () => { canvas2d.clearScreen(); canvas2d.drawCanvasCoordCenter() })
addToolButton('doTransform-0-true', () => { canvas2d.doTransform(0, true) })
addToolButton('doTransform-0-false', () => { canvas2d.doTransform(0, false) })
addToolButton('doTransform-20-true', () => { canvas2d.doTransform(20, true) }) // 有问题
addToolButton('doTransform-20-false', () => { canvas2d.doTransform(20, false) }) // 没有问题
addToolButton('testFillLocalRectWithTitle', () => { canvas2d.testFillLocalRectWithTitle() })
addToolButton('doLocalTransform', () => { canvas2d.doLocalTransform() })
addToolButton('translateRotateTranslateDrawRect', () => { canvas2d.translateRotateTranslateDrawRect(100) })
addToolButton('testFillLocalRectWithTitleUV', () => { canvas2d.testFillLocalRectWithTitleUV() })
addToolButton('rotationAndRevolutionSimulation', () => { canvas2d.rotationAndRevolutionSimulation() })
addToolButton('draw4Quadrant', () => { canvas2d.draw4Quadrant() })
addToolButton('drawTank', () => { canvas2d.drawTank() })
