import React from 'react';
import { storiesOf } from '@storybook/react'
import { random } from '../../utils/helper'

import Component from './index'

storiesOf('Rough|Demo', module)
  .add('测试', () => <Component data={[
    ['rectangle'],
    ['rectangle', [10, 0, 50, 50]],
    {
      type: 'rectangle',
      options: [10, 60, 50, 50],
    },
    {
      render: (rc) => {
        rc.rectangle(10, 120, 50, 50) 
      },
    },
  ]} />)
  .add('默认状态', () => <Component data={[
    ['rectangle', [10, 10, 200, 200]],
    ['circle', [80, 120, 50]],
    ['ellipse', [300, 100, 150, 80]],
    ['line', [80, 120, 300, 100]]
  ]} />)
  .add('Svg', () => <Component showDemo type="svg" />)
  .add('Fill', () => <Component autoSort sortCount data={[
    ['circle', [50, 50, 50, { fill: 'red' }]],
    ['rectangle', [120, 15, 50, 50, { fill: 'red' }]],
    ['rectangle', [50, 150, 50, 50, {
      fill: 'rgb(10, 150, 80)',
      fillWeight: 3,
    }]],
    ['rectangle', [220, 15, 50, 50, {
      fill: 'red',
      hachureAngle: 60, // angle of hachure,
      hachureGap: 8
    }]],
    ['rectangle', [120, 105, 50, 50, {
      fill: 'rgba(255,0,200,0.2)',
      fillStyle: 'solid' // solid fill
    }]],
    ['rectangle', [0, 0, 50, 50]],
    ['rectangle', [0, 0, 50, 50, { fill: '#f89587', fillStyle: 'solid' }]],
    ['circle', { fill: '#8986ff', fillWeight: 3 }],
    ['circle'],
    ['rectangle'],
  ]} />)

