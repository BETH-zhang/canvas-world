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
       
    var p1 = {x: 68, y: 106}
    var p2 = {x: 80, y: 222}
    var p3 = {x: 757, y: 140}
    var p4 = {x: 756, y: 188}

    const hr1 = (p2.y - p1.y) / 2
    const hr2 = (p4.y - p3.y) / 2
    const w = ((p3.x - p1.x) + (p4.x - p2.x)) / 2 + hr1 + hr2
    const h = ((p3.y - p3.y) + (p4.y - p2.y)) / 2 + (hr1 + hr2) * 2
    const x = p1.x - hr1 + w / 2
    const y = p1.y - hr1 / 2 + h / 2

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
      p: [[177, 135], [761, 132], [755, 190], [180, 194]],
    })
  }
})

export const findFourPoint = (arr, type) => {
  var rightPointer = arr.length - 1
  if (rightPointer < 1) {
    return 0
  }
  var leftPointer = 0
  var left = arr[0][0]
  var right = 0
  var top = arr[0][1]
  var bottom = 0
  
  while (leftPointer < rightPointer) {
    console.log(leftPointer)
    const pointL = arr[leftPointer]

    console.log(1, pointL, left, right, bottom, top)
    // const pointR = arr[rightPointer]
    if (pointL[0] < left) left = pointL[0]
    if (pointL[0] > right) right = pointL[0]
    if (pointL[1] > bottom) bottom = pointL[1]
    if (pointL[1] < top) top = pointL[1]

    console.log(2, pointL, left, right, bottom, top)
    leftPointer++
  }
  console.log(left, right, top, bottom)
  // 'ellipse', 'rectangle', 'circle'
  if (type === 'rectangle') {
    return [
      left,
      top,
      right - left,
      bottom - top
    ]
  } else if (type === 'circle') {
    return [
      (right - left) / 2 + left,
      (bottom - top) / 2 + top,
      Math.max(right - left, bottom - top)
    ]
  }

  return [
    (right - left) / 2 + left,
    (bottom - top) / 2 + top,
    right - left,
    bottom - top
  ]
}