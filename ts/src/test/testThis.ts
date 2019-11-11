import { Canvas2D } from './canvas/Canvas2D.ts'

class TestThis {
  // 编写一个打印this 的方法
  public printCB(msec: number): void {
    console.log(this)
  }
  // 构造函数
  public constructor () {
    // 将this.printCB虚哦为参数传递给requestAnimationFrame方法
    // 非严格模式，this-》window  严格模式 this-》null
    // window.requestAnimationFrame(this.printCB)
    window.requestAnimationFrame(this.printCB.bind(window))
    // window.requestAnimationFrame((msec: number): void => {
    //   this.printCB(msec)
    // })
  }
}

// 生成一个实例，该对象的构造函数会调用
new TestThis()