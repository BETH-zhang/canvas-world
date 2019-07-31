import isArray from 'lodash/isArray'

export const random = (min, max) => Math.floor(Math.random() * (max - min) + min)

export const getRandomPointAry = () => {
  const count = random(2, 10)
  return Array(count).fill(0).map(() => [random(0, 500), random(0, 300)])
}

export const getDefaultOptions = (type, options, { autoHeight, lineHeight }) => {
  const defaultOptions = {
    circle: () => ([autoHeight / 2 + lineHeight, autoHeight / 2 + lineHeight, autoHeight, options]),
    ellipse: () => ([autoHeight * 1.5 / 2 + lineHeight, autoHeight / 2 + lineHeight, autoHeight * 1.5, autoHeight, options]),
    linearPath: () => ([getRandomPointAry()]),
    polygon: () => ([getRandomPointAry()]),
    curve: () => ([getRandomPointAry()]),
    arc: () => (
      // x,  y,   w,   h,  start,stop,     closed
      // [100, 100, 200, 200, -Math.PI * 2, -Math.PI / 2, true, options],
      [random(50, 500), random(50, 500), random(100, 200), random(100, 200), -Math.PI * (Math.random() * 2), Math.PI / (Math.random() * 2), random(0, 2) ? true : false, options]
    ),
  }
  if (defaultOptions[type]) {
    return defaultOptions[type]()
  }
  return [lineHeight, lineHeight, autoHeight, autoHeight, options]
}

export const getMainOptions = (index, type, options, { autoHeight, sortCount, lineHeight }) => {
  const autoWidth = autoHeight
  const col = Math.floor(index % sortCount)
  const row = Math.floor(index / sortCount)
  const mainOptions = {
    circle: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0] = (autoWidth + lineHeight) * col + newOptions[2] / 2 + lineHeight
      newOptions[1] = (autoHeight + lineHeight) * row + newOptions[2] / 2 + lineHeight
      return newOptions
    },
    ellipse: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0] = (autoWidth + lineHeight) * col + newOptions[2] / 2 + lineHeight
      newOptions[1] = (autoHeight + lineHeight) * row + newOptions[3] / 2 + lineHeight
      return newOptions
    },
    linearPath: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0][0] = [(autoWidth + lineHeight) * col + lineHeight, (autoHeight + lineHeight) * row + lineHeight]
      return newOptions
    },
    polygon: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0][0] = [(autoWidth + lineHeight) * col + lineHeight, (autoHeight + lineHeight) * row + lineHeight]
      return newOptions
    },
    curve: () => options || getDefaultOptions(type, options, { autoHeight, lineHeight }),
    arc: () => options || getDefaultOptions(type, options, { autoHeight, lineHeight })
  }
  if (mainOptions[type]) {
    return mainOptions[type]()
  }
  
  const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
  newOptions[0] = (autoWidth + lineHeight) * col + lineHeight
  newOptions[1] = (autoHeight + lineHeight) * row + lineHeight
  return newOptions 
}

export const formatOptions = (index, type, options, params) => {
  if (!params.autoSort) return isArray(options) ? options : getDefaultOptions(type, options, params)
  return getMainOptions(index, type, options, params)
}

export const addTestImage = (ctx) => new Promise((resolve) => {
  var img = new Image();
  img.src = 'http://localhost:8080/test1.jpeg';
  img.onload = function() {
    const width = img.width
    const height = img.height
    ctx.drawImage(img, 0, 0, 800, 800 * height / width)
       
    var point1 = [68, 106]
    var point2 = [80, 222]
    var point3 = [757, 140]
    var point4 = [756, 188]
   
    // const r1 = (point2[1] - point1[1]) / 2
    // const r2 = (point4[1] - point3[1]) / 2
    // const x = point1[0] - r1
    // const y = point1[1] - r1 / 2
    // const w = ((point3[0] - point1[0]) + (point4[0] - point2[0])) / 2 + r1 + r2
    // const h = ((point3[1] - point1[1]) + (point4[1] - point2[1])) / 2 + (r1 + r2) * 2

    const r1 = (point2[1] - point1[1]) / 2
    const r2 = (point4[1] - point3[1]) / 2
    const w = ((point3[0] - point1[0]) + (point4[0] - point2[0])) / 2 + r1 + r2
    const h = ((point3[1] - point1[1]) + (point4[1] - point2[1])) / 2 + (r1 + r2) * 2
    const x = point1[0] - r1 + w / 2
    const y = point1[1] - r1 / 2 + h / 2

    // console.log({
    //   img,
    //   x,
    //   y,
    //   w,
    //   h
    // })
    resolve({
      img,
      x,
      y,
      w,
      h,
      textA: [[71, 105], [160, 105], [163, 201], [71, 203]],
      textWhen: [[83, 261], [264, 259], [265, 346], [80, 355]],
      line: [408, 346, 708, 338],
    })
  }
})