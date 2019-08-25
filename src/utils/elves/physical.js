var phySicalTools = {}

export const checkBoundary = (x, y, target) => {
  return x > target.x && x < (target.x + target.w) && y > target.y && y < (target.y + target.h)
}

// Boundary Restrictions
phySicalTools.checkBorder = (obj, boundary) => {
  var borderDirection = []
  if (obj.x < obj.radius) {
    borderDirection.push('left')
  }
  if (obj.x > boundary.width - obj.radius) {
    borderDirection.push('right')
  }
  if (obj.y < obj.radius) {
    borderDirection.push('top')
  }
  if (obj.y > boundary.height - obj.radius) {
    borderDirection.push('down')
  }

  return borderDirection
}

phySicalTools.checkAroundBorder = (obj, boundary) => {
  if (obj.x < -obj.radius) {
    return 'left'
  } else if (obj.x > boundary.width + obj.radius) {
    return 'right'
  } else if (obj.y < -obj.radius) {
    return 'top'
  } else if (obj.y > boundary.height + obj.radius) {
    return 'down'
  }
  return ''
}

phySicalTools.checkRectBorder = (rectA, rectB) => {
  // 相对于A
  let isContact = false
  if (rectA.x + rectA.width < rectB.x) {
    // return 'right'
    isContact = false
  } else if (rectB.x + rectB.width < rectA.x) {
    // return 'left'
    isContact = false
  } else if (rectA.y + rectA.height < rectB.y) {
    // return 'bottom'
    isContact = false
  } else if (rectB.y + rectB.height < rectA.y) {
    // return 'top'
    isContact = false
  } else {
    isContact = true
  }

  return isContact // 碰到
}

phySicalTools.checkCircleBorder = (circleA, circleB) => {
  var dx = circleB.x - circleA.x
  var dy = circleB.y - circleA.y
  var distantce = Math.sqrt(dx * dx + dy * dy)

  if (distantce < (circleA.radius + circleB.radius)) {
    return true
  }
  return false
}

phySicalTools.checkManyObjectCircleBorder = (objs, callback) => {
  objs.forEach((objA, i) => {
    for (var j = i + 1; j < objs.length - 1; j ++) {
      var objB = objs[j]
      if (phySicalTools.checkCircleBorder(objA, objB)) {
        callback(objA, objB)
      }
    }
  })
}

phySicalTools.checkCaptureRectElement = (mouse, rect) => {
  return mouse.x > rect.x &&
    mouse.x < rect.x + rect.width &&
    mouse.y > rect.y &&
    mouse.y < rect.y + rect.height
}

phySicalTools.checkCaptureCircleElement = (mouse, circle) => {
  var dx = mouse.x - circle.x
  var dy = mouse.y - circle.y
  var distantce = Math.sqrt(dx * dx + dy * dy)
  if (distantce < circle.radius) {
    return true
  }
  return false
}

export default phySicalTools