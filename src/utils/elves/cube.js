import Vertex from './vertex'

class Cube {
  constructor(cx, cy, cz, side) {
    //中心
    this.center = new Vertex(cx, cy, cz);

    //边长
    this.side = side;

    //半径
    var d = side / 2;

    //8个点
    this.vertices = [
      new Vertex(this.center.x - d, this.center.y - d, this.center.z + d),
      new Vertex(this.center.x - d, this.center.y - d, this.center.z - d),
      new Vertex(this.center.x + d, this.center.y - d, this.center.z - d),
      new Vertex(this.center.x + d, this.center.y - d, this.center.z + d),
      new Vertex(this.center.x + d, this.center.y + d, this.center.z + d),
      new Vertex(this.center.x + d, this.center.y + d, this.center.z - d),
      new Vertex(this.center.x - d, this.center.y + d, this.center.z - d),
      new Vertex(this.center.x - d, this.center.y + d, this.center.z + d)
    ];

    //白 蓝 红 绿 黄  橙色
    this.facecolor = ['rgba(227, 236, 236, 1)', 'rgba(0, 150, 255, 1)', 'rgba(158, 63, 34, 1)', 'rgba(41, 222, 80, 1)',
      'rgba(231, 234, 32, 1)', 'rgba(226, 131, 14, 1)'];

    //6个面
    this.faces = [
      [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
      [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
      [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
      [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
      [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
      [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
    ];

    console.log(this.faces)
  }

  /**
   * 将自己立方体渲染在canvas上(Y轴垂直于屏幕).
   * @param ctx canvas对象
   * @param dx canvas起点相对立方体中心的x距离
   * @param dy canvas起点相对立方体中心的y距离
   */
  render = (ctx, dx, dy) => {
    ctx.clearRect(0, 0, 2 * dx, 2 * dy);
    var faces = this.faces
    var len = this.faces.length;
    faces.sort(function (a, b) {
      let aIndex = a[0].y + a[1].y + a[2].y + a[3].y;
      let bIndex = b[0].y + b[1].y + b[2].y + b[3].y;
      return aIndex - bIndex;
    });
    //遍历6个面
    for (var j = 0; j < len; ++j) {
      var face = faces[j];
      ctx.beginPath();
      ctx.fillStyle = this.facecolor[j];

      //连接4个点
      for (var k = 0, n_vertices = face.length; k < n_vertices; ++k) {
        var P = this.project(face[k]);
        if (k == 0) {
          ctx.moveTo(P.x + dx, P.y + dy);
        } else {
          ctx.lineTo(P.x + dx, P.y + dy);
        }

      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }

  /**
   * 已Y轴为垂线将三维平面的点映射到二维平面.
   * @param vertex vertex
   */
  project = (vertex) => {
    return new Vertex(vertex.x, vertex.z);
  }

  rotate = (theta, phi) => {
    var center = this.center;
    for (let i = 0; i < 8; i++) {
      var M = this.vertices[i];
      // 旋转角的正余弦值
      var ct = Math.cos(theta);
      var st = Math.sin(theta);
      var cp = Math.cos(phi);
      var sp = Math.sin(phi);

      // 旋转后的值
      var x = M.x - center.x;
      var y = M.y - center.y;
      var z = M.z - center.z;
      M.x = ct * x - st * cp * y + st * sp * z + center.x;
      M.y = st * x + ct * cp * y - ct * sp * z + center.y;
      M.z = sp * y + cp * z + center.z;
    }
  }

  rotate1 = (theta, phi) => {
    var acenter = this.center;
    var center = new Vertex(0, 1, 0);
    for (let i = 0; i < 8; i++) {
      var M = this.vertices[i];

      var sa = Math.sqrt((Math.pow(center.x, 2) + Math.pow(center.y, 2)) /
        (Math.pow(center.x, 2) + Math.pow(center.y, 2) + Math.pow(center.z, 2)));
      var ca = Math.sqrt((Math.pow(center.z, 2)) /
        (Math.pow(center.x, 2) + Math.pow(center.y, 2) + Math.pow(center.z, 2)));
      var sb = Math.sqrt((Math.pow(center.y, 2)) /
        (Math.pow(center.x, 2) + Math.pow(center.y, 2)));
      var cb = Math.sqrt((Math.pow(center.x, 2)) /
        (Math.pow(center.x, 2) + Math.pow(center.y, 2)));

      var xx = sa * cb;
      var yy = sa * sb;
      var zz = ca;

      var xx_2 = Math.pow(xx, 2);
      var yy_2 = Math.pow(yy, 2);
      var zz_2 = Math.pow(zz, 2);

      // 旋转角的正余弦值
      var ct = Math.cos(theta);
      var st = Math.sin(theta);

      // 旋转后的值
      var x = M.x - acenter.x;
      var y = M.y - acenter.y;
      var z = M.z - acenter.z;

      M.x = (xx * yy * (1 - ct) - zz * st) * x
        + (ct + yy_2 * (1 - ct)) * y
        + (zz * yy * (1 - ct) + xx * st) * z + acenter.x;
      M.y = (ct + xx_2 * (1 - ct)) * x
        + (yy * xx * (1 - ct) + zz * st) * y
        + (zz * xx * (1 - ct) - yy * st) * z + acenter.y;
      M.z = (xx * zz * (1 - ct) + yy * st) * x
        + (yy * zz * (1 - ct) - xx * st) * y
        + (ct + zz_2 * (1 - ct)) * z + acenter.z;
    }
  }

  rotate2 = (theta, phi) => {
    var acenter = this.center;
    var center = new Vertex(0, 0, 10);

    for (let i = 0; i < 8; i++) {
      var M = this.vertices[i];

      var a = -center.x;
      var b = -center.y;
      var c = center.z;
      var a2 = Math.pow(a, 2);
      var b2 = Math.pow(b, 2);
      var c2 = Math.pow(c, 2);
      var unitlen2 = a2 + b2 + c2;
      var unitlen = Math.sqrt(a2 + b2 + c2);
      // 旋转角的正余弦值
      var ct = Math.cos(theta);
      var st = Math.sin(theta);

      // 旋转后的值
      var x = M.x - acenter.x;
      var y = M.y - acenter.y;
      var z = M.z - acenter.z;

      M.x = (a2 + (b2 + c2) * ct) / unitlen2 * x
        + (a * b * (1 - ct) - c * unitlen * st) / unitlen2 * y
        + (a * c * (1 - ct) + b * unitlen * st) / unitlen2 * z + acenter.x;
      M.y = (a * b * (1 - ct) + c * unitlen * st) / unitlen2 * x
        + (b2 + (a2 + c2) * ct) / unitlen2 * y
        + (b * c * (1 - ct) - a * unitlen * st) / unitlen2 * z + acenter.y;
      M.z = (a * c * (1 - ct) - b * unitlen * st) / unitlen2 * x
        + (b * c * (1 - ct) + a * unitlen * st) / unitlen2 * y
        + (c2 + (a2 + b2) * ct) / unitlen2 * z + acenter.z;
    }
  }
}

export default Cube