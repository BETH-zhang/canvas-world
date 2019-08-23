import React from 'react';
import { storiesOf } from '@storybook/react'
import Component from './index'

storiesOf('Atomic|Demo', module)
  .add('ball', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(100, 100, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    ball.draw()
  }} />)
  .add('smile', () => <Component render={(ctx, uc, canvas) => {
    var smile = uc.atomic.smile(150, 150, 200, { stroke: 'red', strokeWidth: 10 }) 
    smile.draw()
  }} />)
  .add('cube', () => <Component render={(ctx, uc, canvas) => {
    var cube = uc.atomic.cube(50, 50)
    cube.draw()
    uc.tools.addMouseEvent((evt) => {
      cube.mousedown = true
      cube.mx = evt.clientX
      cube.my = evt.clientY
    }, (evt) => {
      if (cube.mousedown) {
        var theta = (evt.clientX - cube.mx) * Math.PI / 360;
        var phi = (evt.clientY - cube.my) * Math.PI / 180;
        cube.instance.rotate2(theta, phi);
        cube.mx = evt.clientX;
        cube.my = evt.clientY;
        cube.instance.render(ctx, cube.x, cube.y);
      }
    }, () => {
      cube.mousedown = false
    })
  }} />, {
    notes: '这里涉及到旋转矩阵的知识<br /> http://www.mamicode.com/info-detail-2278290.html'
  })
  .add('anchor', () => <Component render={(ctx, uc, canvas) => {
    var anchor = uc.atomic.anchor(100, 100, { fill: 'red' }, { scale: 5 } )
    anchor.draw()
    var anchor = uc.atomic.anchor(100, 50, { stroke: 'red' }, { scale: 2 } )
    anchor.draw()
  }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)

