// 实现一个js截去视频流中图片的功能
import Canvas2image from './canvas2image'

const getVideo = (className) => {
  const ele = document.querySelector(`.${className}`)
  const video = ele.getElementsByTagName('video')
  if (video.length) {
    return video[0]
  }
  return null
}

class Screenshots {
  constructor(options) {
    this.options = options
    this.videoClass = this.options.videoClassName
    this.canvas = document.getElementById(this.options.id)
    this.context = this.canvas.getContext('2d')

    this.canvas2image = new Canvas2image()
  }

  snap = () => {
    this.video = getVideo(this.options.videoClassName)
    this.context.drawImage(this.video, 0, 0, this.options.width, this.options.height);
  }

  download = () => {
    const img = this.canvas2image.saveAsPNG(this.canvas, new Date())
    const blob = this.canvas2image.dataURLtoFile(img)
    const formdata = new FormData()
    formdata.append('name', 'aaa')
    formdata.append('file', blob)
    return formdata
  }
}

export default Screenshots
