import { Math2D } from './math2D.ts'

/**
 * 需求描述：
 * 1.将整个画布分为四大象限，分别标记出这些象限
 * 2.坦克本身由四大基本元素图形组成，直线表示炮管，椭圆表示炮塔，矩形的底座及圆形用于标记坦克的正前方及炮口
 * 3.当移动鼠标时，整个坦克会自动旋转后朝向鼠标指针方向并不停的移动，到达鼠标指针所在点后停止运行
 * 4.当按R键时，坦克的炮塔顺时针旋转；当按T键时，坦克的炮塔重置到初始化状态
 * 5.在drawCoordInfo方法中增加输出坦克当前的朝向角度相关信息
 * 6.为了追踪运行路线，绘制出画布中心点到坦克中心点（translate、rotate、scale追踪原点），以后坦克中心点到鼠标指针位置的连线
 */

/**
 * 操作中，蕴含数学操作：
 * 1.Canvas2D象限及每个象限对应的角度取值范围
 * 2.坦克整体朝向，以及移动时涉及atan2，sin和cos三角函数的应用
 * 3.炮管依赖于底座，但是能够独立控制，此时需要特殊处理，涉及坐标系变换时的层次操作
 */

class Tank {
  // 坦克的大小尺寸
  public width: number = 80
  public height: number = 50
  // 坦克的位置
  public x: number = 100
  public y: number = 100
  // 坦克的缩放系数
  public scaleX: number = 1.0
  public scaleY: number = 1.0
  // 坦克当前的旋转角度
  public tankRotation: number = 0 // 整个坦克的旋转角度
  public turretRotation: number = 0 // 炮塔的旋转角度
  // 在Tank类中增加一个成员变量，用来标识Tank初始化时是否朝着y轴正方向
  public initYAxis: boolean = true
  public showLine: boolean = false // 是否显示坦克原点与画布中心点和目标点之间的连线
  public showCoord: boolean = true // 是否显示坦克本身的局部坐标系
  public gunLength: number = Math.max(this.width, this.height)
  // 炮管长度，default情况下，等于坦克的width和height中最大的一个数值
  public gunMuzzleRadius: number = 5

  // 添加鼠标指针位置的成员变量
  public targetX: number = 0
  public targetY: number = 0

