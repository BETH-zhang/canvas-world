import Atomic from './atomic'
import Filter from './filter'
import Tools from './drawTools'
import Draw from './draw';

class Elves extends Draw {
  constructor(canvas, options) {
    super()
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.raf = null

    this.initStyle(options || {})

    this.atomic = new Atomic(canvas, this)
    this.filter = new Filter(canvas, this)
    this.tools = new Tools(canvas, this)
  }
}

export default Elves