storiesOf('Rough|Api', module)
  .add('line', () => <Component autoSort sortCount data={[
    ['line'],
    ['line', { strokeWidth: 5 }],
  ]} />)
  .add('rectangle', () => <Component autoSort data={[
    ['rectangle'],
    ['rectangle', { fill: 'red' }],
  ]} />)
  .add('ellipse', () => <Component autoSort data={[
    ['ellipse'],
    ['ellipse', [300, 100, 150, 50, { fill: 'red' }]],
    ['ellipse', { fill: 'red' }]
  ]} />)
  .add('circle', () => <Component autoSort data={[
    ['circle'],
  ]} />)
  .add('linearPath-x', () => <Component autoSort data={[
    ['linearPath', (rc) => { rc.linearPath([[110, 10], [190, 20], [150, 120], [190, 100]]) }],
  ]} />)
  .add('polygon', () => <Component autoSort data={[
    ['polygon'],
    ['polygon', (rc) => { rc.linearPath([[110, 130], [190, 140], [150, 240], [190, 220]]) }]
  ]} />)
  .add('arc', () => <Component data={[
    [(rc) => { rc.arc(350, 300, 200, 180, Math.PI, Math.PI * 1.6, true) }],
    ['arc'],
    ['arc', { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)' }],
    ['arc', { stroke: 'red', strokeWidth: 4, fill: 'rgba(255,255,0,0.4)', fillStyle: 'solid' }],
  ]} />)
  .add('curve', () => <Component data={[
    [(rc) => {
      let points = [];
      for (let i = 0; i < 20; i++) {
        let x = (400 / 20) * i + 10;
        let xdeg = (Math.PI / 100) * x;
        let y = Math.round(Math.sin(xdeg) * 90) + 500;
        points.push([x, y]);
      }
      console.log(points)
      rc.curve(points, {
        stroke: 'red', strokeWidth: 3
      })
    }],
    ['curve']
  ]} />)
  .add('path', () => <Component data={[
    [(rc) => {
      rc.path('M37,17v15H14V17z M50,0H0v50h50z')
      rc.path('M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z', { fill: 'green' })
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    }]
  ]} />)
  .add('draw', () => <Component data={[
    [(rc) => {
      const generator = rc.generator
      const rect1 = generator.rectangle(10, 10, 100, 100)
      const rect2 = generator.rectangle(10, 120, 100, 100)
      // 定义 symbol 原子级别的图形
      rc.draw(rect1)
      rc.draw(rect2)
      const paths = generator.toPaths(rect1)
      console.log('paths', paths)
    }]
  ]} />)
  
  storiesOf('Rough|Options', module)
    .add('roughness', () => <Component autoSort data={[
      ['circle'],
      ['circle', { roughness: 0 }],
      ['circle', { roughness: 2.8 }],
      ['circle', { roughness: 6 }],
      ['circle', { roughness: 25 }]
    ]} />)
    .add('bowing', () => <Component autoSort data={[
      ['rectangle'],
      ['rectangle', { bowing: 1 }],
      ['rectangle', { bowing: 2 }],
      ['rectangle', { bowing: 6 }],
      ['rectangle', { bowing: 25 }]
    ]} />)
    .add('stroke', () => <Component autoSort data={[
      ['circle'],
      ['circle', { stroke: 'red' }],
      ['circle', { stroke: '#cc00cc' }],
      ['circle', { stroke: 'rgb(0, 350, 50)' }]
    ]} />)
    .add('strokeWidth', () => <Component autoSort data={[
      ['circle'],
      ['circle', { strokeWidth: 1 }],
      ['circle', { strokeWidth: 2 }],
      ['circle', { strokeWidth: 3 }],
      ['circle', { strokeWidth: 4 }],
      ['circle', { strokeWidth: 5 }],
    ]} />)
    .add('fill', () => <Component autoSort data={[
      ['circle'],
      ['circle', { fill: 'red' }],
      ['circle', { fill: '#cc00cc' }],
      ['circle', { fill: 'rgb(0, 350, 50)' }]
    ]} />)
    .add('fillStyle', () => <Component autoSort sortCount={5} autoHeight={100} data={[
      ['circle'],
      ['circle', { fill: '#cc00cc', fillStyle: 'solid' }],
      ['circle', { fill: 'rgb(0, 350, 50)', fillStyle: 'zigzag', hachureGap: 10, fillWeight: 3 }],
      ['circle', { fill: 'red', fillStyle: 'cross-hatch' }],
      ['circle', { fill: 'red', fillStyle: 'dots', hachureGap: 10, fillWeight: 2 }],
      ['rectangle', { fill: 'red', fillStyle: 'sunburst', hachureGap: 10, fillWeight: 5, hachureAngle: 60 }],
      ['rectangle', { fill: 'red', fillStyle: 'hachure', hachureAngle: 30, hachureGap: 10, fillWeight: 5 }],
      ['rectangle', { fill: 'red', fillStyle: 'cross-hatch', hachureGap: 10, fillWeight: 3 }],
      ['rectangle', { fill: 'red', fillStyle: 'cross-hatch', hachureGap: 10, fillWeight: 1, hachureAngle: 0 }],
      ['rectangle', { fill: 'red', fillStyle: 'dots', hachureGap: 10, fillWeight: 2 }],
      ['rectangle', { fill: 'red', fillStyle: 'hachure' }],
      ['circle', { fill: 'red', fillStyle: 'hachure' }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', hachureAngle: -30, dashOffset: 10, dashGap: 5 }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', hachureAngle: -30, dashOffset: 10, dashGap: 5, hachureAngle: 90, hachureGap: 10 }],
      ['circle', { fill: 'red', fillStyle: 'dashed', hachureAngle: -30, dashOffset: 5, dashGap: 3 }],
      ['rectangle', { fill: 'red', fillStyle: 'zigzag-line', hachureAngle: 0, fillWeight: 3, hachureGap: 5 }],
      ['rectangle', { fill: 'red', fillStyle: 'zigzag-line', hachureAngle: -45, fillWeight: 1, hachureGap: 8 }],
      ['circle', { fill: 'red', fillStyle: 'zigzag-line', hachureAngle: -45, fillWeight: 1, hachureGap: 5 }],
      ['rectangle', { fill: 'red', fillStyle: 'dots', hachureGap: 5, fillWeight: 1 }],
    ]} />)
    .add('fillWeight', () => <Component autoSort data={[
      ['circle'],
      ['circle', { fill: 'red', fillStyle: 'zigzag-line', fillWeight: 1 }],
      ['circle', { fill: 'red', fillStyle: 'zigzag-line', fillWeight: 2 }],
      ['circle', { fill: 'red', fillStyle: 'zigzag-line', fillWeight: 3 }],
      ['circle', { fill: 'red', fillStyle: 'zigzag-line', fillWeight: 4 }],
      ['circle', { fill: 'red', fillStyle: 'zigzag-line', fillWeight: 5 }],
    ]} />)
    .add('hachureAngle', () => <Component autoSort data={[
      ['circle', { fill: 'red' }],
      ['circle', { fill: 'red', hachureAngle: -41 }],
      ['circle', { fill: 'red', hachureAngle: random(0, 90) }],
      ['circle', { fill: 'red', hachureAngle: random(90, 180) }],
      ['circle', { fill: 'red', hachureAngle: random(180, 270) }],
      ['circle', { fill: 'red', hachureAngle: random(270, 360) }],
    ]} />)
    .add('hachureGap', () => <Component autoSort data={[
      ['circle', { fill: 'red', hachureAngle: 90 }],
      ['circle', { fill: 'red', hachureAngle: 90, hachureGap: 4 }],
      ['circle', { fill: 'red', hachureAngle: random(0, 90), hachureGap: random(0, 25) }],
      ['circle', { fill: 'red', hachureAngle: random(90, 180), hachureGap: random(0, 25) }],
      ['circle', { fill: 'red', hachureAngle: random(180, 270), hachureGap: random(0, 25) }],
      ['circle', { fill: 'red', hachureAngle: random(270, 360), hachureGap: random(0, 25) }],
    ]} />)
    .add('curveStepCount', () => <Component autoSort data={[
      ['circle', { fill: 'red', hachureAngle: 90 }],
      ['circle', { fill: 'red', hachureAngle: 90, curveStepCount: 9 }],
      ['circle', { fill: 'red', hachureAngle: 90, curveStepCount: 1 }],
      ['circle', { fill: 'red', hachureAngle: 90, curveStepCount: 4 }],
      ['circle', { fill: 'red', hachureAngle: 90, curveStepCount: 20 }],
      ['circle', { fill: 'red', hachureAngle: 90, curveStepCount: 50 }],
    ]} />)
    .add('simplification-?', () => <Component autoSort data={[
      ['circle', [0, 0, 100, 100]],
      ['circle', [0, 0, 100, 100, { simplification: 0 }]],
      ['circle', [0, 0, 100, 100, { simplification: 0.5 }]],
      ['circle', [0, 0, 100, 100, { simplification: 1 }]],
      ['circle', [0, 0, 100, 100, { simplification: 5 }]],
      ['circle', [0, 0, 100, 100, { simplification: 20 }]],
      ['circle', [0, 0, 100, 100, { simplification: 0.1 }]],
    ]} />)
    .add('dashOffset', () => <Component autoSort autoHeight={100} data={[
      ['circle', { fill: 'red', fillStyle: 'dashed' }],
      ['circle', { fill: 'red', fillStyle: 'dashed', dashOffset: 4 }],
      ['circle', { fill: 'red', fillStyle: 'dashed', dashOffset: 10 }],
      ['circle', { fill: 'red', fillStyle: 'dashed', dashOffset: 25 }],
      ['circle', { fill: 'red', fillStyle: 'dashed', dashOffset: 50 }],
    ]} />)
    .add('dashGap', () => <Component autoSort autoHeight={100} data={[
      ['rectangle', { fill: 'red', fillStyle: 'dashed' }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', dashGap: 0 }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', dashGap: 5 }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', dashGap: 10 }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', dashGap: 25 }],
      ['rectangle', { fill: 'red', fillStyle: 'dashed', dashGap: 50 }],
    ]} />)
    .add('zigzagOffset', () => <Component autoSort autoHeight={100} data={[
      ['ellipse', { fill: 'red', fillStyle: 'zigzag-line' }],
      // zigzagOffset 这个属性，同时状态下只能使用一次 
      ['ellipse', { fill: 'red', fillStyle: 'zigzag', zigzagOffset: 50 }]
      // ['ellipse', { fill: 'red', fillStyle: 'zigzag', zigzagOffset: 10 }],
      // ['ellipse', { fill: 'red', fillStyle: 'zigzag-line', zigzagOffset: 25 }],
      // ['ellipse', { fill: 'red', fillStyle: 'zigzag-line', zigzagOffset: 50 }],
      // ['ellipse', { fill: 'red', fillStyle: 'zigzag-line' }],
    ]} />)

  storiesOf('Rough|async', module)
    .add('async', () => <Component async sortCount={10} autoSort data={Array(100).fill(0).map(() => (['rectangle', { fill: 'red', fillStyle: 'dashed', dashGap: 10 }]))} />)