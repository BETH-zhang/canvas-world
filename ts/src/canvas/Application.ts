import { vec2 } from './math2D.ts'
/**
 * 可以启动动画玄幻和结束动画循环
 * 可以进行基于实现的更新与重绘
 * 可以对输入事件（例如鼠标或键盘事件）进行分发和响应
 * 可以被继承扩展，用于 Canvas2D 和 WebGL 渲染
 * 
 * 基于盒子模型的坐标矫正器
 * 实现计时器功能
 */

export enum EInputEventType {
  MOUSEEVENT, // 总类，表示鼠标事件
  MOUSEDOWN, // 鼠标按下事件
  MOUSEUP, // 鼠标弹起事件
  MOUSEMOVE, // 鼠标移动事件
  MOUSEDRAG, // 鼠标拖动事件
  KEYBOARDEVENT, // 总类，表示键盘事件
  KEYUP, // 键按下事件
  KEYDOWN, // 键弹起事件
  KEYPRESS, // 按键事件
}

// EventListenerObject 是 ts预先定义的接口
interface EventListenerObject {
  handleEvent(evt: Event): void
}

/**
 * 实现计时器功能
 * Application类能够同时触发多个计时器
 * 每个计时器可以以不同帧率来重复执行任务
 * 每个计时器可以倒计时方式执行一次任务
 */
// requestAnimationFrame驱动动画的方式，与屏幕刷新频率一致（16.66ms）.
// 有时，可能还要执行其他任务，比如美妙定时输出一些信息，或者在某个时间点仅仅执行一次任务，这些任务并不需要以每秒60帧的速度执行，也就是说需要即可以不同帧率来执行同一个任务，也可以倒计时方法执行一次任务

export type TimerCallback = (id: number, data: any) => void

// 纯数据类
class Timer {
  public id: number = -1
  public enabled: boolean = false
  public callback: TimerCallback
  public callbackData: any = undefined
  public countdown: number = 0
  public timeout: number = 0
  public onlyOnce: boolean = false
  constructor(callback: TimerCallback) {
    this.callback = callback
  }
}

// 对输入事件的分发和响应机制
// CanvasKeyBoardEvent 和 CanvasMouseEvent 都继承自本类
// 基类定义了共同的属性，keyboard 或 mouse 事件都能使用组合键
// 可以按住Ctrl 键的同时点击鼠标左键做某些事情
export class CanvasInputEvent {
  // 3个boolean变量，用来指代 Alt Ctrl Shift 键是否被按下
  public altKey: boolean
  public ctrlKey: boolean
  public shiftKey: boolean
  // type 是一个枚举对象，用来表示当前的事件类型
  public type: EInputEventType
  // 构造函数，使用了default参数，初始化时3个组合键都是false状态
  public constructor(altKey:boolean = false, ctrlKey:boolean = false, shiftKey:boolean = false, type:EinputEventType = EInputEventType.MOUSEEVENT) {
    this.altKey = altKey
    this.ctrlKey = ctrlKey
    this.shiftKey = shiftKey
    this.type = type
  }
}

export class CanvasMouseEvent extends CanvasInputEvent {
  // button 表示当前按下鼠标那个键
  // [ 0: 鼠标左键，1:鼠标中键，鼠标右键 ]
  public button:number
  // 基于 canvas 坐标系的表示
  public canvasPosition: vec2

  public localPosition: vec2

  public constructor(canvasPos: vec2, button: number, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
    super(altKey, ctrlKey, shiftKey)
    this.canvasPosition = canvasPos
    this.button = button

    // 暂时创建一个 vec2 对象
    this.localPosition = vec2.create()
  }
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
  // 当前按下的键的 ASCII 字符
  public key: string
  // 当前按下的键的ASCII 码
  public keyCode: number
  // 当前按下的键是否不停的触发事件
  public repeat: boolean
  public constructor(key: string, keyCode: number, repeat: boolean, altKey:boolean = false, ctrlKey:boolean = false, shiftKey:boolean = false) {
    super(altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT)
    this.key = key
    this.keyCode = keyCode
    this.repeat = repeat
  }
}

