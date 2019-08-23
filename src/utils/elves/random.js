const randomTools = {}

randomTools.getRandomColor = () => {
  // let color = '0123456789abcdef'
  // const randow = Math.floor(Math.random() * 16)
  // color.length === 6 ? color : arguments.callee(color)
  return `#${Math.random().toString(16).slice(-6)}`
}

randomTools.getRandomDeriction = () => {
  return Math.random() * 2 - 1 // -1 ~ 1
}


export default randomTools