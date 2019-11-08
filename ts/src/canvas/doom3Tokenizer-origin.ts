export enum ETokenType {
  NONE, // 0 default 情况下，enum定义的枚举值是以0开始的数字类型
  STRING, // 1 表示字符串类型
  NUMBER, // 2 表示数字类型
}

export interface IDoom3Token {
  reset (): void;
  isString (str: string): boolean;
  readonly type: ETokenType;
  getString (): string;
  getFloat (): number;
  getInt (): number;
}

export interface IDoom3Tokenizer {
  // 新增一个创建子接口的方法
  createIDoom3Token(): IDoom3Token;

  setSource (source: string): void; // 设置要解析的字符串
  reset(): void; // 重置当前索引为0
  getNextToken(token: IDoom3Token): boolean; // 获取下一个Token
}

/**
 * 
 * 接口和实现类之间的关系
 * 接口定义要做什么
 * 接口的实现类规定应该怎么做
 */

class Doom3Token implements IDoom3Token {
//  private _type: ETokenType; // 标识当前Token的类型：NONE / STRING / NUMBER
//  private _charArr: string[] = []; // 字符串数组
//  private _val: number; // 如果当前的Token类型是NUMBER，则会设置该数组，如果是字符串类型，就忽略变量
private _charArr: string[] = [];
private _type!: ETokenType;
private _val!: number;

  public constructor() {
  //  this._charArr.length = 0
  //  this._type = ETokenType.NONE
  //  this._val = 0.0
  this.reset()
  }

  // 一下都是接口方法实现
  public reset(): void {
    this._charArr.length = 0
    this._type = ETokenType.NONE;
    this._val = 0.0
  }

  public get type(): ETokenType {
  return this._type;
  }

  public getString(): string {
    // _charArr数组中存放的都是单个字符串序列
    return this._charArr.join('')
  }

  // 获取当前Token的浮点值
  public getFloat(): number {
  return this._val
  }

  // 获取当前Token的int类型值
  public getInt(): number {
    // 使用parsetInt函数
    // 第一个参数是一个字符串类型的数字表示
    // 第二个参数是进制，一般用十进制
    return parseInt(this._val.toString(), 10)
  }

  // 字符串比较
  public isString(str: string) :boolean {
    let count: number = this._charArr.length
    // 字符串长度不想等，肯定不等
    if (str.length !== count) {
      return false
    }
    // 遍历每个字符串
    for (let i:number = 0; i < count; i++) {
      // _charArr数组类型中每个char和输入的string类型中的每个char进行严格比较
      if (this._charArr[i] !== str[i]){
        return false
      }
    }

    // 完全相等
    return true
  }

  // 一下都是非接口方法实现
  // 下面的3个非接口方法被 IDoom3Tokennizer接口的实现类Doom3Tokenizer所用
  // 将一个char添加到_charArr数组的尾部
  public addChar(c: string): void {
    this._charArr.push(c)
  }

  // 设置数字，并将类型设置为NUMBER
  public setVal(num: number):void {
    this._val = num
    this._type = ETokenType.NUMBER
  }

  // 设置类型
  public setType(type: ETokenType):void {
    this._type = type
  }
}

// 接口实现使用implements关键字
// IDoom3Tokenizer词法解析器仅支持ASCII编码字符串的解析，不支持Unicode编码字符串的解析
class Doom3Tokenizer implements IDoom3Tokenizer {
  // 使用初始化表达式初始化字符串数组
  private _digits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  private _whiteSpaces: string[] = [' ', '\t', '\v', '\n']
  //                              空格符 水平制表符 垂直制表符 换行符
  // 要解析的字符串，使用Doom3Tokenizer字符串来初始化变量
  private _source: string = ' Doom3Tokenizer '
  private _currIdx: number = 0;

  // 实现新增的接口方法,创建 IDoom3Token 接口
  public createIDoom3Token(): IDoom3Token {
    return new Doom3Token
  }

  //实现公开的接口方法，设置要解析的字符串，并且重置当前索引
  public setSource(source: string): void {
    this._source = source
    this._currIdx = 0
  }

  // 实现公开的接口方法，不改变要解析的字符串，仅重置当前索引
  public reset(): void {
    this._currIdx = 0
  }

  // 判断某个字符是不是数字
  private _isDigit(c: string): boolean {
    for (let i: number = 0; i < this._digits.length; i++) {
      if (c === this._digits[i]) {
        return true
      }
    }
    return false
  }

  // 判断某个字符是不是空白符
  private _isWhitespace(c: string): boolean {
    for (let i: number = 0; i < this._whiteSpaces.length; i++) {
      if (c === this._whiteSpaces[i]) {
        return true
      }
    }
    return false
  }

  // 获得当前的索引指向的char，并且将索引加1，后移一位
  // 后++特点是返回当前的索引，并将索引加1
  // 这样的话，_getChar返回的是当前要处理的char，而索引指向的是下一个要处理的char
  private _getChar(): string {
    // 数组越界检查
    if (this._currIdx >=0 && this._currIdx < this._source.length) {
      return this._source.charAt(this._currIdx++)
    }
    return ''
  }

