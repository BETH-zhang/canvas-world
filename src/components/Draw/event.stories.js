import React from 'react';
import { storiesOf } from '@storybook/react'
import { addEvent, removeEvent } from 'us-common-utils'
import { message } from 'antd';
import Component from './index'
import tools from '../../utils/elves/tools'
import Arrow from '../../utils/elves/arrow'
import Ball from '../../utils/elves/ball'
import Box from '../../utils/elves/box'

storiesOf('Move|事件系统', module)
  .add('鼠标事件', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(100, 100, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    ball.draw()

    const mouse = tools.getMouse(canvas)
    addEvent(window, 'mousemove', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.x = mouse.x
      ball.y = mouse.y
      ball.draw()
    })
  }} />)
  .add('键盘事件', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(100, 100, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    ball.draw()

    const key = tools.getKey()
    let x = 100
    let y = 100
    addEvent(window, 'keydown', () => {
      switch (key.direction) {
        case 'up':
          y -= 5
          break
        case 'down':
          y += 5
          break
        case 'left':
          x -= 5
          break
        case 'right':
          x += 5
          break
        default:
          break;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.x = x
      ball.y = y
      ball.draw()
    }) 
  }} />)
storiesOf('Move|三角函数', module)
  .add('三角函数', () => <Component render={(ctx, uc, canvas) => {
    ctx.font = "40px serif";
    // 反正切函数
    ctx.fillText("Math.atan2(1, 2)对应角度为：" + Math.atan2(1, 2) * 180 / Math.PI, 10, 50);
    ctx.fillText("Math.atan2(-1, -2)对应角度为：" + Math.atan2(-1, -2) * 180 / Math.PI, 10, 100);
    ctx.fillText("Math.atan2(-1, 2)对应角度为：" + Math.atan2(-1, 2) * 180 / Math.PI, 10, 150);
    ctx.fillText("Math.atan2(1, -2)对应角度为：" + Math.atan2(1, -2) * 180 / Math.PI, 10, 200);
  }} />)
  .add('追随鼠标旋转', () => <Component render={(ctx, uc, canvas) => {
    var arrow = new Arrow(canvas.width / 2, canvas.height / 2)
    var mouse = tools.getMouse(canvas)

    console.log('arrow: ', arrow, arrow.fill)
    arrow.fill(ctx)
    function drawFrame() {
      window.requestAnimationFrame(drawFrame)

      uc.clear()
      ctx.font = "40px serif";
      const dx = mouse.x - canvas.width / 2
      const dy = mouse.y - canvas.height / 2
      ctx.fillText(`Math.atan2(${dy}, ${dx})对应角度为：` + Math.atan2(dy,  dx) * 180 / Math.PI, 10, 50);
      ctx.fillText(`鼠标与中心点的距离：${Math.sqrt(dx * dx + dy * dy)}`, 10, 100);

      arrow.angle = Math.atan2(dy, dx) 
      arrow.fill(ctx)
    }

    drawFrame()
  }} />)
  .add('正圆运动', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(100, 25)
    var radius = 50
    var angle = 0
    var centerX = canvas.width / 2
    var centerY = canvas.height / 2
    ball.fill(ctx)

    function drawFrame() {
      window.requestAnimationFrame(drawFrame)

      uc.clear()
      ctx.beginPath()
      ctx.arc(centerX, centerY, 50, 0, 360 * Math.PI / 180, false)
      ctx.closePath()
      ctx.stroke()

      ball.x = centerX + Math.cos(angle) * radius
      ball.y = centerY + Math.sin(angle) * radius
      ctx.font = "40px serif";
      ctx.fillText(`x: ${ball.x}`, 10, 50);
      ctx.fillText(`y: ${ball.y}`, 10, 100)
      ball.fill(ctx)

      angle += 0.05
    }

    drawFrame()
  }} />)
  .add('椭圆运动', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(100, 25)
    var radiusX = 60
    var radiusY = 40
    var angle = 0

    function drawFrame() {
      window.requestAnimationFrame(drawFrame)
      uc.clear()

      ball.x = canvas.width / 2 + Math.cos(angle) * radiusX
      ball.y = canvas.height / 2 + Math.sin(angle) * radiusY
      ctx.font = "40px serif";
      ctx.fillText(`x: ${ball.x}`, 10, 50);
      ctx.fillText(`y: ${ball.y}`, 10, 100)
      ball.fill(ctx)

      angle += 0.05
    }

    drawFrame()
  }} />)
  .add('波形运动-X轴', () => <Component render={(ctx, uc, canvas) => {
    /**
     * 作用于x轴坐标（水草在水中左右摇摆）
     * 作用于y轴坐标
     * 作用于缩放属性
     */
    var ball = new Ball(canvas.width / 2, canvas.height / 2)
    var angle = 0 // 角度（弧度制）
    var range = 80 // 振幅
    var speed = 0.05 // 角度改变的大小

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x = canvas.width / 2 + Math.sin(angle) * range
      ball.fill(ctx)

      angle += speed
    }
    frame()
  }} />)
  .add('波形运动-Y轴', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var angle = 0
    var range = 80
    var speed = 0.05

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      if (ball.x > 800) {
        ball.x = 0
      } else {
        ball.x += 1
      }
      ball.y = canvas.height / 2 + Math.sin(angle) * range
      ball.fill(ctx)

      angle += speed
    }
    frame()
  }} />)
  .add('波形运动-缩放', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(canvas.width / 2, canvas.height / 2)
    // 当正弦函数sin作用于物体的缩放属性（scaleX或scaleY）时，物体会不断放大然后缩小，从而产生一种脉冲动画的效果
    var rangle = 0.5
    var angle = 0

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.scaleX = 1 + Math.sin(angle) * rangle
      ball.scaleY = 1 + Math.sin(angle) * rangle
      ball.fill(ctx)

      angle += 0.05
    }
    frame()
  }} />)
