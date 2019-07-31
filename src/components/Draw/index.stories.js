import React, { createElement } from 'react';
import { storiesOf } from '@storybook/react'
import Component from './index'
import WbUtils from '../../utils/whiteboard'
import Draw from '../../utils/draw';

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
  .add('各种图形绘制', () => <Component data={[
    // ['rectangle', [10, 100, 50, 50, { fill: 'red' }]],
    // ['rectangle', [10, 0, 50, 50, { stroke: 'red', strokeWidth: 5 }]],
    // ['line', [80, 120, 300, 100, { strokeWidth: 10 }]],
    // ['linearPath', [[[110, 10], [190, 20], [150, 120], [190, 100]], { strokeWidth: 1 }]],
    // ['polygon', [[[110, 130], [190, 140], [150, 240], [190, 220]]]],
    // ['arc', [100, 100, 200, 200, { stroke: 'blue', strokeWidth: 2, fill: 'red' }]],
    ['ellipse', [300, 100, 150, 50, { fill: 'red' }]],
    // ['curve', (uc) => { uc.curve([[110, 130], [190, 140], [150, 240], [190, 220]], { stroke: 'red', strokeWidth: 3 }) }]
  ]} />)
