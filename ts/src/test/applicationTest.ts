import { Application, CanvasKeyBoardEvent, CanvasMouseEvent } from '../canvas/Application.ts'

class ApplicationTest extends Application {
  protected dispatchKeyDown (evt: CanvasKeyBoardEvent): void {
    console.log('key: ' + evt.key + " is down ", evt)
  }
  protected dispatchMouseDown(evt: CanvasMouseEvent): void {
    console.log('canvasPosition: ' + evt.canvasPosition)
  }
  public update(elapsedMsec: number, intervalSec: number): void {
    console.log('elapsedMsec: ' + elapsedMsec + " intervalSec: " + intervalSec)
  }
  public render(): void {
    console.log('调用render方法')
  }
}


let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
if (canvas === null) {
    alert('无法获取HTMLCanvasElement')
    throw new Error('无法获取HTMLCanvasElement')
}

// app 声明的类型是 Application 基类，而不是 ApplicationTest子类，但是new的时候缺失 ApplicationTest子类
let app: Application = new ApplicationTest(canvas)

function timerCallback(id: number, data: string): void {
  console.log('当前调用的Timer的id: ', id, ' data: ', data)
}
let timer0: number = app.addTimer(timerCallback, 3, true, ' data 是 timeCallback 的数据')
let timer1: number = app.addTimer(timerCallback, 5, false, '111')

// 当用app调用update和render方法时，就会发生多态行为，也就是运行时函数地址动态绑定；基类自动调用子类的同名虚方法就是多态
// 多态非常适合面向接口编程，面向抽象编程
// 设计框架时，非常常用。将不变的部分封装在基类，将可变部分以虚方法公开给用户自己实现。这种行为从设计模式角度说，就是经典的模版方法设计模式
app.update(0, 0)
app.render()

let startButton: HTMLButtonElement | null = document.getElementById('start') as HTMLButtonElement
let stopButton: HTMLButtonElement | null = document.getElementById('stop') as HTMLButtonElement
startButton.onclick = (ev: MouseEvent): void => {
  app.start()
}
stopButton.onclick = (ev: MouseEvent): void => {
  // app.stop()
  app.removeTimer(timer1)
  console.log(app.timers.length)
  let id: number = app.addTimer(timerCallback, 10, true, '222')
  console.log(id === 0)
}
