const getComplementaryColor = (mainColor: string) => {
  // hsl + 180 旋转 180度
  // #3ac845 hex
  // 58 200 69 1 rgba
  // 125 56% 50% 1 hsla

  // h 125 + 180 = 305
  // s 56% - 8% = 48%
  return mainColor
}

const getBrightColor = (color: string) => {
  // s 56% + 42% = 98%
  // l 50% + 32% = 82%
  return color
}

const getDarkShadowColor = (color: string) => {
  // s 56% + 8% = 64%
  // l 50% - 36% = 13$
  return color
}

const getShadowColor = (color: string) => {
  if (Number(color.split(',')[0]) > 122) {
    // h 125 + 40
    // s dark-s - 4%
  } else {
    // h 125 - 40
    // s dark-s + 4%
  }
  return color
}

const getBalanceColor = () => {
  return '28, 25%, 85%, 1'
}

const smartColorPanel = (mainColor: string) => {
  const complementaryColor = getComplementaryColor(mainColor)
  return [
    mainColor,
    complementaryColor,
  ]
}