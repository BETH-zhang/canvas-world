// start 记录的是第一次调用step函数的时间点，用于计算与第一次调用step函数的时间差，以毫秒为单位
let start:number = 0
// lastTime 记录的是上一次调用step函数的时间点，用于计算两帧之间的时间差，以毫秒为单位
let lastTime:number = 0
// count 用于记录step函数运行的次数
let count:number = 0
// step 函数用于计算
/**
 * 1.获取当前时间点与HTML程序启动时的时间差 timestamp
 * 2.获取当前时间点与第一次调用step时的时间差 elapsedMsec
 * 3.获取当前时间点与上一次调用step时的时间差 intervalMsec
 * step 函数是作为 requestAnimationFrame 方法的回调函数使用的
 */
// 因此step函数的签名必须是 (timestamp: number) => void
function step(timestamp: number): void {
  // 第一次调用本函数时，设置 start 和lastTime 为timestamp
  if (!start) start = timestamp
  if (!lastTime) lastTime = timestamp
  // 计算当前时间点与第一次调用step时间点的差
  let elapsedMsec: number = timestamp - start
  // 计算当前时间点与上一次调用step时间点的差（可以理解为两帧之间的时间差）
  let intervalMsec: number = timestamp - lastTime
  // 计数器，用于记录 step 函数被调用的次数
  count++
  console.log('  ' + count + ' timestamp = ' + timestamp)
  console.log('  ' + count + ' elapsedMsec = ' + elapsedMsec)
  console.log('  ' + count + ' intervalMsec = ' + intervalMsec)
  // 使用 requestAnimationFrame 调用 step 函数
  window.requestAnimationFrame(step)
}
// 使用requestAnimationFrame 启动step
window.requestAnimationFrame(step)