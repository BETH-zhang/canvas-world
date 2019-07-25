import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';

import readme from '../README.md'

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ), {
    notes: 'notesnotesnotes'
  })
  .add('with emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  )); 
  
storiesOf('基础教程', module)
  .add('Canvas概述', () => (<div />))
  .add('直线图形', () => (<div />))
  .add('曲线图形', () => (<div />))
  .add('线条操作', () => (<div />))
  .add('文本操作', () => (<div />))
  .add('图片操作', () => (<div />))
  .add('变形操作', () => (<div />))
  .add('像素操作', () => (<div />))
  .add('渐变与阴影', () => (<div />))
  .add('Canvas路径', () => (<div />))
  .add('Canvas状态', () => (<div />))
  .add('其他应用', () => (<div />))

storiesOf('进阶教程', module)
  .add('事件操作', () => (<div />))
  .add('物理动画', () => (<div />))
  .add('边界检测', () => (<div />))
  .add('碰撞检测', () => (<div />))
  .add('用户交互', () => (<div />))
  .add('高级动画', () => (<div />))
  .add('Canvas游戏开发', () => (<div />))
  .add('Canvas图表库', () => (<div />))