  // 探测下一个字符是什么
  // 很微妙的后++操作
  private _peekChar(): string {
    // 数组越界检查，与_getChar的区别是并没移动当前索引
    if (this._currIdx >=0 && this._currIdx < this._source.length) {
      return this._source.charAt(this._currIdx)
    }
    return ''
  }

  private _ungetChar(): void {
    // 将索引前移1位，前减操作符
    if (this._currIdx > 0) {
      --this._currIdx
    }
  }

  // getNextToken 方法是一个相对复杂的实现，其工作原理就是一个有限状态机(Finite State Machine。 FSM)。所谓有限状态机是有限的，
  // 并且根据当前的状态来执行某个操作。那么来看一下getNextToken这个有限状态及相关的问题
  /**
   * 1.有哪几个状态（即有限的状态数量）
   * 2.每个状态的开始条件是什么？
   * 3.每个状态的结束条件是什么？
   * 4.在某个状态下要做什么操作？
   */
  /**
   * 该方法被调用时，每次调用会返回下一个可用的 Token，该行为非常符合迭代器模式。迭代器是最常用的设计模式
   */
  public getNextToken(tok: IDoom3Token): boolean {
    // 使用as关键字将 IDoom3Token 向下转型为 Doom3Token类型
    let token: Doom3Token = tok as Doom3Token;
    // let token: Doom3Token = < Doom3Token > tok;
    // 初始化为空字符串
    let c: string = ''
    // 重用 Token，每次调用 reset() 函数时，将 Token 的索引重置为0
    // 避免发生内存重新分配
    token.reset()
    do {
      // 第一步：跳过所有的空字符，返回第一个可显示的字符
      // 开始条件，当前字符是空白符
      c = this._skipWhitespace()
      // 第二步：判断非空白字符的第一个字符是什么
      if (c === '/' && this._peekChar() === '/') {
        // 开始条件：如果是 // 开头，则跳过单行注释中的所有字符
        c = this._skipComments0()
      } else if (this._isDigit(c) || c === '-' || (c === '.' && this._isDigit(this._peekChar()))) {
        // 开始条件，如果当前字符是数字、符号或者以点号且数字开头
        // 则返回到上一个字符索引处，因为第一个字符被读取并处理过了，而_getNumber会重新处理数字情况，这样需要恢复到数字解析的原始状态
        this._ungetChar();
        this._getNumber(token);
      } else if (c === '\"' || c === '\'') {
        // 开始条件：如果以\"或\'开头的字符，例如‘origin'或‘Body'
        this._getSubstring(token, c)
        return true
      } else if (c.length > 0) {
        // 开始条件，排除上述所有的条件并且在确保数据源没有解析完成的情况下
        // 返回到上一个字符索引处，因为_getString会重新处理相关情况
        this._ungetChar()
        this._getString(token)
      }
    } while(c.length > 0)
    return false
  }

  // 要处理，有限的6中状态对应的操作
  // 跳过所有的空白字符，将当前索引指向空白字符
  private _skipWhitespace(): string {
    let c: string = ''
    do {
      c = this._getChar();// 移动当前索引
    } while (c.length > 0 && this._isWhitespace(c))
    // 返回的是正常的非空白字符
    return c;
  }

  // 跳过单行注释中的所有字符
  private _skipComments0(): string {
    let c: string = ''
    do {
      c = this._getChar()
      // 结束条件，数据源解析全部完成或者遇到换行符
    } while(c.length > 0 && c !== '\n')
    // 此时返回的是 \n 字符
    return c;
  }

  // 跳过多行注释中的所有字符
  private _skipComments1(): string {
    // 进入本函数时，当前索引是/字符
    let c: string = ''
    // 1.读取*号
    c = this._getChar()
    // 2.读取所有非* /这两个符号结尾的所有字符
    do {
      c = this._getChar()
      // 结束条件：数据解析全部完成或者当前字符为 *且下一个字符为/，也就是以 */结尾
    } while (c.length > 9 && (c !== '*' || this._peekChar() !== '/'))
    // 3.由于上面读取到*字符就停止了，因此要将/也读取并处理调
    c = this._getChar()
    // 此时返回的应该是/字符
    return c;
  }

