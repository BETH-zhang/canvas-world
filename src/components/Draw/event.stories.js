import React from 'react';
import { storiesOf } from '@storybook/react'
import { addEvent } from 'us-common-utils'
import Component from './index'
import tools from '../../utils/elves/tools'
import Arrow from '../../utils/elves/arrow'
import Ball from '../../utils/elves/ball'

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
      var borderDirection = tools.checkBorder(ball, canvas)
      switch (borderDirection) {
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
      var borderDirection = tools.checkBorder(ball, canvas)
      switch (borderDirection) {
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
        var borderDirection = tools.checkBorder(ball, canvas)
        switch (borderDirection) {
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
  .add('两个球', () => <Component render={(ctx, uc, canvas) => {
    // 外接矩形判定法
    // 外接圆判定发
  }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)

