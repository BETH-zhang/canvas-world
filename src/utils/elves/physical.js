var phySicalTools = {}

export const checkBoundary = (x, y, target) => {
  return x > target.x && x < (target.x + target.w) && y > target.y && y < (target.y + target.h)
}

// Boundary Restrictions
phySicalTools.checkBorder = (obj, boundary) => {
  if (obj.x < obj.radius) {
    return 'left'
  } else if (obj.x > boundary.width - obj.radius) {
    return 'right'
  } else if (obj.y < obj.radius) {
    return 'top'
  } else if (obj.y > boundary.height - obj.radius) {
    return 'down'
  }
  return ''
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
  if (rectA.x + rectA.width < rectB.x) {
    return 'right'
  } else if (rectB.x + rectB.width < rectA.x) {
    return 'left'
  } else if (rectA.y + rectA.height < rectB.y) {
    return 'bottom'
  } else if (rectB.y + rectB.height < rectA.y) {
    return 'top'
  }
  return ''
}

export default phySicalTools