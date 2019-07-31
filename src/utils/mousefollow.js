
function Circle(ctx, x, y, radius, vx, vy, rgb, opacity, birth, life, R, rot) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.minRadius = radius;
  this.vx = vx;
  this.vy = vy;
  this.birth = birth;
  this.life = life;
  this.opacity = opacity;
  this.R = R
  this.rot = rot

  this.drawStar = () => {
    // 小圆半径为大圆的一半
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      // 循环5次，每次取2个点，总共取10个点
      ctx.lineTo(Math.cos((18 + i * 72 - this.rot) / 180 * Math.PI) * this.R + this.x, -Math.sin((18 + i * 72 - this.rot) / 180 * Math.PI) * this.R + this.y);
      ctx.lineTo(Math.cos((54 + i * 72 - this.rot) / 180 * Math.PI) * this.R * 0.5 + this.x, -Math.sin((54 + i * 72 - this.rot) / 180 * Math.PI) * this.R * 0.5 + this.y)
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${rgb},${this.opacity}`
    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(${rgb},${this.opacity}`

    ctx.fill();
    ctx.stroke();
  }

  this.draw = () => {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
    // ✨
    ctx.fillStyle = `rgba(${rgb},${this.opacity}`
    ctx.fill()
  }

  this.update = (innerWidth, innerHeight, circleArray, frame) => {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.vx = -this.vx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.vy = -this.vy;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.opacity = 1 - (((frame - this.birth) * 1) / this.life)

    if (frame > this.birth + this.life) {
      for (let i = 0; i < circleArray.length; i++) {
        if (this.birth === circleArray[i].birth && this.life === circleArray[i].life) {
          circleArray.splice(i, 1)
          break;
        }
      }
    } else {
      // this.draw()
      this.drawStar()
    }
  }
}

class Mousefollow {
  constructor(options) {
    this.options = options
    this.canvas = document.getElementById(this.options.id)
    this.canvas.width = options.width
    this.canvas.height = options.height
    this.context = this.canvas.getContext('2d')
    this.circleArray = []
    this.colorArray = [
      '251, 24, 8',
      '254, 239, 11',
      '48, 255, 7',
      '29, 229, 254',
      '0, 49, 255',
      '251, 0, 227',
    ]
    // '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3
  }

  initCanvas = () => {
    this.circleArray = [];
  }

  drawCircles = (x, y, frame) => {
    for (let i = 0; i < 6; i++) {
      const radius = Math.floor(Math.random() * 4) + 2;
      const vx = (Math.random() * 2) - 1;
      const vy = (Math.random() * 2) - 1;
      const rgb = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
      const life = 10;
      const R = Math.random() * 5 + 1
      const rot = Math.random() * 360;
      this.circleArray.push(new Circle(this.context, x, y, radius, vx, vy, rgb, 1, frame, life, R, rot))
    }
  }
}

export default Mousefollow
