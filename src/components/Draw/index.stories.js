import React from 'react';
import { storiesOf } from '@storybook/react'
import Component from './index'
import WbUtils from '../../utils/whiteboard'
import { addImageData, addTestImage, findFourPoint } from '../../utils/helper'

import defaultImg from '../../assets/mr.jpg'
import imageTestData from '../../assets/data'
import imageTestData1 from '../../assets/data1'
import imageTestData2 from '../../assets/data2'

storiesOf('Draw|Demo', module)
  .add('默认状态', () => <Component render={(ctx, uc, canvas) => {
    uc.ellipse(392.25, 159, 764.5, 164)
  }} />)
  .add('各种图形绘制', () => <Component autoSort data={[
    ['rectangle', [10, 10, 100, 40, { fill: 'red' }]],
    ['rectangle', [10, 0, 100, 40, { stroke: 'red', strokeWidth: 5 }]],
    ['line', [80, 120, 300, 100, { strokeWidth: 10 }]],
    // ['linearPath', [[[110, 10], [190, 20], [150, 120], [190, 100]], { strokeWidth: 1 }]],
    // ['polygon', [[[110, 130], [190, 140], [150, 240], [190, 220]]]],
    ['circle', [10, 10, 50, { stroke: 'blue', strokeWidth: 2, fill: 'red' }]],
    ['ellipse', [10, 10, 150, 50, { stroke: '#000' }]],
    // [(rc) => { rc.arc(350, 100, 100, 80, Math.PI, Math.PI * 1.6, false); }],
    // [(rc) => { rc.arc(450, 100, 100, 80, Math.PI, Math.PI * 1.6, true); }],
    // [(rc) => { rc.arc(350, 200, 100, 80, -Math.PI * 2, -Math.PI / 2, true) }],
    // ['arc', [350, 300, 100, 80, -Math.PI * 2, -Math.PI / 2, true, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)' }]],
    // ['arc', [350, 400, 100, 80, -Math.PI * 2, -Math.PI / 2, true, { stroke: 'red', strokeWidth: 4, fill: 'rgba(255,255,0,0.4)', fillStyle: 'solid' }]],
  ]} />)
  .add('圈记1', () => <Component render={(ctx, uc, canvas) => {
    addTestImage(ctx).then(({x, y, w, h}) => {
      uc.ellipse(x, y, w, h, { stroke: 'red', strokeWidth: 1 })
    })
  }} />)
  .add('圈记2', () => <Component render={(ctx, uc, canvas) => {
    addTestImage(ctx).then(({ x, y, w, h }) => {
      uc.ellipse(x, y, w, h, { stroke: 'red', strokeWidth: 1 })
      uc.line(x - w / 2 - 10, y, x + w / 2 + 10, y, { stroke: 'red', strokeWidth: 1 })
    })
  }} />)
  .add('圈记3', () => <Component render={(ctx, uc, canvas) => {
    addTestImage(ctx).then(({ x, y, w, h, textA, textWhen, line }) => {
      uc.polygon(textA)
      uc.polygon(textWhen)
      uc.line(...line)
    })
  }} />)
  .add('圈记4', () => <Component render={(ctx, uc, canvas) => {
    addTestImage(ctx).then(({ x, y, w, h, textA, textWhen, line, p }) => {
      uc.polygon(p, { fill: 'rgba(255, 0, 0, 0.3)', stroke: 'rgba(255, 0, 0, 1)' })
    })
  }} />)
  .add('圈记5', () => <Component render={(ctx, uc, canvas) => {
    addTestImage(ctx).then(({ x, y, w, h, textA, textWhen, line, p }) => {
      uc.curveTag(...line, { stroke: 'red', strokeWidth: 1 })
    })
  }} />)
  .add('标记1', () => <Component style={{ width: 800 }} render={(ctx, uc, canvas) => {
    addImageData(ctx, 800, imageTestData.img, imageTestData.data).then(({ params, notations }) => {
      const colors = ['#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3', '#FB001F', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3']
      notations.forEach((notation, index) => {
        const vertices = notation.vertices
        vertices.forEach((vertice) => {
          if (vertice && vertice.length) {
            uc.polygon(vertice, { fill: 'rgba(255, 0, 0, 0.3)' })
            uc.ellipse(notation.x, notation.y, notation.w, notation.h, { rotate: notation.angle, stroke: 'yellow' })
            uc.line(vertice[vertice.length - 1][0], vertice[vertice.length - 1][1] + 3, vertice[vertice.length / 2][0], vertice[vertice.length / 2][1] + 3, { stroke: colors[index] })
            vertice.forEach((point) => {
              uc.circle(...point, 5, { stroke: colors[index], fill: colors[index] }) 
            })
          }
        })
      })
    })
  }} />)
  .add('标记2', () => <Component style={{ width: 400 }} render={(ctx, uc, canvas) => {
    addImageData(ctx, 400, imageTestData1.img, imageTestData1.data).then(({ params, notations }) => {
      const colors = ['#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3', '#FB001F', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3']
      notations.forEach((notation, index) => {
        const vertices = notation.vertices
        vertices.forEach((vertice) => {
          if (vertice && vertice.length) {
            uc.polygon(vertice, { fill: 'rgba(255, 0, 0, 0.3)' })
            uc.ellipse(notation.x, notation.y, notation.w, notation.h, { rotate: notation.angle, stroke: 'yellow' })
            uc.line(vertice[vertice.length - 1][0], vertice[vertice.length - 1][1] + 3, vertice[vertice.length / 2][0], vertice[vertice.length / 2][1] + 3, { stroke: colors[index] })
            vertice.forEach((point) => {
              uc.circle(...point, 5, { stroke: colors[index], fill: colors[index] }) 
            })
          }
        })
      })
    })
  }} />)
  .add('标记3', () => <Component style={{ width: 800 }} render={(ctx, uc, canvas) => {
    addImageData(ctx, 800, imageTestData2.img, imageTestData2.data).then(({ params, notations }) => {
      const colors = ['#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3', '#FB001F', '#FB1808', '#FEEF0B', '#30FF07', '#1DE5FE', '#0031FF', '#FB00E3']
      notations.forEach((notation, index) => {
        const vertices = notation.vertices
        vertices.forEach((vertice) => {
          if (vertice && vertice.length) {
            uc.polygon(vertice, { fill: 'rgba(255, 0, 0, 0.3)' })
            uc.ellipse(notation.x, notation.y, notation.w, notation.h, { rotate: notation.angle, stroke: 'yellow' })
            uc.line(vertice[vertice.length - 1][0], vertice[vertice.length - 1][1] + 3, vertice[vertice.length / 2][0], vertice[vertice.length / 2][1] + 3, { stroke: colors[index] })
            vertice.forEach((point) => {
              uc.circle(...point, 5, { stroke: colors[index], fill: colors[index] }) 
            })
          }
        })
      })
    })
  }} />)

storiesOf('Draw|Picture', module)
  .add('画板1', () => <Component render={(ctx, uc, canvas, rc) => {
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
      onDrawUp: ({ arr }) => {
      },
      postUpload: () => ({}),
    })
    // 创建新 image 对象，用作图案
    var img = new Image();
    img.src = 'http://localhost:8080/test1.jpeg';
    img.onload = function() {
      const width = img.width
      const height = img.height
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
  .add('纠正画笔', () => <Component render={(ctx, uc, canvas, rc) => {
    let type = 'ellipse'
    let cc = 'uc'
    const sc = {
      uc,
      rc
    }
    if (document.getElementById('canvasFollow')) {
      document.body.removeChild(document.getElementById('canvasFollow'))
    }
    if (!document.getElementById('tools')) {
      const tools = document.createElement('div')
      tools.id = 'tools'
      document.body.append(tools)
      const ary = ['ellipse', 'rectangle', 'circle']
      const ary1 = ['uc', 'rc']
      ary.forEach((item) => {
        const tool = document.createElement('div')
        tool.innerHTML = item
        tool.onclick = () => {
          type = item
        }
        tools.append(tool)
      })
      ary1.forEach((item) => {
        const tool = document.createElement('div')
        tool.innerHTML = item
        tool.onclick = () => {
          cc = item
        }
        tools.append(tool)
      })
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
      onDrawUp: ({ arr }) => {
        const points = findFourPoint(arr, type)
        sc[cc][type](...points, { stroke: 'red', strokeWidth: 3, roughness: 3 })
      },
      postUpload: () => ({}),
    })
    // 创建新 image 对象，用作图案
    var img = new Image();
    img.src = 'http://localhost:8080/test1.jpeg';
    img.onload = function() {
      const width = img.width
      const height = img.height
      ctx.drawImage(img, 0, 0, 800, 800 * height / width)
    }
  }} />)

storiesOf('Draw|高级动画', module) 
  .add('绘制小球', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(100, 100, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    var raf = null
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.draw();
      // 修改小球
      ball.x += ball.vx;
      ball.y += ball.vy;
      raf = window.requestAnimationFrame(draw);
    }

    draw()

    // canvas.addEventListener('mouseover', function(e) {
    //   raf = window.requestAnimationFrame(draw)
    // })

    // canvas.addEventListener('mouseout', function(e) {
    //   window.cancelAnimationFrame(raf)
    // })
  }} />)
  .add('边界检测', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(100, 100, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.draw();

      // 修改小球
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 碰撞检测，修改速度方向
      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }
      window.requestAnimationFrame(draw);
    }
    draw()
  }} />)
  .add('加速度', () => <Component render={(ctx, uc, canvas) => {
    canvas.width = 300
    canvas.height = 300
    var ball = uc.atomic.ball(10, 10, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.draw();
      // 添加加速度，使运动轨迹更加真实
      ball.vx *= .99
      ball.vy += .25

      // 修改小球
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 碰撞检测，修改速度方向
      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }
      window.requestAnimationFrame(draw);
    }
    draw()
  }} />)
  .add('长尾效果', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(10, 10, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    function draw() {
      // 长尾效果
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ball.draw();
      // 添加加速度，使运动轨迹更加真实
      ball.vx *= .99
      ball.vy += .25

      // 修改小球
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 碰撞检测，修改速度方向
      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }
      window.requestAnimationFrame(draw);
    }
    draw()
  }} />)
  .add('鼠标控制', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(10, 10, 50, { fill: 'blue' }, { vx: 5, vy: 2 });
    uc.tools.draw(ball)
    uc.tools.longTailEffect(ball) 
    // https://developer.mozilla.org/en-US/docs/Games
    // 有时间研究
  }} />)


