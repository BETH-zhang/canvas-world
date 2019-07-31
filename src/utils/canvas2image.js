
class Canvas2image {
  constructor() {
    this.strDownloadMime = 'image/octet-stream'
  }

  saveFile = (data, filename) => {
    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    saveLink.href = data
    saveLink.download = filename

    const event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    saveLink.dispatchEvent(event)
  }

  fixType = (type) => {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg')
    const r = type.match(/png|jpeg|bmp|gif/)[0]
    return `image/${r}`
  }

  dataURLtoFile = (dataurl, filename = 'file') => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const suffix = mime.split('/')[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {type: mime})
  }

  dataURItoBlob = (dataURI) => {
    const byteString = dataURI.split(',')[1]
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  }

  saveAsImg = (oCanvas, filename) => {
    const type = 'png'
    let imgData = oCanvas.toDataURL(type)
    imgData = imgData.replace(this.fixType(type), 'image/octet-stream')
    // 二进制流
    this.saveFile(imgData, `${filename}.png`)
    return imgData
  }

  saveAsPNG = (oCanvas, filename) => {
    const strData = oCanvas.toDataURL('image/png')
    this.saveFile(strData.replace('image/png', this.strDownloadMime), `${filename}.png`)
    return strData
  }

  saveAsJPEG = (oCanvas, filename) => {
    const strMime = 'image/jpeg'
    const strData = oCanvas.toDataURL(strMime)

    if (strData.indexOf(strMime) !== 5) {
      return false
    }
    this.saveFile(strData.replace(strMime, this.strDownloadMime), `${filename}.png`)
    return strData
  }
}

export default Canvas2image
