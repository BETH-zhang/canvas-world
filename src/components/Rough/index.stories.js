import React from 'react';
import { storiesOf } from '@storybook/react'

import Component from './index'

storiesOf('Rough|Api', module)
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