storiesOf('Draw|图像处理', module) 
  .add('像素操作', () => <Component render={(ctx, uc, canvas) => {
    var img = new Image();
    img.src = defaultImg;
    img.onload = function() {
      // 画图片
      ctx.drawImage(img, 0, 0, 300, 300);
      // 获取图片数据
      var myImageData = ctx.getImageData(0, 0, 100, 100);
      // 绘制图片数据
      ctx.putImageData(myImageData, 0, 200);
    };
    canvas.addEventListener('mousemove', uc.tools.drawPixelColor);
  }} />)
  .add('图片的灰度', () => <Component render={(ctx, uc, canvas) => {
    uc.image(0, 0, 300, 300, defaultImg)
    canvas.addEventListener('click', uc.filter.grayscale); 
  }} />)
  .add('反向颜色', () => <Component render={(ctx, uc, canvas) => {
    uc.image(0, 0, 300, 300, defaultImg)
    canvas.addEventListener('click', uc.filter.invert); 
  }} />)
  .add('缩放反锯齿', () => (<div>
    <Component render={(ctx, uc, canvas) => {
      uc.image(0, 0, 300, 300, defaultImg)
      var zoomctx = document.getElementById('zoom').getContext('2d');
 
      var smoothbtn = document.getElementById('smoothbtn');
      // 反锯齿，看不出来区别
      var toggleSmoothing = function(event) {
        zoomctx.imageSmoothingEnabled = this.checked;
        zoomctx.mozImageSmoothingEnabled = this.checked;
        zoomctx.webkitImageSmoothingEnabled = this.checked;
        zoomctx.msImageSmoothingEnabled = this.checked;
      };
      smoothbtn.addEventListener('change', toggleSmoothing);

      var zoom = function(event) {
        var x = event.layerX;
        var y = event.layerY;
        zoomctx.drawImage(canvas, Math.abs(x - 5), Math.abs(y - 5), 10, 10, 0, 0, 200, 200);
      };

      canvas.addEventListener('mousemove', zoom);
    }} />
    <canvas id="zoom" style={{ position: 'absolute', top: 300, left: 0 }} />
    <button id="smoothbtn" style={{ position: 'absolute', top: 300, left: 300 }}>smoothbtn</button>
  </div>))
  .add('保存图片', () => <Component render={(ctx, uc, canvas) => {
    uc.image(0, 0, 300, 300, defaultImg)
    // console.log(canvas.toDataURL('image/png'))
    // console.log(canvas.toDataURL('image/jpeg', 0.5))
    // console.log(canvas.toBlob())
  }} />)
  .add('图片翻转', () => <Component render={(ctx, uc, canvas) => {
    uc.image(0, 0, 300, 300, defaultImg)

    setTimeout(() => {
      const x1 = 0 + 300 / 2
  
      ctx.save();
      // ctx.translate(x1, 0)
      ctx.translate(2 * x1, 0)
      ctx.scale(-1, 1) // 沿y轴水平翻转对象  1，-1 沿x轴垂直翻转对象
      // ctx.translate(-x1, 0)
      uc.image(0, 0, 300, 300, defaultImg)
      // 恢复之前的状态，是后渲染的内容消失吗？
      // ctx.restore()
    }, 3000)
  }} />)

