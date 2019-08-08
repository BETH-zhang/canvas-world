// 三角函数
const sinRadian = (y, r) => {
  return Math.sin(y, r)
}

const cosRadian = (x, r) => {
  return Math.cos(x, r)
}

const tanRadian = (y, x) => {
  return Math.tan(y, x)
}

// const angle = (angle) => {
//   // 1 角度 = PI / 180
//   return angle * Math.PI / 180
// }

const sinAngle = (radian) => {
  // 这两个函数中的X 都是指的“弧度”而非“角度”，弧度的计算公式为： 2*PI/360*角度；
  // 30° 角度 的弧度 = 2*PI/360*30
  return radian * 360 / (2 * Math.PI)
}

const cosAngle = (angle) => {
  return Math.cos(angle)
}

const tanAngle = (angle) => {
  return Math.tan(angle)
}

const pow = (num, pow) => {
  return Math.pow(num, pow)
}

const sqrt = (num) => {
  return Math.sqrt(num)
}

// 反三角函数
const asin = (num) => {
  // 直接用asin求出的值是弧度
  return Math.asin(num) * Math.PI / 180
}

const acos = (num) => {
  return Math.acos(num) * Math.PI / 180
}

const atan = (num) => {
  return Math.atan(num)
}

// 极坐标系和单位圆
/**
 * 在笛卡尔直角坐标系中，任意一点(x, y)都可以转换成极坐标表示（r, @）
 */
const radius = (x, y) => {
  return sqrt(pow(x, 2) + pow(y, 2))
}

const angle = (y, x) => {
  return Math.atan2(y, x)
}

const angleToRadian = (angle) => {
  return (2 * Math.PI / 360) * angle
}

const radianToAngle = (radian) => {
  // sin
  // return radian / (2 * Math.PI / 360)
  // acos
  return Math.floor(180 / (Math.PI / radian))
}

const sideToAngle = (x, y) => {
  const r = radius(x, y)
  const a = angle(y, x)
  const x1 = Math.sin(45) * r
  const y1 = Math.cos(45) * r
  const xr = Math.cos(x, r)
  const yr = Math.sin(y, r)
  console.log(r, a, x1, y1, xr, yr)
}

/*
X坐标=a + Math.sin(2*Math.PI / 360) * r 
Y坐标=b + Math.cos(2*Math.PI / 360) * r
for(var times=0; times<60; times++) {
  var hudu = (2 * Math.PI / 360) * 6 * times;
  var X = a + Math.sin(hudu) * r;
  var Y = b - Math.cos(hudu) * r
  // 注意此处是“-”号，因为我们要得到的Y是相对于（0,0）而言的。
}
*/

export const getAngle = (cx, cy, mx, my, w3cCoordinates) => {
  // 获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
  var x = Math.abs(cx - mx);
  var y = Math.abs(cy - my);
  var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  var cos = y / z;
  var radina = Math.acos(cos);//用反三角函数求弧度
  var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

  if (mx > cx && my > cy) {// 鼠标在第四象限
    angle = 180 - angle;
  }
  if (mx == cx && my > cy) {// 鼠标在y轴负方向上
    angle = 180;
  }
  if (mx > cx && my == cy) {// 鼠标在x轴正方向上
    angle = 90;
  }
  if (mx < cx && my > cy) {// 鼠标在第三象限
    angle = 180 + angle;
  }
  if (mx < cx && my == cy) {// 鼠标在x轴负方向
    angle = 270;
  }
  if (mx < cx && my < cy) {// 鼠标在第二象限
    angle = 360 - angle;
  }

  // 默认直角坐标系
  if (w3cCoordinates) {
    angle = angle - 90
  }
  
  return angle;
}

// console.log(sinRadian(3, 6), sinAngle(sinRadian(1, 2)), asin(1/ 2))
// console.log(cosRadian(4, 5), cosAngle(30))
// console.log(tanRadian(3, 4), tanAngle(30))
// console.log(pow(2, 3))
// console.log(sqrt(9))
// console.log(radius(3, 4))
// console.log(angle(3, 4))
// sideToAngle(4, 4)
console.log(getAngle(0, 100, 0, 0))
console.log(getAngle(0, 100, 50, 80))
console.log(getAngle(0, 100, 100, 100))
console.log(getAngle(0, 100, 50, 120))
console.log(getAngle(0, 100, 0, 200))
console.log(getAngle(100, 100, 50, 120))
console.log(getAngle(100, 100, 0, 100))
console.log(getAngle(100, 100, 50, 80))
console.log('\n')
console.log(getAngle(0, 100, 0, 0, true))
console.log(getAngle(0, 100, 50, 80, true))
console.log(getAngle(0, 100, 100, 100, true))
console.log(getAngle(0, 100, 50, 120, true))
console.log(getAngle(0, 100, 0, 200, true))
console.log(getAngle(100, 100, 50, 120, true))
console.log(getAngle(100, 100, 0, 100, true))
console.log(getAngle(100, 100, 50, 80, true))