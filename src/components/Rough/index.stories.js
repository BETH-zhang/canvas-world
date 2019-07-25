import React from 'react';
import { storiesOf } from '@storybook/react'

import Component from './index'

storiesOf('Rough|Api', module)
  .add('测试', () => <Component data={[
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
  ]} />)
