"use strict";
exports.__esModule = true;
var Canvas2D = /** @class */ (function () {
    // public访问级别的构造函数
    function Canvas2D(canvas) {
        this.context = canvas.getContext('2d');
    }
    // public访问级别的成员函数
    Canvas2D.prototype.drawText = function (text) {
        // Canvas2D和webGL这种底层绘图API都是状态机模式
        // 每次绘制前调用save将即将要修改的状态记录下来
        // 每次绘制后调用restore将已修改的状态丢弃，恢复到初始化时的状态
        // 这样的好处是状态不会混乱
        // 假设当前绘制文本使用红色，如果你没有使用save、restore配对函数的话
        // 则下次调用其他绘图函数时，如果你没有改变颜色，则会继续使用上次设置的红色进行绘制
        // 随着程序越来越复杂，如不使用save、resotre来管理，最后整个渲染状态会及其混乱
        // 请时刻保持使用save、resotre配对函数来管理渲染状态
        if (this.context !== null) {
            this.context.save();
            // 让要绘制的文本居中对齐
            this.context.textBaseline = 'middle';
            this.context.textAlign = 'center';
            // 计算canvas的中心坐标
            var centerX = this.context.canvas.width * 0.5;
            var centerY = this.context.canvas.height * 0.5;
            // 填充红色
            // this.context.fillStyle = 'red'
            // 调用文字填充命令
            this.context.fillText(text, centerX, centerY);
            // 绿色描边
            this.context.strokeStyle = 'green';
            // 调用文字描边命令
            this.context.strokeText(text, centerX, centerY);
            // 将上面context中的textAlign, extBaseLine, fillStyle, strokeStyle
            // 状态恢复到初始化状态
            this.context.restore();
        }
    };
    return Canvas2D;
}());
exports.Canvas2D = Canvas2D;
