import React from 'react';
import { storiesOf } from '@storybook/react'

import Component from './index'
import doc from './doc.md'
import transformationsDoc from './transformationsDoc.md'
// https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Using_images
import defaultImg from '../../assets/mr.jpg'
const imgUrl = 'https://static.uskid.com/web/garden/jxx21vkk_6CBhSeTswDSeW3YVNHQ5BLhU.png'
const videoUrl = 'https://uskid.oss-cn-beijing.aliyuncs.com/video/%E5%8C%A0%E5%BF%83%E6%AF%94%E5%BF%83-%E7%BF%9F%E5%B0%91%E6%88%90%E8%80%81%E5%B8%88(5min).mp4'

storiesOf('Canvas|Basic', module)
  .add('默认状态', () => <Component showDemo />)
  .add('beginPath', () => <Component render={(ctx) => {
    for (var i=0;i<6;i++){
      for (var j=0;j<6;j++){
        ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*i) + ',' + 
                         Math.floor(255-42.5*j) + ')';
        ctx.beginPath();
        ctx.arc(12.5+j*25,12.5+i*25,10,0,Math.PI*2,true);
        ctx.stroke();
      }
    }
  }} />)
  .add('透明度 Transparency', () => <Component render={(ctx) => {
    // 画背景
    ctx.fillStyle = '#FD0';
    ctx.fillRect(0,0,75,75);
    ctx.fillStyle = '#6C0';
    ctx.fillRect(75,0,75,75);
    ctx.fillStyle = '#09F';
    ctx.fillRect(0,75,75,75);
    ctx.fillStyle = '#F30';
    ctx.fillRect(75,75,75,75);
    ctx.fillStyle = '#FFF';

    // 设置透明度值
    ctx.globalAlpha = 0.2;

    // 画半透明圆
    for (var i=0;i<7;i++){
        ctx.beginPath();
        ctx.arc(75,75,10+10*i,0,Math.PI*2,true);
        ctx.fill();
    }
  }} />)
  .add('透明度', (ctx) => <Component render={(ctx) => {
    // 画背景
    ctx.fillStyle = 'rgb(255,221,0)';
    ctx.fillRect(0,0,150,37.5);
    ctx.fillStyle = 'rgb(102,204,0)';
    ctx.fillRect(0,37.5,150,37.5);
    ctx.fillStyle = 'rgb(0,153,255)';
    ctx.fillRect(0,75,150,37.5);
    ctx.fillStyle = 'rgb(255,51,0)';
    ctx.fillRect(0,112.5,150,37.5);

    // 画半透明矩形
    for (var i=0;i<10;i++){
      ctx.fillStyle = 'rgba(255,255,255,'+(i+1)/10+')';
      for (var j=0;j<4;j++){
        ctx.fillRect(5+i*14,5+j*37.5,14,27.5)
      }
    }
  }} />)
  .add('line-lineWidth', () => <Component render={(ctx) => {
    /*
    lineWidth = value
    设置线条宽度。
    lineCap = type
    设置线条末端样式。
    lineJoin = type
    设定线条与线条间接合处的样式。
    miterLimit = value
    限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。
    getLineDash()
    返回一个包含当前虚线样式，长度为非负偶数的数组。
    setLineDash(segments)
    设置当前虚线样式。
    lineDashOffset = value
    设置虚线样式的起始偏移量。
    */
    for (var i = 0; i < 10; i++){
      ctx.lineWidth = 1+i;
      ctx.beginPath();
      ctx.moveTo(5+i*14,5);
      ctx.lineTo(5+i*14,140);
      ctx.stroke();
    }
  }} />)
  .add('line-lineCap', () => <Component render={(ctx) => {
    var lineCap = ['butt','round','square'];
    // 创建路径
    ctx.strokeStyle = '#09f';
    ctx.beginPath();
    ctx.moveTo(10,10);
    ctx.lineTo(140,10);
    ctx.moveTo(10,140);
    ctx.lineTo(140,140);
    ctx.stroke();

    // 画线条
    ctx.strokeStyle = 'black';
    for (var i=0;i<lineCap.length;i++){
      ctx.lineWidth = 15;
      ctx.lineCap = lineCap[i];
      ctx.beginPath();
      ctx.moveTo(25+i*50,10);
      ctx.lineTo(25+i*50,140);
      ctx.stroke();
    }
  }} />)
  .add('line-lineJoin', () => <Component render={(ctx) => {
    var lineJoin = ['round', 'bevel', 'miter'];
    ctx.lineWidth = 10;
    for (var i = 0; i < lineJoin.length; i++) {
      ctx.lineJoin = lineJoin[i];
      ctx.beginPath();
      ctx.moveTo(-5, 5 + i * 40);
      ctx.lineTo(35, 45 + i * 40);
      ctx.lineTo(75, 5 + i * 40);
      ctx.lineTo(115, 45 + i * 40);
      ctx.lineTo(155, 5 + i * 40);
      ctx.stroke();
    }
  }} />)
  .add('line-miterLimit', () => <Component render={(ctx) => {
    var offset = 0;

    function draw() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      ctx.setLineDash([4, 2]);
      ctx.lineDashOffset = -offset;
      ctx.strokeRect(10,10, 100, 100);
    }

    function march() {
      offset++;
      if (offset > 16) {
        offset = 0;
      }
      draw();
      setTimeout(march, 20);
    }

    march();
  }} />)
  .add('渐变 Gradients-createLinearGradient', () => <Component render={(ctx) => {
    // Create gradients
    var lingrad = ctx.createLinearGradient(0,0,0,150);
    lingrad.addColorStop(0, '#00ABEB');
    lingrad.addColorStop(0.5, '#fff');
    lingrad.addColorStop(0.5, '#26C000');
    lingrad.addColorStop(1, '#fff');

    var lingrad2 = ctx.createLinearGradient(0,50,0,95);
    lingrad2.addColorStop(0.5, '#000');
    lingrad2.addColorStop(1, 'rgba(0,0,0,0)');

    // assign gradients to fill and stroke styles
    ctx.fillStyle = lingrad;
    ctx.strokeStyle = lingrad2;
    
    // draw shapes
    ctx.fillRect(10,10,130,130);
    ctx.strokeRect(50,50,50,50);
  }} />)
  .add('渐变 Gradients-createRadialGradient', () => <Component render={(ctx) => {
    // 创建渐变
    var radgrad = ctx.createRadialGradient(45,45,10,52,50,30);
    radgrad.addColorStop(0, '#A7D30C');
    radgrad.addColorStop(0.9, '#019F62');
    radgrad.addColorStop(1, 'rgba(1,159,98,0)');
    
    var radgrad2 = ctx.createRadialGradient(105,105,20,112,120,50);
    radgrad2.addColorStop(0, '#FF5F98');
    radgrad2.addColorStop(0.75, '#FF0188');
    radgrad2.addColorStop(1, 'rgba(255,1,136,0)');

    var radgrad3 = ctx.createRadialGradient(95,15,15,102,20,40);
    radgrad3.addColorStop(0, '#00C9FF');
    radgrad3.addColorStop(0.8, '#00B5E2');
    radgrad3.addColorStop(1, 'rgba(0,201,255,0)');

    var radgrad4 = ctx.createRadialGradient(0,150,50,0,140,90);
    radgrad4.addColorStop(0, '#F4F201');
    radgrad4.addColorStop(0.8, '#E4C700');
    radgrad4.addColorStop(1, 'rgba(228,199,0,0)');
    
    // 画图形
    ctx.fillStyle = radgrad4;
    ctx.fillRect(0,0,150,150);
    ctx.fillStyle = radgrad3;
    ctx.fillRect(0,0,150,150);
    ctx.fillStyle = radgrad2;
    ctx.fillRect(0,0,150,150);
    ctx.fillStyle = radgrad;
    ctx.fillRect(0,0,150,150);
  }} />)
  .add('图案样式 Patterns', () => <Component render={(ctx) => {
    // 创建新 image 对象，用作图案
    var img = new Image();
    img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
    img.onload = function() {
      // 创建图案
      var ptrn = ctx.createPattern(img, 'repeat');
      ctx.fillStyle = ptrn;
      ctx.fillRect(0, 0, 150, 150);
    }
  }} />)
  .add('阴影 Shadows', () => <Component render={(ctx) => {
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  
    ctx.font = "20px Times New Roman";
    ctx.fillStyle = "Black";
    ctx.fillText("Sample String", 5, 30);
  }} />)
  .add('Canvas 填充规则', () => <Component render={(ctx) => {
    ctx.beginPath(); 
    ctx.arc(50, 50, 30, 0, Math.PI*2, true);
    ctx.arc(50, 50, 15, 0, Math.PI*2, true);
    ctx.fill("evenodd");
  }} />)
  .add('绘制文本', () => <Component render={(ctx) => {
    ctx.font = "48px serif";
    ctx.fillText("Hello world", 10, 50);

    ctx.font = "48px serif";
    ctx.strokeText("Hello world", 10, 100);
  }} />)
  .add('绘制文本-textBaseline', () => <Component render={(ctx) => {
    ctx.font = "48px serif";
    ctx.textBaseline = "hanging";
    ctx.strokeText("Hello world", 0, 100);
  }} />)
  .add('测量文本宽度-measureText()', () => <Component render={(ctx) => {
    var text = ctx.measureText("Hello world"); // TextMetrics object
    text.width // 51.909881591796875;
    ctx.strokeText("Hello world", 0, 100);
  }} />)
  .add('绘制图片-drawImage', () => (<div>
    <Component render={(ctx) => {
      var img = new Image()
      img.onload = function() {
        ctx.drawImage(img, 0, 0)
        // ctx.beginPath()
        // ctx.moveTo(30,96);
        // ctx.lineTo(70,66);
        // ctx.lineTo(103,76);
        // ctx.lineTo(170,15);
        // ctx.stroke();
      }
      img.src = imgUrl
    }} />
  </div>), {
    notes: doc
  })
  .add('绘制图片-Scaling', () => <Component render={(ctx) => {
    var img = new Image()
    img.onload = function() {
      ctx.drawImage(img, 0, 0, 200, 200)
    }
    img.src = imgUrl 
  }} />)
  .add('绘制图片-平铺', () => <Component render={(ctx) => {
    var img = new Image()
    img.onload = function() {
      for (var i=0;i<4;i++){
        for (var j=0;j<3;j++){
          ctx.drawImage(img,j*100,i*80,100,80);
        }
      }
    }
    img.src = imgUrl 
  }} />)
  .add('绘制图片-切片', () => <Component render={(ctx) => {
    var img = new Image()
    img.onload = function() {
      ctx.drawImage(img, 0, 0, 400, 400)
      ctx.drawImage(img,
                28,20,200,200,400,0,300,300);
    }
    img.src = 'https://mdn.mozillademos.org/files/226/Canvas_drawimage2.jpg'  
  }} />)
  .add('状态的保存和恢复 Saving and restoring state', () => <Component render={(ctx) => {
    ctx.fillRect(0,0,150,150);   // 使用默认设置绘制一个矩形
    ctx.save();                  // 保存默认状态

    ctx.fillStyle = '#09F'       // 在原有配置基础上对颜色做改变
    ctx.fillRect(15,15,120,120); // 使用新的设置绘制一个矩形

    ctx.save();                  // 保存当前状态
    ctx.fillStyle = '#FFF'       // 再次改变颜色配置
    ctx.globalAlpha = 0.5;    
    ctx.fillRect(30,30,90,90);   // 使用新的配置绘制一个矩形

    ctx.restore();               // 重新加载之前的颜色状态
    ctx.fillRect(45,45,60,60);   // 使用上一次的配置绘制一个矩形

    ctx.restore();               // 加载默认颜色配置
    ctx.fillRect(60,60,30,30);   // 使用加载的配置绘制一个矩形
  }} />, {
    notes: transformationsDoc
  })
  .add('移动 Translating', () => <Component render={(ctx) => {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        ctx.save();
        ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
        ctx.translate(10 + j * 50, 10 + i * 50);
        ctx.fillRect(0, 0, 25, 25);
        ctx.restore();
      }
    }
  }} />)
  .add('旋转 Rotating', () => <Component render={(ctx) => {
    ctx.translate(75,75);

    for (var i=1;i<6;i++){ // Loop through rings (from inside to out)
      ctx.save();
      ctx.fillStyle = 'rgb('+(51*i)+','+(255-51*i)+',255)';

      for (var j=0;j<i*6;j++){ // draw individual dots
        ctx.rotate(Math.PI*2/(i*6));
        ctx.beginPath();
        ctx.arc(0,i*12.5,5,0,Math.PI*2,true);
        ctx.fill();
      }

      ctx.restore();
    }
  }} />)
  .add('缩放 Scaling', () => <Component render={(ctx) => {
    // draw a simple rectangle, but scale it.
    ctx.save();
    ctx.scale(10, 3);
    ctx.fillRect(1, 10, 10, 10);
    ctx.restore();

    // mirror horizontally
    ctx.scale(-1, 1);
    ctx.font = '48px serif';
    ctx.fillText('MDN', -135, 120);
  }} />)
  .add('变形 Transforms', () => <Component render={(ctx) => {
    var sin = Math.sin(Math.PI/6);
    var cos = Math.cos(Math.PI/6);
    ctx.translate(100, 100);
    var c = 0;
    for (var i=0; i <= 12; i++) {
      c = Math.floor(255 / 12 * i);
      ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
      ctx.fillRect(0, 0, 100, 10);
      ctx.transform(cos, sin, -sin, cos, 0, 0);
    }
    
    ctx.setTransform(-1, 0, 0, 1, 100, 100);
    ctx.fillStyle = "rgba(255, 128, 255, 0.5)";
    ctx.fillRect(0, 50, 100, 100);
  }} />)

