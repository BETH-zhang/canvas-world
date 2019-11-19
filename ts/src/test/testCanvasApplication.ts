import TestApplication from '../canvas/CanvasApplication.ts'

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
addToolButton('drawTriangle', () => { canvas2d.drawTriangle(0, 0, 100, 50, 300, 300) })