// 基于时间的更新与重绘
export class Application implements EventListenerObject {
  // _start 成员变量用于标记当前 Application 是否进入不间断地循环状态
  protected _start: boolean = false
  // 由 Window 对象的 requestAnimationFrame 返回的大于0的id号
  // 可以使用 cancelAnimationFrame(this._requestId)来取消动画循环
  protected _requestId: number = 1
  // 用于基于时间的物理更新，这些成员变量类型前面使用了！，可以进行延迟赋值操作
  protected _lastTime!:number;
  protected _startTime!:number;
  // 如果我们设计的类能够被继承，被扩展，那么最好将成员变量声明为 protected，这样子类也能访问这些成员变量

  // 添加一个开发变量
  public isSupportMouseMove: boolean
  // 使用下面变量来标记当前鼠标是否为按下状态
  // 目的是提供mousedrag事件
  protected _isMouseDown: boolean

  protected canvas: HTMLCanvasElement

  public timers: Timer[] = []
  private _timeId: number = -1; // id 从0开始是有效id，负数是无效id值
  private _fps: number = 0

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    // canvas 元素能够监听鼠标事件
    this.canvas.addEventListener('mousedown', this, false)
    this.canvas.addEventListener('mouseup', this, false)
    this.canvas.addEventListener('mousemove', this, false)

    // window 对象中监听键盘事件
    window.addEventListener('keydown', this, false)
    window.addEventListener('keyup', this, false)
    window.addEventListener('keypress', this, false)

