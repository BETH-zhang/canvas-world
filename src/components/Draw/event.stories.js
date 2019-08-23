import React from 'react';
import { storiesOf } from '@storybook/react'
import { addEvent } from 'us-common-utils'
import Component from './index'
import tools from '../../utils/elves/event'
import Arrow from '../../utils/elves/arrow'
import Ball from '../../utils/elves/ball'

storiesOf('0|Demo', module)
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
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)

