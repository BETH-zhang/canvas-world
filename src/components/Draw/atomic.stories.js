import React from 'react';
import { storiesOf } from '@storybook/react'
import Component from './index'

storiesOf('Atomic|Demo', module)
  .add('ball', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(100, 100, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    ball.draw()
  }} />)
  .add('smile', () => <Component render={(ctx, uc, canvas) => {
    var smile = uc.atomic.smile(100, 100, 75, { stroke: 'red', strokeWidth: 1 }) 
    smile.draw()
  }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
