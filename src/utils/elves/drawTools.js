class Tools {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  draw = (atomic) => {
    this.clear() 
    atomic.draw()
    // 移动
    atomic.x += atomic.vx
    atomic.y += atomic.vy

    // 碰撞检测
    if (atomic.y + atomic.vy > this.canvas.height || atomic.y + atomic.vy < 0) {
      atomic.vy = -atomic.vy;
    }
    if (atomic.x + atomic.vx > this.canvas.width || atomic.x + atomic.vx < 0) {
      atomic.vx = -atomic.vx;
    }
    this.raf = window.requestAnimationFrame(() => (this.draw(atomic)))
  }

  clear = () => {
    // 长尾效果
    this.ctx.fillStyle = 'rgba(255,255,255,0.3)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  longTailEffect = (atomic) => {
    let running = false
    this.canvas.addEventListener('mousemove', function(e){
      if (!running) {
        this.clear();
        atomic.x = e.clientX;
        atomic.y = e.clientY;
        atomic.draw();
      }
    });
    
    this.canvas.addEventListener('click',function(e){
      if (!running) {
        this.raf = window.requestAnimationFrame(() => (this.draw(atomic)));
        running = true;
      }
    });
    
    this.canvas.addEventListener('mouseout', function(e){
      window.cancelAnimationFrame(this.raf);
      running = false;
    });
  }

  readsColor = (row = 1, column = 1, rgbaIndex = 1) => {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    // Uint8ClampedArray.length bytes为单位
    return imageData.data[(((row - 1) * imageData.width + (column - 1)) * 4 - 1 + rgbaIndex)]
  }

  drawPixelColor = (event) => {
    if (!event) return null
    var x = event.layerX;
    var y = event.layerY;
    var pixel = this.ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = 'rgba(' + data[0] + ',' + data[1] +
              ',' + data[2] + ',' + (data[3] / 255) + ')';
    console.log(`%c${rgba}`, `color: ${rgba}`)

    return rgba
  }

  offcreenRender = (canvas) => {
    const entity = {}
    entity.offscreenCanvas = canvas;
    entity.offscreenCanvas.width = entity.width;
    entity.offscreenCanvas.height = entity.height;
    entity.offscreenContext = entity.offscreenCanvas.getContext("2d");

    // entity.render(entity.offscreenContext);
  }

  addMouseEvent = (mousedown, mousemove, mouseup) => {
    let allowMouse = false

    var onMouseMove = (evt) => {
      if (allowMouse) {
        mousemove(evt)
      } 
    }

    var onMouseUp = (evt) => {
      allowMouse = false
      document.removeEventListener('mouseup', onMouseUp, false)
      document.removeEventListener('mousemove', onMouseMove, false)
      mouseup(evt)
    }

    this.canvas.addEventListener('mousedown', (evt) => {
      allowMouse = true
      mousedown(evt, () => {
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
      })
    });
  }

  addClickEvent = () => {
    this.canvas.addEventListener('click', (evt) => {
      const px = evt.clientX
      const py = evt.clientY
      
    })
  }
}

export default Tools