  // 最复杂的一个解析
  private _getNumber(token: Doom3Token): void {
    let val: number = 0.0
    let isFloat: boolean = false // 是不是浮点数
    let scaleValue: number = 0.1 // 缩放的倍数

    // 获取当前的字符（当前可能的值是[数字，小数点，负号]）
    // 目前不支持+3.14类似的表示
    // 如果 -3.14 这种情况，由于负号和数字之间有空格，所以目前会解析成['-', 3.14] 这两个Token
    // 目前支持例如：【3.14， -3.14， 。14，-。14， 3.，-3.】的表示
    let c: string = this._getChar()
    // 预先判断是不是负数
    let isNegate: boolean = (c === '-') // 是不是负数
    let consumed: boolean = false;
    // 获得0的ASCII编码，使用了字符串的charCodeAt实例方法
    let ascii0 = '0'.charCodeAt(0)
    // 只能进来3种类型的字符：[-, ., 数字]
    do {
      // 将当前的字符添加到Token中
      token.addChar(c)
      // 如果当前的字符是.的话，设置为浮点数类型
      if (c === '.') {
        isFloat = true
      } else if (c !== '-') {
        // 十进制从字符到浮点数的转换算法
        // 否则如果不是一负号的话，说明是数字（代码运行到这里已经将点和负号操作符都排拆掉了，仅可能是数字）
        // 这里肯定是数字了，获取当前的数字字符的ASCII编码
        let ascii:number = c.charCodeAt(0)
        let vc:number = ascii - ascii0
        if (!isFloat) {
          // 整数部分算法，10倍递增，因为十进制
          val = 10 * val + vc
        } else {
          // 小数部分算法
          val = val + scaleValue * vc;
          // 10倍递减
          scaleValue *- 0.1
        }
      }
      // 上面循环中的代码没有读取并处理过字符，之所以使用consumed变量，是为了探测下一个字符
      if (consumed === true) {
        this._getChar()
      }
      // 获得下一个字符后，才设置 consumed为true
      c = this._peekChar()
      consumed = true
      // 结束条件：数据源解析全部完成，或下一个字符即不是数字也不是小数掉（如果是浮点数表示的话）
    } while(c.length > 0 && (this._isDigit(c) || (!isFloat && c === '.'))) 
    // 如果是负数，要取反
    if (isNegate) {
      val =- val
    }
    // 设置数字值和Number类型
    token.setVal(val)
  }

  // Doom3文本文件格式中的标识符是由带一对单引号或双引号的字符串组成，因此也需要一个方法来解析这种情况
  private _getSubstring(token: Doom3Token, endChar: string): void {
    let end:boolean = false
    let c:string = '';
    token.setType(ETokenType.STRING)
    do {
      // 获取字符
      c = this._getChar()
      // 如果当前字符是结束符（要么是 \", 要么是\'）
      if(c === endChar) {
        end = true // 结束符
      } else {
        token.addChar(c)
      }
      // 结束条件：数据源解析全部完成或遇到换行符（子串不能多行表示）或是结束符号
    } while (c.length > 0 && c !== '\n' && !end)
  }

  // 进入该函数，说明肯定不是数字，不是单行注释，不是多行注释，也不是字符串
  // 进入该函数只能有两种类型的字符串，即不带双引号或单引号的字符串及 specialChar
  private _getString(token: Doom3Token): void {
    // 获取当前字符，因为前面已经判断为字符串了
    let c:string = this._getChar()
    token.setType(ETokenType.STRING)
    // 进入循环
    do {
      // 将当前的char添加到Token中
      token.addChar(c)
      if (!this._isSpecialChar(c)) {
        c = this._getChar()// 只有不是特殊字符的字符，才调用—_getChar移动当前索引
      }
      // 如果this._isPecialChar(c)为true,不会调用_getChar()函数，并且满足了跳出while循环的条件
      // 结束条件，数据源解析全部完成，或下一个是空白符或者字符是特殊符号
    } while(c.length > 0 && !this._isWhitespace(c) && !this._isSpecialChar(c))
    this._isSpecialChar(c)
  }

  // 将左边和右边的大、中、小括号及点号，逗号都当作当读的Token进行处理
  // 如果要增加更多的标点作为 Token，可以在本函数中进行添加
  private _isSpecialChar(c:string): boolean {
    switch(c) {
      case '(':
        return true;
      case ')':
        return true;
      case '[':
        return true;
      case ']':
        return true
      case '{':
        return true
      case '}':
        return true
      case ',':
        return true
      case '.':
        return true
    }
    return false
  }
}

// 使用静态方法，增加一个工厂类，用于创建 IDoom3Tokenizer 接口
// 该工厂需要被调用方法使用，因此export导出
export class Doom3Factory {
  // 注意返回的是 IDoom3Tokenizer 接口，而不是 Doom3Tokenizer 实现类
  // static 是一个静态方法 ，可以直接调用静态方法，如：Doom3Factory.createDoom3Tokenizer
  // 但是在接口中，不能声明静态方法或属性
  public static createDoom3Tokenizer(): IDoom3Tokenizer {
    let ret:IDoom3Tokenizer = new Doom3Tokenizer()
    return ret
  }
}

// 枚举类型，可以转化成迭代器的形式输出
export interface IEnumerator <T> {
  // 将迭代器重置为初始位置
  reset(): void
  // 如果没越界，moveNext 将 current 设置为下一个元素，并返回 true
  // 如果已越界，moveNext 返回false
  moveNext(): boolean;
  // 只读属性，用于获取当前的元素，返回范性 T
  readonly current: T;
}

// 接口扩展和类扩展一样，都是使用extends关键字
// 类实现接口，则使用 implements 关键字
// 注意，IEnumerator 中的范型在 extends 时替换成了 IDoom3Token 类型
export interface IDoom3Tokenizer extends IEnumerator <IDoom3Token> {
  // 只需要保留 setSource 接口方法
  setSource(source: string): void;
}