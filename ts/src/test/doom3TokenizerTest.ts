
import { Doom3Factory, ETokenType, IDoom3Tokenizer } from '../canvas/doom3Tokenizer.ts'

let input: string = "[3.14, -3.14, .14, -.14, 3., -3., +3.14]"

const tokenizer: IDoom3Tokenizer = Doom3Factory.createDoom3Tokenizer();
// const tokenizer = Doom3Factory.createDoom3Tokenizer()
console.log('tokenizer: ', tokenizer)
tokenizer.setSource(input)
console.log('tokenizer.moveNext()', tokenizer.moveNext())
console.log('tokenizer.current', tokenizer.current)
while (tokenizer.moveNext()) {
    console.log(tokenizer.current, tokenizer.current.type)
    if (tokenizer.current.type === ETokenType.NUMBER) {
        console.log('～～～～～Number: ', tokenizer.current, tokenizer.current.getFloat())
    } else {
        console.log('～～～～～String: ', tokenizer.current, tokenizer.current.getString())
    }
}



// import { IDoom3Token, IDoom3Tokenizer, Doom3Factory, ETokenType } from '../canvas/doom3Tokenizer.ts'

// let str: string = `
//   numMeshed 5
//   /*
//   * joints 关键字定义了骨骼动画的bindPose
//   */

//   joints {
//       'origin' -1 (0 0 0)(-0.5 -0.5 -0.5)
//                 0 (-12.1038131714 0 79.004776001)(-0.5 -0.5 -0.5)
//       // origin
//   }
// `

// // 从Doom3Factory工厂创建IDoom3Tokenizer接口
// let tokenizer: IDoom3Tokenizer = Doom3Factory.createDoom3Tokenizer();
// // IDoom3Tokenizer接口创建IDoomToken接口
// let token: IDoom3Token = tokenizer.createDoom3Token();

// // 设置IDoom3Tokenizer要解析的数据源
// tokenizer.setSource(str)

// // getNextToken函数返回true，说明没有到达字符串的结尾，仍有Token需要解析
// // 解析的结果以传引用的方式从参数token中传出来
// // 如果getNextToken返回false，说明已经到达字符串结尾，刚停止循环
// while(tokenizer.getNextToken(token)) {
//     // 如果当前的Token的type是Number类型
//     if (token.type === ETokenType.NUMBER) {
//         console.log('NUMBER: ' + token.getFloat())
//         // 输出该数字的浮点值
//     } else if (token.isString('joints')) {
//         // 如果当前Token是字符串类型，并且其值为joints，则输出
//         console.log('开始解析joints数据')
//     } else {
//         // 否则获取当前Token的字符串值
//         console.log('STRING: ' + token.getString())
//     }
// }