  // 线性移动时的速率
  public linearSpeed: number = 100.0
  // turretRotateSpeed 用于控制炮塔的旋转速度，初始化旋转速度设置为每秒旋转2角度表示
  // 由于三角函数中要使用弧度为单位，因此需要调用Math2D.toRadian(2) 方法，将角度转换为弧度表示
  public turretRotateSpeed: number = Math2D.toRadian(2)

  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    switch(evt.key) {
      case 'r':
        this.turretRotation += this.turretRotateSpeed
        break
      case 't':
        this.turretRotation = 0
        break
      case 'e':
        this.turretRotation -= this.turretRotation
        break
    }
  }

  private _moveTowardTo(intervalSec: number): void {
    // 将鼠标点的x和y变换到相对坦克坐标原点的表示
    let diffX: number = this.targetX - this.x
    let diffY: number = this.targetY - this.y
    // linearSpeed的单位：像素 / 秒
    let currSpeed: number = this.linearSpeed * intervalSec
    // 根据时间差计算出当前的运行速度
    // 关键点1:判断坦克是否需要停止运动
    // 如果整个要运行的距离大于当前的速度，说明还没有到达目的地，可以继续刷新坦克的位置
    if ((diffX * diffY + diffY + diffY) > currSpeed * currSpeed) {
      // 关键点2:使用sin和cos函数计算斜向运行时 x，y 分量
      // 方案一：
      // if (this.initYAxis) {
      //   this.x = this.x - Math.cos(this.tankRotation) * currSpeed
      //   this.y = this.y + Math.sin(this.tankRotation) * currSpeed
      // } else {
      //   this.x = this.x + Math.cos(this.tankRotation) * currSpeed
      //   this.y = this.y + Math.sin(this.tankRotation) * currSpeed
      // }
      // 方案二：
      let rot: number = this.tankRotation
      if (this.initYAxis) {
        rot += Math.PI / 2
      }
      this.x = this.x + Math.cos(rot) * currSpeed
      this.y = this.y + Math.sin(rot) * currSpeed
    }
  }

  public update(intervalSec: number): void {
    this._moveTowardTo(intervalSec)
  }

  private _lookAt(): void {
    // 将鼠标点的x，和y变换为相对坦克坐标系原点的表示值
    let diffX: number = this.targetX - this.x
    let diffY: number = this.targetY - this.y
    // 通过atan2 方法，计算出方位角，以弧度表示
    let radian = Math.atan2(diffY, diffX)
    if (this.initYAxis) {
      radian -= Math.PI / 2
    }
    // 设置坦克将要朝向的方向
    this.tankRotation = radian
  }

  // 处理鼠标指针移动的方法
  public onMouseMove(evt: CanvasMouseEvent): void {
    // 每次鼠标指针移动时，记录当前鼠标指针在Canvas2D画中的位置
    this.targetX = evt.canvasPosition.x;
    this.targetY = evt.canvasPosition.y;
    this._lookAt()
  }

  public draw(app: TestApplication): void {
    app.check()
    // 整个坦克绘制
    app.context2D.save()
    // 整个坦克移动和旋转，注意局部变换的经典结合顺序
    // trs；translate -》rotate-》scale
    app.context2D.translate(this.x, this.y)
    // 方案三：
    if (this.initYAxis) {
      app.context2D.rotate(this.tankRotation - Math.PI * 0.5)
    } else {
      app.context2D.rotate(this.tankRotation)
    }
    app.context2D.scale(this.scaleX, this.scaleY)
    // 绘制坦克的底盘（矩形）
    app.context2D.save()
    app.context2D.fillStyle = 'grey'
    app.context2D.beginPath()
    if (this.initYAxis) {
      app.context2D.rect(-this.height * 0.5, -this.width * 0.5, this.height, this.width)
    } else {
      app.context2D.rect(-this.width * 0.5, -this.height * 0.5, this.width, this.height)
    }
    app.context2D.fill()
    app.context2D.restore()
    // 绘制炮塔
    app.context2D.save()
    app.context2D.rotate(this.turretRotation)
    app.context2D.fillStyle = 'red'
    app.context2D.beginPath()
    if (this.initYAxis) {
      app.context2D.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2)
    } else {
      app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2)
    }
    app.context2D.fill()
    // 绘制炮管
    app.context2D.strokeStyle = 'blue'
    app.context2D.lineWidth = 5; // 炮管需要短一点
    app.context2D.lineCap = 'round'
    app.context2D.beginPath()
    app.context2D.moveTo(0, 0)
    if (this.initYAxis) {
      app.context2D.lineTo(0, this.gunLength)
      app.context2D.stroke()
      // 炮口，先将局部坐标系从当前的方向，向x轴的正方向平移gunLength（数值类型的变量，以像素为单位，表示炮管的长度）个像素，此时局部坐标系在炮管最右侧
      app.context2D.translate(0, this.gunLength)
      // 然后再从当前的坐标系向x轴的正方向平移gunMuzzleRadius（数值类型的变量，以像素为党委，表示炮管的半径）个像素，这样炮口的外切圆正好和炮管接触
      app.context2D.translate(0, this.gunMuzzleRadius)
    } else {
      app.context2D.lineTo(this.gunLength, 0)
      app.context2D.stroke()
      // 炮口，先将局部坐标系从当前的方向，向x轴的正方向平移gunLength（数值类型的变量，以像素为单位，表示炮管的长度）个像素，此时局部坐标系在炮管最右侧
      app.context2D.translate(this.gunLength, 0)
      // 然后再从当前的坐标系向x轴的正方向平移gunMuzzleRadius（数值类型的变量，以像素为党委，表示炮管的半径）个像素，这样炮口的外切圆正好和炮管接触
      app.context2D.translate(this.gunMuzzleRadius, 0)
    }
    app.fillCircle(0, 0, 5, 'black')
    app.context2D.restore()
    // 绘制一个圆球，标记坦克正方向，一旦炮管旋转后，可以直到正前方在那里
    app.context2D.save()
    if (this.initYAxis) {
      app.context2D.translate(0, this.width)
    } else {
      app.context2D.translate(this.width, 0)
    }
    app.fillCircle(0, 0, 10, 'green')
    app.context2D.restore()
    // 坐标系是跟随整个坦克的
    if (this.showCoord) {
      app.context2D.save()
      app.context2D.lineWidth = 1
      app.context2D.lineCap = ''
      app.strokeCoord(0, 0, this.width * 1.2, this.height * 1.2)
      app.context2D.restore()
    }
    app.context2D.restore()
    app.context2D.save();
    app.strokeLine(this.x, this.y, app.canvas.width * 0.5, app.canvas.height * 0.5)
    app.strokeLine(this.x, this.y, this.targetX, this.targetY)
    app.context2D.restore()
  }
}

export default Tank