storiesOf('Draw|其他操作', module) 
  .add('内容兼容', () => <Component render={(ctx, uc, canvas) => {
  }}>
    <h2>Shapes</h2> 
    <p>A rectangle with a black border. 
    In the background is a pink circle. 
    Partially overlaying the <a href="http://en.wikipedia.org/wiki/Circle">circle</a>. 
    Partially overlaying the circle is a green 
    <a href="http://en.wikipedia.org/wiki/Square">square</a> 
    and a purple <a href="http://en.wikipedia.org/wiki/Triangle">triangle</a>,
    both of which are semi-opaque, so the full circle can be seen underneath.</p> 
  </Component>)
  .add('点击区域', () => <Component render={(ctx, uc, canvas) => {
    var ball = uc.atomic.ball(50, 50, 50, { fill: 'red' })
    ball.draw()
    canvas.addEventListener('click', function(event) {
      if (event.region) {
        console.log(event.region)
      }
    })
  }} />)
  .add('smile', () => <Component render={(ctx, uc, canvas) => {
    var smile = uc.atomic.smile(100, 100, 75, { stroke: 'blue', strokeWidth: 1 })
    var smile1 = uc.atomic.smile(100, 200, 75, { fill: 'blue', strokeWidth: 3 })
    smile.draw()
    smile1.draw()
  }} />)
  .add('优化', () => <Component render={(ctx, uc, canvas) => {
    uc.tools.offcreenRender(canvas)
  }} />)
  .add('多层画布', () => (<div>
    <Component id="ui-layer" style={{ position: 'absolute', top: 0, zIndex: 3 }} render={(ctx, uc, canvas) => {
      var smile = uc.atomic.smile(100, 100, 75, { fill: 'red', strokeWidth: 1 }) 
      smile.draw()
    }} />
    <Component id="game-layer" style={{ position: 'absolute', top: 0, zIndex: 2 }} render={(ctx, uc, canvas) => {
      var smile = uc.atomic.smile(100, 150, 75, { fill: 'green', strokeWidth: 1 })
      smile.draw()
    }} />
    <Component id="background-layer" style={{ position: 'absolute', top: 0, zIndex: 1 }} render={(ctx, uc, canvas) => {
      var smile = uc.atomic.smile(100, 200, 75, { fill: 'blue', strokeWidth: 1 })
      smile.draw()
    }} />
  </div>))
  .add('用CSS设置大的背景图', () => <Component style={{ backgroundImage: `url(${defaultImg})` }} render={(ctx, uc, canvas) => {
  }} />)
  .add('用CSS transforms特性缩放画布', () => <Component render={(ctx, uc, canvas) => {
    var scaleX = canvas.width / window.innerWidth;
    var scaleY = canvas.height / window.innerHeight;

    var scaleToFit = Math.min(scaleX, scaleY);
    var scaleToCover = Math.max(scaleX, scaleY);

    // stage.style.transformOrigin = '0 0'; //scale from top left
    // stage.style.transform = 'scale(' + scaleToFit + ')';
  }} />)
  .add('关闭透明度', () => (<div>
    <Component id="ui-layer" style={{ position: 'absolute', top: 0, zIndex: 3 }} render={(ctx, uc, canvas) => {
      var smile = uc.atomic.smile(100, 100, 75, { fill: 'red', strokeWidth: 1 }) 
      smile.draw()
    }} />
    <Component id="game-layer" canvasOptions={{ alpha: false }} style={{ position: 'absolute', top: 0, zIndex: 2 }} render={(ctx, uc, canvas) => {
      var smile = uc.atomic.smile(100, 150, 75, { fill: 'green', strokeWidth: 1 })
      smile.draw()
    }} />
    <Component id="background-layer" style={{ position: 'absolute', top: 0, zIndex: 1 }} render={(ctx, uc, canvas) => {
      var smile = uc.atomic.smile(100, 200, 75, { fill: 'blue', strokeWidth: 1 })
      smile.draw()
    }} />
  </div>), {
    notes: `
1.将画布的函数调用集合到一起（例如，画一条折线，而不要画多条分开的直线）

2.避免不必要的画布状态改变

3.渲染画布中的不同点，而非整个新状态

4.尽可能避免 shadowBlur特性

5.尽可能避免text rendering

6.使用不同的办法去清除画布(clearRect() vs. fillRect() vs. 调整canvas大小)

7.有动画，请使用window.requestAnimationFrame() 而非window.setInterval()

8.请谨慎使用大型物理库
    `
  })
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
  // .add('', () => <Component render={(ctx, uc, canvas) => {
  // }} />)
