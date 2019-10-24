"use strict";
exports.__esModule = true;
var Canvas2D_1 = require("./canvas/Canvas2D");
var canvas = document.getElementById('canvas');
if (canvas === null) {
    alert('无法获取HTMLCanvasElement');
    throw new Error('无法获取HTMLCanvasElement');
}
var canvas2d = new Canvas2D_1.Canvas2D(canvas);
canvas2d.drawText('Hello World From Module');
