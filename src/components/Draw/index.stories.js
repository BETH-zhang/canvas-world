import React from 'react';
import { storiesOf } from '@storybook/react'
import Component from './index'
import WbUtils from '../../utils/whiteboard'
import { addTestImage } from '../../utils/helper'

storiesOf('Draw|Demo', module)
  .add('默认状态', () => <Component render={(ctx, canvas, uc) => {
    uc.ellipse(392.25, 159, 764.5, 164)
  }} />)
  .add('各种图形绘制', () => <Component autoSort data={[
    ['rectangle', [10, 10, 100, 40, { fill: 'red' }]],
    ['rectangle', [10, 0, 100, 40, { stroke: 'red', strokeWidth: 5 }]],
    ['line', [80, 120, 300, 100, { strokeWidth: 10 }]],
    ['linearPath', [[[110, 10], [190, 20], [150, 120], [190, 100]], { strokeWidth: 1 }]],
    ['polygon', [[[110, 130], [190, 140], [150, 240], [190, 220]]]],
    ['circle', [10, 10, 50, { stroke: 'blue', strokeWidth: 2, fill: 'red' }]],
    ['ellipse', [10, 10, 150, 50, { stroke: '#000' }]],
    [(rc) => { rc.arc(350, 100, 100, 80, Math.PI, Math.PI * 1.6, false); }],
    [(rc) => { rc.arc(450, 100, 100, 80, Math.PI, Math.PI * 1.6, true); }],
    [(rc) => { rc.arc(350, 200, 100, 80, -Math.PI * 2, -Math.PI / 2, true) }],
    ['arc', [350, 300, 100, 80, -Math.PI * 2, -Math.PI / 2, true, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)' }]],
    ['arc', [350, 400, 100, 80, -Math.PI * 2, -Math.PI / 2, true, { stroke: 'red', strokeWidth: 4, fill: 'rgba(255,255,0,0.4)', fillStyle: 'solid' }]],
  ]} />)
  .add('圈记1', () => <Component render={(ctx, canvas, uc) => {
    addTestImage(ctx).then(({x, y, w, h}) => {
      uc.ellipse(x, y, w, h, { stroke: 'red', strokeWidth: 1 })
    })
  }} />)
  .add('圈记2', () => <Component render={(ctx, canvas, uc) => {
    addTestImage(ctx).then(({ x, y, w, h }) => {
      uc.ellipse(x, y, w, h, { stroke: 'red', strokeWidth: 1 })
      uc.line(x - w / 2 - 10, y, x + w / 2 + 10, y, { stroke: 'red', strokeWidth: 1 })
    })
  }} />)
  .add('圈记3', () => <Component render={(ctx, canvas, uc) => {
    addTestImage(ctx).then(({ x, y, w, h, textA, textWhen, line }) => {
      uc.polygon(textA, { roughness: 2 })
      uc.polygon(textWhen, { roughness: 2 })
      uc.line(...line, { roughness: 3 })
    })
  }} />)

storiesOf('Draw|Picture', module)
  .add('画板1', () => <Component render={(ctx) => {
    if (document.getElementById('canvasFollow')) {
      document.body.removeChild(document.getElementById('canvasFollow'))
    }
    new WbUtils({
      allowMousefollow: false,
      allowDraw: true,
      id: 'canvas',
      color: '#f39e29',
      width: 800,
      height: 800,
      disabled: false,
      onDrawDown: () => {},
      onDrawUp: () => {},
      postUpload: () => ({}),
    })
    // 创建新 image 对象，用作图案
    var img = new Image();
    img.src = 'http://localhost:8080/test1.jpeg';
    img.onload = function() {
      const width = img.width
      const height = img.height
      console.log(width, height)
      ctx.drawImage(img, 0, 0, 800, 800 * height / width)
    }
  }} />)
  .add('画板2', () => <Component render={(ctx) => {
    if (!document.getElementById('canvasFollow')) {
      const canvasEle = document.createElement('canvas')
      canvasEle.id = `canvasFollow`
      canvasEle.width = 800
      canvasEle.height = 800
      canvasEle.style.position = 'absolute'
      canvasEle.style.top = 0
      canvasEle.style.left = 0
      document.body.append(canvasEle)
    }
    new WbUtils({
      allowMousefollow: true,
      allowDraw: true,
      id: 'canvas',
      color: false,
      width: 800,
      height: 800,
      disabled: false,
      onDrawDown: () => {},
      onDrawUp: () => {},
      postUpload: () => ({}),
    })
  }} />)
