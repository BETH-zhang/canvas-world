let start: number = 0
let lastTime: number = 0
let count: number = 0

function step (timestamp: number): void {
  if (!start) {
    start = timestamp
  }
  if (!lastTime) lastTime = timestamp
  let elapsedMsec: number = timestamp - start
  let intervalMsec: number = timestamp - lastTime
  count++
  console.log('  ' + count + ' timestamp = ' + timestamp)
  console.log('  ' + count + ' elapsedMsec = ' + elapsedMsec)
  console.log('  ' + count + ' intervalMsec = ' + intervalMsec)
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)