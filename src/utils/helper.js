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
    linearPath: () => options || getDefaultOptions(type, options, { autoHeight, lineHeight }),
    polygon: () => options || getDefaultOptions(type, options, { autoHeight, lineHeight }),
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