storiesOf('Canvas|Compositing', module) 
  .add('globalCompositeOperation', () => (<div>
    <iframe src="./demo.html" />
  </div>))
  .add('clip', () => <Component render={(ctx) => {
    function drawStar(ctx,r){
      ctx.save();
      ctx.beginPath()
      ctx.moveTo(r,0);
      for (var i=0;i<9;i++){
        ctx.rotate(Math.PI/5);
        if(i%2 == 0) {
          ctx.lineTo((r/0.525731)*0.200811,0);
        } else {
          ctx.lineTo(r,0);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.fillRect(0,0,150,150);
    ctx.translate(75,75);

    // Create a circular clipping path
    ctx.beginPath();
    ctx.arc(0,0,60,0,Math.PI*2,true);
    ctx.clip();

    // draw background
    var lingrad = ctx.createLinearGradient(0,-75,0,75);
    lingrad.addColorStop(0, '#232256');
    lingrad.addColorStop(1, '#143778');
    
    ctx.fillStyle = lingrad;
    ctx.fillRect(-75,-75,150,150);

    // draw stars
    for (var j=1;j<50;j++){
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.translate(75-Math.floor(Math.random()*150),
                    75-Math.floor(Math.random()*150));
      drawStar(ctx,Math.floor(Math.random()*4)+2);
      ctx.restore();
    }
  }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
  // .add('', () => <Component render={(ctx) => {
  // }} />)
