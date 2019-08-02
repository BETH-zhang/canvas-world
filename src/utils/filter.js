class Filter {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  grayscale = () => {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg // red
      data[i + 1] = avg // green
      data[i + 2] = avg // blue
    }
    this.ctx.putImageData(imageData, 0, 0)
  }

  invert = () => {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
    this.ctx.putImageData(imageData, 0, 0)
  }
}

export default Filter