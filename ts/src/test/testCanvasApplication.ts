import { Canvas2DApplication } from '../canvas/Application.ts'
import { vec2, Size, Rectangle, ETextLayout, EImageFillType } from '../canvas/math2D.ts'

class TestApplication extends Canvas2DApplication {  
  // 声明_lineDashOffset 成员变量 初始化0
  private _lineDashOffset: number = 0;

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
      this.render()
    }, 0.05)

    super.start()
  }

  public render(): void {
    if (this.context2D !== null) {
      // 流程1: 渲染前，先清屏
      this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
      this._drawRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  public printLineStates(): void {
    console.log('this.context2D: ', this.context2D)
    if (this.context2D !== null) {
      console.log('****LineState***')
      console.log('LineWidth: ', this.context2D.lineWidth) // 1
      console.log('lineCap', this.context2D.lineCap) // butt 和其他两个的区别是不会增加宽度
      console.log('lineJoin', this.context2D.lineJoin) // miter
      console.log('miterLimit', this.context2D.miterLimit) // 10
    }
  }

  private _drawRect(x: number, y: number, w: number, h: number): void {
    if (this.context2D !== null) {
      // 流程2: 绘制时，使用save/restore 对
      this.context2D.save()
      // 流程3: 在渲染状态save后，设置当前的渲染状态
      this.context2D.fillStyle = 'white'
      this.context2D.strokeStyle = 'black'
      this.context2D.lineWidth = 1
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
  public calcLocalTextRectangle(layout: ETextLayout, text: string, parentWidth: number, parentHeight: number): Rectangle {
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
    // 根据ETextLayout 的值来匹配这3个点的分量
    // 计算子矩形相对父矩形原点[0, 0]偏移量
    switch(layout) {
      case ETextLayout.LEFT_TOP:
        o.x = left
        o.y = top
        break
      case ETextLayout.RIGHT_TOP:
        o.x = right
        o.y = top
        break
      case ETextLayout.RIGHT_BOTTOM:
        o.x = right
        o.y = bottom
        break
      case ETextLayout.LEFT_BOTTOM:
        o.x = left
        o.y = bottom
        break
      case ETextLayout.CENTER_MIDDLE:
        o.x = center
        o.y = middle
        break
      case ETextLayout.CENTER_TOP:
        o.x = center
        o.y = 0
        break
      case ETextLayout.RIGHT_MIDDLE:
        o.x = right
        o.y = middle
        break
      case ETextLayout.CENTER_BOTTOM:
        o.x = center
        o.y = bottom
        break
      case ETextLayout.LEFT_MIDDLE:
        o.x = left
        o.y = middle
        break
    }
    // 返回子矩形
    return new Rectangle(o, s)
  }

  public fillRectWithTitle(
    x: number, y: number, width: number, height: number, title: string = '', layout: ETextLayout = ETextLayout.CENTER_MIDDLE, color: string = 'grey', showCoord: boolean = true): void {
    if (this.context2D !== null) {
      this.context2D.save()
        // 1. 绘制矩形
        this.context2D.fillStyle = color
        this.context2D.beginPath()
        this.context2D.rect(x, y, width, height)
        this.context2D.fill()
        // 如果有文字的话，先根据枚举值计算x，y坐标
        if (this.length !== 0) {
          // 2. 绘制文字信息
          // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
          // 调用calcLocalTextRectangle方法
          let rect:Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
          // 绘制文本
          this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif')
          // 绘制文本框
          this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)')
          // 绘制文本框左上角坐标(相对父矩形表示)
          this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
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
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left-top', ETextLayout.LEFT_TOP, 'rgba(255, 255, 0, 0.3)')
    // 3.右上
    drawX = right - drawWidth
    drawY = y
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right-top', ETextLayout.RIGHT_TOP, 'rgba(255, 255, 0, 0.3)')
    // 4.右下
    drawX = right - drawWidth
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right-bottom', ETextLayout.RIGHT_BOTTOM, 'rgba(255, 255, 0, 0.3)')
    // 5.左下
    drawX = x
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left-bottom', ETextLayout.LEFT_BOTTOM, 'rgba(255, 255, 0, 0.3)')

    // 6.中心
    drawX = (right - drawWidth) * 0.5
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center-middle', ETextLayout.CENTER_MIDDLE, 'rgba(255, 255, 0, 0.3)')
    // 7.中上
    drawX = (right - drawWidth) * 0.5
    drawY = y
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center-top', ETextLayout.CENTER_TOP, 'rgba(255, 255, 0, 0.3)')
    // 8.中下
    drawX = (right - drawWidth) * 0.5
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center-bottom', ETextLayout.CENTER_BOTTOM, 'rgba(255, 255, 0, 0.3)')
    // 9.左中
    drawX = x
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left-middle', ETextLayout.LEFT_MIDDLE, 'rgba(255, 255, 0, 0.3)')
    // 10.右中
    drawX = right - drawWidth
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right-middle', ETextLayout.RIGHT_MIDDLE, 'rgba(255, 255, 0, 0.3)')
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
// canvas2d.printLineStates()
// canvas2d.textMyTextLayout()
addToolButton('10px 网格', () => { canvas2d.render(); canvas2d.strokeGrid('black') })
addToolButton('50px 网格', () => { canvas2d.render();canvas2d.strokeGrid('black', 50) })
addToolButton('100px 网格', () => { canvas2d.render();canvas2d.strokeGrid('black', 100) })
// canvas2d.start()

