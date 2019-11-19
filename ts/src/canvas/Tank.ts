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

  private _lookAt(): void {
    // 将鼠标点的x，和y变换为相对坦克坐标系原点的表示值
    let diffX: number = this.targetX - this.x
    let diffY: number = this.targetY - this.y
    // 通过atan2 方法，计算出方位角，以弧度表示
    let radian = Math.atan2(diffY, diffX)
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
      app.context2D.translate(this.x, this.y)
      app.context2D.rotate(this.tankRotation)
      app.context2D.scale(this.scaleX, this.scaleY)
      // 绘制坦克的地盘
      app.context2D.save()
        app.context2D.fillStyle = 'grey'
        app.context2D.beginPath()
        app.context2D.rect(-this.width * 0.5, -this.height * 0.5, this.width, this.height)
        app.context2D.fill()
      app.context2D.restore()
      // 绘制炮塔
      app.context2D.save()
        app.context2D.rotate(this.turretRotation)
        app.context2D.fillStyle = 'red'
        app.context2D.beginPath()
        app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2)
        app.context2D.fill()
        // 绘制炮管
        app.context2D.strokeStyle = 'blue'
        app.context2D.lineWidth = 5;
        app.context2D.lineCap = 'round'
        app.context2D.beginPath()
        app.context2D.moveTo(0, 0)
        app.context2D.lineTo(this.gunLength, 0)
        app.context2D.stroke()
        // 炮口，先将局部坐标系从当前的方向，向x轴的正方向平移gunLength（数值类型的变量，以像素为单位，表示炮管的长度）个像素，此时局部坐标系在炮管最右侧
        app.context2D.translate(this.gunLength, 0)
        // 然后再从当前的坐标系向x轴的正方向平移gunMuzzleRadius（数值类型的变量，以像素为党委，表示炮管的半径）个像素，这样炮口的外切圆正好和炮管接触
        app.context2D.translate(this.gunMuzzleRadius, 0)
        app.fillCircle(0, 0, 5, 'black')
      app.context2D.restore()
      // 绘制一个圆球，标记坦克正方向，一旦炮管旋转后，可以直到正前方在那里
      app.context2D.save()
        app.context2D.translate(this.width * 0.5, 0)
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
  }
}

export default Tank