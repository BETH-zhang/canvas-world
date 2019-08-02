import React from 'react';
import { storiesOf } from '@storybook/react'
import Component from './index'
import Zdog from '../../../node_modules/zdog/js/index'

storiesOf('Zdog|Demo', module)
  .add('hello world', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
    let isSpinning = true;

    let illo = new Zdog.Illustration({
      element: '#canvas',
      dragRotate: true,
      // stop spinning when drag starts
      onDragStart: function() {
        isSpinning = false;
      },
    });
    
    // circle
    new Zdog.Ellipse({
      addTo: illo,
      diameter: 80,
      translate: { z: 40 },
      stroke: 20,
      color: '#636',
    });
    
    // square
    new Zdog.Rect({
      addTo: illo,
      width: 80,
      height: 80,
      translate: { z: -40 },
      stroke: 12,
      color: '#E62',
      fill: true,
    });
    
    function animate() {
      illo.rotate.y += isSpinning ? 0.03 : 0;
      illo.updateRenderGraph();
      requestAnimationFrame( animate );
    }
    animate();
  }} />)
  .add('add circle', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
    let illo = new Zdog.Illustration({ element: '#canvas' })
    new Zdog.Ellipse({
      addTo: illo,
      diameter: 80,
      stroke: 20,
      color: '#636'
    })
    illo.updateRenderGraph()
  }} />)
  .add('Animating', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
    let illo = new Zdog.Illustration({ element: '#canvas' })
    new Zdog.Ellipse({
      addTo: illo,
      diameter: 80,
      stroke: 20,
      color: '#636'
    })
    
    function animate() {
      illo.rotate.y += 0.03;
      illo.updateRenderGraph();

      requestAnimationFrame(animate)
    }
    animate()
  }} />)
  // .add('', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component style={{ width: 300, height: 300 }} render={(ctx, uc, canvas) => {
  // }} />)