    // 初始化时，mouseDown 为 false
    this._isMouseDown = false
    // 默认状态下，不支持 mousemove事件
    this.isSupportMouseMove = false
    // this.isSupportMouseMove = true
  }

  // 提供一个只读函数，用来获得当前帧率
  public get fps() {
    return this._fps
  }

  // 触发多个定时器任务实现
  private _handleTimers(intervalSec: number): void {
    for (let i = 0; i < this.timers.length; i++) {
      let timer: Timer = this.timers[i]
      // 如果enable为false，继续循环
      // 这句也是重用Timer对象的关键实现
      if (timer.enabled === false) {
        continue
      }
      // countdown 初始化时 = timeout
      // 每次调用本函数，会减少上下帧的时间间隔，也就是update第二个参数传来的值
      // 从而形成倒计时的效果
      timer.countdown -= intervalSec
      // 从这里看，timer并不是很精确；例如：如果update 每次0.16秒 timer设置0.3秒回调一次 那么实际上是 (0.3 - 0.32) < 0
      if (timer.countdown < 0.0) {
        // 调用回调函数
        timer.callback(timer.id, timer.callbackData)
        // 如果计时器需要重复触发
        if (timer.onlyOnce === false) {
          // 重新将 countdown 设置为 timeout
          // timeout不会更改，它规定了触发的时间间隔
          // 每次更新的是countdown 倒计时器
          timer.countdown = timer.timeout // 很精妙的技巧
        } else { // 如果该计时器只需要触发一次，那么就删除该计时器
          this.removeTimer(timer.id)
        }
      }
    }
  }

  // 每次添加一个计时器，先查看timers列表中是否存在可用的timer，有的话，返回该timer的id号
  // 设计原则： 只增不减，重复使用，尽量让内存使用与运行效率达到相对平衡
  public addTimer(callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data:any = undefined): number {
    let timer: Timer
    let found: boolean = false
    for (let i = 0; i < this.timers.length; i++) {
      let timer: Timer = this.timers[i]
      if (timer.enabled === false) {
        timer.callback = callback
        timer.callbackData = data
        timer.timeout = timeout
        timer.countdown = timeout
        timer.enabled = true
        timer.onlyOnce = onlyOnce
        return timer.id
      }
    }
    // 不存在，new一个新的Timer
    timer = new Timer(callback)
    timer.callbackData = data
    timer.timeout = timeout
    timer.countdown = timeout
    timer.enabled = true
    timer.id = ++this._timeId
    timer.onlyOnce = onlyOnce
    this.timers.push(timer)
    return timer.id
  }

  public removeTimer(id: number): boolean {
    let found: boolean = false
    for (let i = 0; i < this.timers.length; i++) {
      if (this.timers[i].id === id) {
        let timer: Timer = this.timers[i]
        timer.enabled = false // 只是设置enabled为false，并没有从数组中删除掉
        /**
         * 这里仅仅做逻辑删除，避免析构（往往用来做清理善后工作）,并且不会调整数组的内容。
         * 如果下次要增加一个新的Timer，会先查找enabled为false的Timer，如果存在，可以重用，避免new一个新的Timer对象
         */
        found = true
        break
      }
    }
    return found
  }

  public start(): void {
    console.log('start', this._start)
    if (!this._start) {
      this._start = true
      this._requestId = -1
      this._lastTime = -1
      this._startTime = -1
      // 启动更新渲染循环
      this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
        // 启动 step 方法
        this.step(elapsedMsec)
      })
      console.log('start:this._requestId: ', this._requestId)
    }
  }

  public stop(): void {
    console.log('stop', this._start)
    if (this._start) {
      console.log('stop:this._requestId: ', this._requestId)
      // cancelAnimationFrame 函数是取消一个先前通过调用window.requestAnimationFrame() 方法添加到计划中的动画帧请求
      cancelAnimationFrame(this._requestId)
      this._lastTime = -1
      this._startTime = -1
      this._requestId = -1
      this._start = false
    }
  }

  public isRunning(): boolean {
    return this._start
  }

  // 周而复始的运动
  protected step(timeStamp: number): void {
    // 第一次调用，设置 _startTime 和 _lastTime 为 timeStamp
    if (!this._startTime) this._startTime = timeStamp
    if (!this._lastTime) this._lastTime = timeStamp
    // 计算当前时间点与第一次调用step时间点的差，以毫秒为单位
    let elapsedMsec: number = timeStamp - this._startTime
    // 记录上一次的时间戳, 以秒为单位 intervalSec
    /**
     * 1.增加 FPS 计算
     * 2.增加调用 _updateTimer 私方法
     */
    let intervalSec: number = (timeStamp - this._lastTime)
    if (intervalSec !== 0) {
      // 计算 fps
      this._fps = 1000.0 / intervalSec
    }
    // update s使用的是以秒为单位，因此转换为秒表示
    intervalSec /= 1000.0
    // 记录上一次时间戳
    this._lastTime = timeStamp

    this._handleTimers(intervalSec)

    // console.log('step---')
    // console.log(' timeStamp = ' + timeStamp)
    // console.log(' elapsedMsec = ' + elapsedMsec)
    // console.log(' intervalMsec = ' + intervalSec)

    // 先更新
    this.update(elapsedMsec, intervalSec)
    // 后渲染
    this.render()

    requestAnimationFrame((elapsedMsec: number): void => {
      this.step(elapsedMsec)
    })
  }

  // 使用
  // 将相对于浏览器 viewport 表示的点变换到相对于 canvas 表示的点
  // 目前的实现，没有考虑到 border和padding的影响
  // 实现：将鼠标事件发生时鼠标指针的位置变换为相对当前 canvas 元素的偏移表示
  private _viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
    if (this.canvas) {
      let rect:ClientRect = this.canvas.getBoundingClientRect()
      if (evt.type === 'mousedown') {
        console.log(' boudingClientRect: ' + JSON.stringify(rect))
        console.log(' clientX: ' + evt.clientX + ' clientY: ' + evt.clientY)
      }

      // 获取触发鼠标事件的 target 元素，这里总是 HTMLCanvasElement
      if (evt.target) {
        let borderLeftWidth: number = 0 // 返回border 左侧离margin的宽度
        let borderTopWidth: number = 0 // 返回border上侧离margin的宽度
        let paddingLeft: number = 0 // 返回padding 相对于border左编译
        let paddingTop: number = 0 // 返回padding 相对于border上偏移
        
        // 调用 getComputedStyle 方法
        let dec1:CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLElement)

        // CSSStyleDeclaration 中的数值都是字符串表示，而且有可能返回null
        // 返回需要进行 null 值判断
        // 并且返回的坐标都是以像素表示，所以是整数类型
        // 使用parseInt转换为十进制整数表示
        let strNumber:string | null = dec1.borderLeftWidth
        if (strNumber !== null) {
          borderLeftWidth = parseInt(strNumber, 10)
        }
        strNumber = dec1.borderTopWidth
        if (strNumber !== null) {
          borderTopWidth = parseInt(strNumber, 10)
        }
        strNumber = dec1.paddingLeft
        if (strNumber !== null) {
          paddingLeft = parseInt(strNumber, 10)
        }
        strNumber = dec1.paddingTop
        if (strNumber !== null) {
          paddingTop = parseInt(strNumber, 10)
        }
        // a = evt.clientX - rect.left 将鼠标点从viewport坐标系变换到border坐标系
        // b = a - borderLeftWidth 将border坐标系变变换到padding坐标系
        // x = b - paddingLeft, 将padding坐标系变换到context坐标系，也就是canvas元素坐标系
        let x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft
        let y: number = evt.clientY - rect.top - borderTopWidth - paddingTop
        // console.log(x, y)

        if (evt.type === 'mousedown') {
          console.log(' borderLeftWidth: ' + borderLeftWidth, ' borderTopWidth: ' + borderTopWidth)
          console.log(' paddingLeft: ' + paddingLeft + ' paddingTop: ' + paddingTop)
        }
  
        return vec2.create(x, y)
      }
      alert('evt.target 为null')
      throw new Error('evt.target为null')
    }

    alert(' canvas 为 null ')
    throw new Error(' canvas为null ')
  }

  // 将 DOM Event 对象信息转换为自己定义的 CanvasMouseEvent 事件
  private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
    // 向下转型，将 Event 转成 MouseEvent
    let event: MouseEvent = evt as MouseEvent
    // 将客户区的鼠标 pos 变到 Canvas 坐标系中表示
    let mousePosition: vec2 = this._viewportToCanvasCoordinate(event)
    // 将要用到的信息传递给CanvasMouseEvent 并返回
    let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey)
    return canvasMouseEvent
  }

  // 将 DOM Event 对象信息转成为自己定义的 Keyboard 事件
  private _toCanvasKeyBoardEvent(evt: Event): CanvasKeyBoardEvent {
    let event: KeyboardEvent = evt as KeyboardEvent
    // 将 Event 一些要用到的信息床底给 CanvasKeyBoardEvent 并返回
    let canvasKeyBoardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey)
    return canvasKeyBoardEvent
  }

  // 调用dispatchXXXX 虚方法进行事件分发
  public handleEvent(evt: Event): void {
    switch (evt.type) {
      case 'mousedown':
        this._isMouseDown = true
        this.dispatchMouseDown(this._toCanvasMouseEvent(evt))
        break
      case 'mouseup':
        this._isMouseDown = false
        this.dispatchMouseUp(this._toCanvasMouseEvent(evt))
        break
      case 'mousemove':
        if (this.isSupportMouseMove) {
          this.dispatchMouseMove(this._toCanvasMouseEvent(evt))
        }
        if (this._isMouseDown) {
          this.dispatchMouseDrag(this._toCanvasMouseEvent(evt))
        }
        break
      case 'keypress':
        this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt))
        break
      case 'keydown':
        this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt))
        break
      case 'keyup':
        this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt))
        break
      default:
        break;
    }
  }

  // 虚方法，子类能覆写(override)
  public update (elapsedMsec: number, intervalSec: number): void {}
  public render () : void {}

  protected dispatchMouseDown(): void {}
  protected dispatchMouseUp(): void {}
  protected dispatchMouseMove(): void {}
  protected dispatchMouseDrag(): void {}
  protected dispatchKeyPress(): void {}
  protected dispatchKeyDown(): void {}
  protected dispatchKeyUp(): void {}

  // 以上两个方法空实现，需要继承
}

/**
封装：将不变的部分（更新和渲染的流程）封装起来放在基类中，也就是基类固定了整个行为规范
多态：将可变部分以虚方法的方式公开给具体实现者，基类并不知道每个子类要如何更新
继承：虚函数多态机制依赖于继承，没有继承就没有多态
 */

 export class Canvas2DApplication extends Application {
   public context2D: CanvasRenderingContext2D | null
   public constructor(canvas: HTMLCanvasElement, contextAttributes ?: Canvas2DContextAttributes) {
    super(canvas)
    this.isSupportMouseMove = true
    this.context2D = this.canvas.getContext('2d', contextAttributes)
    console.log('canvas---', this.context2D)
   }
 }

 export class WebGLApplication extends Application {
   public context3D: WebGLRenderingContext | null

   public constructor(canvas: HTMLCanvasElement, contextAttributes ? : WebGLContextAttributes) {
    super(canvas)
    this.context3D = this.canvas.getContext('webgl', contextAttributes)
    if (this.context3D === null) {
      this.context3D = this.canvas.getContext('experimental-wegbl', contextAttributes)
      alert(' 无法创建 WebGLRenderingContext 上下文对象')
      throw new Error('无法创建 WebGLRenderingContext 上下文对象')
    }
   }
 }