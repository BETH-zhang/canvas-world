export enum ELayout {
  LEFT_TOP,
  RIGHT_TOP,
  RIGHT_BOTTOM,
  LEFT_BOTTOM,
  CENTER_MIDDLE,
  CENTER_TOP,
  RIGHT_MIDDLE,
  CENTER_BOTTOM,
  LEFT_MIDDLE,
}

export enum EImageFillType {
  STRETCH,
  REPEAT,
  REPEAT_X,
  REPEAT_Y,
}

// 二维向量
export class vec2 {
  public values: Float32Array // 使用float32Array

  public constructor(x: number = 0, y: number = 0) {
    this.values = new Float32Array([x, y])
  }

  public toString(): string {
    return `[${this.values[0]}, ${this.values[1]}]`
  }

  public get x(): number { return this.values[0] }
  public set x(x: number) { this.values[0] = x }
  public get y(): number { return this.values[1] }
  public set y(y: number) { this.values[1] = y }

  // 静态create方法
  public static create(x: number = 0, y: number = 0): vec2 {
    return new vec2(x, y)
  }
}

// 2D尺寸
export class Size {
  public values: Float32Array;
  public constructor(w: number = 1, h: number = 1) {
    this.values = new Float32Array([w, h])
  }
  public set width( value: number ) { this.values[0] = value }
  public get width(): number { return this.values[0] }
  public set height( value: number ) { this.values[1] = value }
  public get height(): number { return this.values[1] }

  // 静态创建方法
  public static create(w: number = 1, h: number = 1): Size {
    return new Size(w, h)
  }
}

// 矩形包围框
export class Rectangle {
  public origin: vec2;
  public size: Size
  public constructor(orign: vec2 = new vec2(), size: Size = new Size()) {
    this.origin = orign
    this.size = size
  }

  // 静态创建方法
  public static create(x: number = 0, y: number = 0, w: number = 0, h: number = 0): Rectangle {
    let origin: vec2 = new vec2(x, y)
    let size: Size = new Size(w, h)
    return new Rectangle(origin, size)
  }

  public isEmpty(): boolean {
    return this.size.values.length ? false : true
  }
}

// 坐标变换
export class CoordinateTransformation {
  // 局部坐标系的平移操作
  public translate(x: number, y: number): void {}
  // 局部坐标系的旋转操作
  public rotate(angle: number): void {}
  // 局部坐标系的缩放操作
  public scale(x: number, y: number): void {}
  // 矩阵相乘操作
  public transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {}
  // 设置变换矩阵操作
  public setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {}
}

// 使用const关键字定义常数
const PiBy180: number = 0.01745329519943295; // Math.PI / 180
export class Math2D {
  // 将以角度表示的参数转换为弧度表示
  public static toRadian(degree: number): number {
    return degree * PiBy180
  }

  // 将以弧度表示的参数转换为角度表示
  public static toDegree(radian: number): number {
    return radian / PiBy180
  }
}