storiesOf('Move|物理运动', module)
  .add('匀速运动-x轴', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var vx = 2

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.fill(ctx)
    }
    frame()
  }} />)
  .add('匀速运动-30度方向', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var speed = 2
    // 小球朝向30度的方向运动
    var vx = speed * Math.cos(30 * Math.PI / 180)
    var vy = speed * Math.sin(30 * Math.PI / 180)

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.y += vy
      ball.fill(ctx)
    }
    frame()
  }} />)
  .add('匀速运动-任意', () => <Component render={(ctx, uc, canvas) => {
    var arrow = new Arrow(canvas.width / 2, canvas.height / 2)
    var mouse = tools.getMouse(canvas)
    var speed = 1.5
    // 小球朝向30度的方向运动
    var angle = 0

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      var dx = mouse.x - canvas.width / 2
      var dy = mouse.y - canvas.height / 2
      angle = Math.atan2(dy, dx)

      var vx = speed * Math.cos(angle)
      var vy = speed * Math.sin(angle)
      arrow.x += vx
      arrow.y += vy

      arrow.angle = angle
      arrow.fill(ctx)
    }
    frame()
  }} />)
  .add('加速运动', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var vx = 0
    var ax = 0.2

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.fill(ctx)

      vx += ax
    }
    frame()
  }} />)
  .add('减速运动', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var vx = 12
    var ax = -0.2

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.fill(ctx)

      if (vx > 0) {
        vx += ax
      } else {
        // 如果这里不设置，会出现加速度引起的掉头运动
        vx = 0
      }
    }
    frame()
  }} />)
  .add('加速运动-30度方向', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, 0)
    var speed = 2
    // 小球朝向30度的方向运动
    var a = 0.2;
    var ax = a * Math.cos(30 * Math.PI / 180)
    var ay = a * Math.sin(30 * Math.PI / 180)
    var vx = 0
    var vy = 0

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.y += vy
      ball.fill(ctx)

      vx += ax
      vy += ay
    }
    frame()
  }} />)
  .add('重力', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var vx = 4
    var vy = -5
    var gravity = 0.2 // 重力系数

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.y += vy

      ball.fill(ctx)

      // 变量递增
      vy += gravity
    }
    frame()
  }} />)
  .add('反弹力', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(0, canvas.height / 2)
    var vx = 4
    var vy = -5
    var gravity = 0.2 // 重力系数
    var bounce = -0.8 // 反弹系数（-1.0 ～ 0）反弹之后，速度只会变小，不会变大

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.x += vx
      ball.y += vy

      // 边界检测
      if (ball.y > canvas.height - ball.radius) {
        ball.y = canvas.height - ball.radius
        // 速度反向并且减小
        vy = vy * bounce
      }
      
      ball.fill(ctx)

      // 变量递增
      vy += gravity
    }
    frame()
  }} />)
  .add('摩擦力', () => <Component render={(ctx, uc, canvas) => {
    // 摩擦力只会将物体的速度将至0
    var ball = new Ball(0, canvas.height / 2)
    var vx = 8
    var friction = 0.95

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()
      ball.x += vx
      ball.fill(ctx)

      vx *= friction
    }
    frame()
  }} />)
  .add('摩擦力-30度方向', () => <Component render={(ctx, uc, canvas) => {
    // 摩擦力只会将物体的速度将至0
    var ball = new Ball(0, 0)
    var speed = 20
    var vx = speed * Math.cos(30 * Math.PI / 180)
    var vy = speed * Math.sin(30 * Math.PI / 180)
    var friction = 0.95

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()
      ball.x += vx
      ball.y += vy
      ball.fill(ctx)

      vx *= friction
      vy *= friction
    }
    frame()
  }} />)
