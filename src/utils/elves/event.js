import { addEvent, getOffSet } from 'us-common-utils'

const eventTools = {}

// 点击事件
eventTools.getClick = (element) => {
  // 定义一个mouse的对象
  const mouse = { x: 0, y: 0 }
  // 为传入的元素添加mousemove事件
  addEvent(element, 'click', (event) => {
    let x = 0
    let y = 0
    // 获取鼠标当前位置，并作兼容处理￼
    // 兼容Firefox、chrome、IE9及以上￼
    const e = event || window.event
    //获取鼠标当前位置，并作兼容处理
    //兼容Firefox、chrome、IE9及以上
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    //兼容IE8及以下，以及混杂模式下的Chrome和Safari
    else {
      x = e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft
      y = e.clientY + document.body.scrollTop || document.documentElement.scrollTop
    }
    //将当前的坐标值减去canvas元素的偏移位置，则x、y为鼠标在canvas中的相对坐标
    const point = getOffSet(element)
    x -= point.left
    y -= point.top

    mouse.x = x
    mouse.y = y
  })

  // 返回值为mouse对象
  return mouse
}

// 鼠标事件
eventTools.getMouse = (element) => {
  // 定义一个mouse的对象
  const mouse = { x: 0, y: 0 }
  // 为传入的元素添加mousemove事件
  addEvent(element, 'mousemove', (event) => {
    let x = 0
    let y = 0
    // 获取鼠标当前位置，并作兼容处理￼
    // 兼容Firefox、chrome、IE9及以上￼
    const e = event || window.event
    //获取鼠标当前位置，并作兼容处理
    //兼容Firefox、chrome、IE9及以上
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    //兼容IE8及以下，以及混杂模式下的Chrome和Safari
    else {
      x = e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft
      y = e.clientY + document.body.scrollTop || document.documentElement.scrollTop
    }
    //将当前的坐标值减去canvas元素的偏移位置，则x、y为鼠标在canvas中的相对坐标
    const point = getOffSet(element)
    x -= point.left
    y -= point.top

    mouse.x = x
    mouse.y = y
  })

  // 返回值为mouse对象
  return mouse
}

// 键盘事件
eventTools.getKey = () => {
  const key = {}
  addEvent(window, 'keydown', (e) => {
    if (e.keyCode === 38 || e.keyCode === 87) {
      key.direction = 'up'
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      key.direction = 'right'
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      key.direction = 'down'
    } else if (e.keyCode === 37 || e.keyCode === 65) {
      key.direction = 'left'
    } else {
      key.direction = ''
    }
  }, false)

  return key
}

export default eventTools