storiesOf('Move|边界检测', module)
  .add('边界限制', () => <Component style={{ width: 400, height: 400 }} render={(ctx, uc, canvas) => {
    // 碰到
    var ball = new Ball(canvas.width / 2, canvas.height / 2) 
    ball.fill(ctx)
    var key = tools.getKey()
    var checkBorder = () => {
      var borderDirections = tools.checkBorder(ball, canvas)
      switch (borderDirections[0]) {
        case 'top':
          ball.y = ball.radius
          break
        case 'down':
          ball.y = canvas.height - ball.radius
          break
        case 'left':
          ball.x = ball.radius
          break
        case 'right':
          ball.x = canvas.width - ball.radius
          break
      }
    }

    addEvent(window, 'keydown', () => {
      uc.clear()
      switch(key.direction) {
        case 'up':
          ball.y -= 30
          checkBorder()
          ball.fill(ctx)
          break
        case 'down':
          ball.y += 30
          checkBorder()
          ball.fill(ctx)
          break
        case 'left':
          ball.x -= 30
          checkBorder()
          ball.fill(ctx)
          break
        case 'right':
          ball.x += 30
          checkBorder()
          ball.fill(ctx)
          break
      }
    })
  }} />)
  .add('边界环绕', () => <Component style={{ width: 400, height: 400 }} render={(ctx, uc, canvas) => {
    // 碰到
    var ball = new Ball(canvas.width / 2, canvas.height / 2) 
    ball.fill(ctx)
    var key = tools.getKey()
    var checkBorder = () => {
      var borderDirections = tools.checkBorder(ball, canvas)
      switch (borderDirections[0]) {
        case 'top':
          ball.y = canvas.height + ball.radius
          break
        case 'down':
          ball.y = -ball.radius
          break
        case 'left':
          ball.x = canvas.width + ball.radius
          break
        case 'right':
          ball.x = -ball.radius
          break
      }
    }

    addEvent(window, 'keydown', () => {
      uc.clear()
      switch(key.direction) {
        case 'up':
          ball.y -= 30
          checkBorder()
          ball.fill(ctx)
          break
        case 'down':
          ball.y += 30
          checkBorder()
          ball.fill(ctx)
          break
        case 'left':
          ball.x -= 30
          checkBorder()
          ball.fill(ctx)
          break
        case 'right':
          ball.x += 30
          checkBorder()
          ball.fill(ctx)
          break
      }
    })
  }} />)
  .add('多球运动', () => <Component render={(ctx, uc, canvas) => {
    var balls = []
    var n = 50
    Array(n).fill(0).forEach(() => {
      var ball = new Ball(canvas.width / 2, canvas.height / 2, 5, tools.getRandomColor())
      ball.vx = Math.random() * 2 - 1
      ball.vy = Math.random() * 2 - 1
      balls.push(ball)
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      balls.forEach((ball) => {
        var borderDirection = tools.checkAroundBorder(ball, canvas)
        if (borderDirection) {
          ball.x = canvas.width / 2
          ball.y = canvas.height / 2
          ball.vx = Math.random() * 2 - 1
          ball.vy = Math.random() * 2 - 1
        }
        ball.fill(ctx)

        ball.x += ball.vx
        ball.y += ball.vy
      })
    }
    frame()
  }} />)
  .add('多球运动-重力', () => <Component render={(ctx, uc, canvas) => {
    var balls = []
    var n = 50
    var gravity = 0.05

    Array(n).fill(0).forEach(() => {
      var ball = new Ball(canvas.width / 2, canvas.height / 2, 5, tools.getRandomColor())
      // ball.vx = Math.random() * 2 - 1
      ball.vx = 3
      ball.vy = (Math.random() * 2 - 1) * 3
      balls.push(ball)
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      balls.forEach((ball) => {
        var borderDirection = tools.checkAroundBorder(ball, canvas)
        if (borderDirection) {
          ball.x = canvas.width / 2
          ball.y = canvas.height / 2
          // ball.vx = Math.random() * 2 - 1
          // ball.vy = Math.random() * 2 - 1
          ball.vx = Math.random() + 3
          ball.vy = (Math.random() * 2 - 1) * 3
        }
        ball.fill(ctx)

        ball.x += ball.vx
        ball.y += ball.vy

        // 加入重力影响
        ball.vy += gravity
      })
    }
    frame()
  }} />)
  .add('边界反弹', () => <Component render={(ctx, uc, canvas) => {
    var balls = []
    var n = 50
    Array(n).fill(0).forEach(() => {
      var ball = new Ball(canvas.width / 2, canvas.height / 2, 20, tools.getRandomColor())
      ball.vx = tools.getRandomDeriction() * 2
      ball.vy = tools.getRandomDeriction() * 2
      balls.push(ball)
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      balls.forEach((ball) => {
        var borderDirections = tools.checkBorder(ball, canvas)
        switch (borderDirections[0]) {
          case 'top':
            ball.y = ball.radius
            ball.vy = -ball.vy
            break
          case 'down':
            ball.y = canvas.height - ball.radius
            ball.vy = -ball.vy
            break
          case 'left':
            ball.x = ball.radius
            ball.vx = -ball.vx
            break
          case 'right':
            ball.x = canvas.width - ball.radius
            ball.vx = -ball.vx
            break
        }
        ball.fill(ctx)

        ball.x += ball.vx
        ball.y += ball.vy
      })
    }
    frame()
  }} />)
storiesOf('Move|碰撞检测', module)
  .add('外接矩形判断法', () => <Component render={(ctx, uc, canvas) => {
    // 外接矩形判定法
    // 外接圆判定发
    var ballA = new Ball(canvas.width / 2, canvas.height / 2)
    var rectA = ballA.getRect()
    var mouse = tools.getClick(canvas)

    addEvent(canvas, 'click', () => {
      uc.clear()

      ballA.fill(ctx)
      ctx.strokeRect(rectA.x, rectA.y, rectA.width, rectA.height)

      var ballB = new Ball(mouse.x, mouse.y, 30)
      var rectB = ballB.getRect()
      ballB.fill(ctx)
      ctx.strokeRect(rectB.x, rectB.y, rectB.width, rectB.height)

      if (tools.checkRectBorder(rectA, rectB)) {
        message.info('撞上了')
      }
    })
    // var frame = () => {
    //   window.requestAnimationFrame(frame)
    //   uc.clear()

    //   ballA.fill(ctx)
    //   ctx.strokeRect(rectA.x, rectA.y, rectA.width, rectA.height)

    //   var ballB = new Ball(mouse.x, mouse.y, 30)
    //   var rectB = ballB.getRect()
    //   ballB.fill(ctx)
    //   ctx.strokeRect(rectB.x, rectB.y, rectB.width, rectB.height)

    //   message.info(tools.checkRectBorder(rectA, rectB))
    // }
    // frame()
  }} />)
  .add('简易俄罗斯方块', () => <Component style={{ width: 400, height: 400 }} render={(ctx, uc, canvas) => {
    var boxes = []
    var activeBox = createBox()
    var vy = 2

    function createBox() {
      var x = Math.random() * canvas.width
      var y = 0
      var width = Math.random() * 40 + 10
      var height = Math.random() * 40 + 10
      var color = tools.getRandomColor()
      var box = new Box(x, y, width, height, color)
      boxes.push(box)
      return box
    }

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      activeBox.y += vy
      if (activeBox.y > canvas.height - activeBox.height) {
        // 重置高度 
        activeBox.y = canvas.height - activeBox.height
        activeBox = createBox()
      }

      boxes.forEach(function(box, index) {
        if (activeBox !== box && tools.checkRectBorder(activeBox, box)) {
          // 重置高度  
          activeBox.y = box.y - activeBox.height
          activeBox = createBox()
        }
        box.fill(ctx)
      })
    }
    frame()
  }} />)
  .add('简易俄罗斯方块-键盘控制', () => <Component style={{ width: 400, height: 400 }} render={(ctx, uc, canvas) => {
    var boxes = []
    var activeBox = createBox()
    var vy = 2

    var key = tools.getKey()
    addEvent(window, 'keydown', () => {
      switch (key.direction) {
        case 'down':
          activeBox.y += 10
          break;
        case 'left':
          activeBox.x -= 10
          break
        case 'right':
          activeBox.x += 10
          break
      }
    })

    function createBox() {
      var x = Math.random() * canvas.width
      var y = 0
      var width = Math.random() * 40 + 10
      var height = Math.random() * 40 + 10
      var color = tools.getRandomColor()
      var box = new Box(x, y, width, height, color)
      boxes.push(box)
      return box
    }

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      activeBox.y += vy
      if (activeBox.y > canvas.height - activeBox.height) {
        // 重置高度 
        activeBox.y = canvas.height - activeBox.height
        activeBox = createBox()
      }

      boxes.forEach(function(box, index) {
        if (activeBox !== box && tools.checkRectBorder(activeBox, box)) {
          // 重置高度  
          activeBox.y = box.y - activeBox.height
          activeBox = createBox()
        }
        box.fill(ctx)
      })
    }
    frame()
  }} />)
  .add('外接圆判断法', () => <Component render={(ctx, uc, canvas) => {
    var ballA = new Ball(canvas.width / 2, canvas.height / 2)
    var mouse = tools.getClick(canvas)
    ballA.fill(ctx)

    addEvent(canvas, 'click', () => {
      uc.clear()

      var ballB = new Ball(mouse.x, mouse.y, 20, 'yellow')
      if (tools.checkCircleBorder(ballA, ballB)) {
        message.info('碰撞上')
      }

      ballA.fill(ctx)
      ballB.fill(ctx)
    })
  }} />)
  .add('小球碰撞反弹', () => <Component render={(ctx, uc, canvas) => {
    var ballA = new Ball(13, canvas.height / 2, 12, 'red')
    var ballB = new Ball(canvas.width - 13, canvas.height / 2, 12, 'blue')
    var vx = 10

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ballA.x += vx
      ballB.x += -vx

      if (tools.checkCircleBorder(ballA, ballB) || tools.checkBorder(ballA, canvas)) {
        vx = -vx
      }
      ballA.fill(ctx)
      ballB.fill(ctx)
    }
    frame()
  }} />)
  .add('多物体碰撞', () => <Component style={{ width: 400, height: 400 }} render={(ctx, uc, canvas) => {
    var n = 8
    var balls = []

    Array(n).fill(0).forEach(() => {
      var ball = new Ball()
      ball.x = Math.random() * canvas.width
      ball.y = Math.random() * canvas.height
      ball.radius = 30
      ball.color = tools.getRandomColor()
      ball.vx = Math.random() * 6 - 3
      ball.vy = Math.random() * 6 - 3
      balls.push(ball)
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      // 碰撞检测
      tools.checkManyObjectCircleBorder(balls, (ballA, ballB) => {
        ballA.vx = -ballA.vx
        ballA.vy = -ballA.vy
        ballB.vx = -ballB.vx
        ballB.vy = -ballB.vy

        if (ballA.vx > 0) {
          ballA.x += 15
        } else {
          ballA.x -= 15
        }

        if (ballA.vy > 0) {
          ballA.y += 15
        } else {
          ballA.y -= 15
        }

        if (ballB.vx > 0) {
          ballB.x += 15
        } else {
          ballB.x -= 15
        }

        if (ballB.vy > 0) {
          ballB.y += 15
        } else {
          ballB.y -= 15
        }
      })

      // 边界检测
      balls.forEach((ball) => {
        const borderDirection = tools.checkBorder(ball, canvas)
        ball.setPosition(borderDirection, canvas)
      }) 

      // 图形绘制
      balls.forEach((ball) => {
        ball.fill(ctx)
        ball.x += ball.vx
        ball.y += ball.vy
      })
    }
    frame()
  }} />)
storiesOf('Move|用户交互', module)
  .add('捕获物体', () => <Component render={(ctx, uc, canvas) => {
    /**
     * 矩形捕获
     * 圆捕获
     * 多边形捕获
     * 不规则图形的捕获（方法：分离轴定理（SAT）和最小平移向量（MTV））
     */
    var ball = new Ball(canvas.width / 2, canvas.height / 2, 30)
    ball.fill(ctx)
    var vx = 3
    var mouse = tools.getMouse(canvas)
    var isMouseDown = false
    addEvent(canvas, 'mousemove', () => {
      if (ball.checkMouse(mouse)) {
        // message.info('捕获到小球')
        isMouseDown = true
      } else {
        isMouseDown = false
      }
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      if (!isMouseDown) {
        ball.x += vx
      }

      ball.fill(ctx)
    }
    frame()
  }} />)
  .add('拖拽物体', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball(canvas.width / 2, canvas.height / 2, 20)
    ball.fill(ctx)
    var mouse = tools.getMouse(canvas)
    var dx = 0
    var dy = 0

    addEvent(canvas, 'mousedown', () => {
      if (ball.checkMouse(mouse)) {
        dx = mouse.x - ball.x
        dy = mouse.y - ball.y
        addEvent(document, 'mousemove', onMouseMove, false)
        addEvent(document, 'mouseup', onMouseUp, false)
      }
    })

    function onMouseMove() {
      ball.x = mouse.x - dx
      ball.y = mouse.y - dy

      // 边界检测
      const borderDirection = tools.checkBorder(ball, canvas)
      ball.setPosition(borderDirection, canvas)
    }

    function onMouseUp() {
      removeEvent(document, 'mouseup', onMouseUp, false)
      removeEvent(document, 'mousemove', onMouseMove, false)
    }

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      ball.fill(ctx)
    }
    frame()
  }} />)
  .add('抛掷物体', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball()
    ball.init(canvas)
    ball.fill(ctx)
    var mouse = tools.getMouse(canvas)
    var isMouseDown = false
    var dx = 0
    var dy = 0
    var oldX = 0
    var oldY = 0
    var vx = 0
    var vy = 0

    uc.tools.addMouseEvent((evt, cb) => {
      if (ball.checkMouse(mouse)) {
        cb()
        isMouseDown = true
        oldX = ball.x
        oldY = ball.y
        dx = mouse.x - ball.x
        dy = mouse.y - ball.y
      }
    }, () => {
      ball.x = mouse.x - dx
      ball.y = mouse.y - dy
    }, () => {
      isMouseDown = false
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      if (isMouseDown) {
        vx = ball.x - oldX
        vy = ball.y - oldY
      } else {
        ball.x += vx
        ball.y += vy

        // 有bug
        const borderDirections = tools.checkBorder(ball, canvas)
        ball.setPosition(borderDirections, canvas)
      }

      ball.fill(ctx)
    }
    frame()
    
  }} />)
  .add('抛掷物体-加入重力和反弹消耗', () => <Component render={(ctx, uc, canvas) => {
    var ball = new Ball()
    ball.init(canvas)
    ball.fill(ctx)
    var mouse = tools.getMouse(canvas)
    var isMouseDown = false
    var dx = 0
    var dy = 0
    var oldX = 0
    var oldY = 0
    var gravity = 1.5
    ball.vx = 0
    ball.vy = 0
    ball.bounce = -0.8

    uc.tools.addMouseEvent((evt, cb) => {
      if (ball.checkMouse(mouse)) {
        cb()
        isMouseDown = true
        oldX = ball.x
        oldY = ball.y
        dx = mouse.x - ball.x
        dy = mouse.y - ball.y
      }
    }, () => {
      ball.x = mouse.x - dx
      ball.y = mouse.y - dy
    }, () => {
      isMouseDown = false
    })

    var frame = () => {
      window.requestAnimationFrame(frame)
      uc.clear()

      if (isMouseDown) {
        ball.vx = ball.x - oldX
        ball.vy = ball.y - oldY
      } else {
        ball.vy += gravity
        ball.x += ball.vx
        ball.y += ball.vy

        // 有bug
        const borderDirections = tools.checkBorder(ball, canvas)
        ball.setPosition(borderDirections, canvas)
      }

      ball.fill(ctx)
    }
    frame()
    
  }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)

