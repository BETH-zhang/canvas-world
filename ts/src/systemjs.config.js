(function (global) {
  // 模块加载器配置
  System.config({
    transpiler: 'typescript',
    package: {
      '/': {
        defaultExtension: 'ts'
      }
    },
  })
    // System
    //   .import('./main.ts')
    //   .then(null, console.error.bind(console))
  //   System
  //     .import('./test/doom3TokenizerTest.ts')
  //     .then(null, console.error.bind(console))
    // System
    //   .import('./test/asyncAjaxTest.ts')
    //   .then(null, console.error.bind(console))
  // System
  // .import('./test/requestAnimationFrameTest.ts')
  // .then(null, console.error.bind(console))
  // System
  //   .import('./test/testThis.ts')
  //   .then(null, console.error.bind(console))
  // System
  //   .import('./test/applicationTest.ts')
  //   .then(null, console.error.bind(console))
  System
    .import('./test/testCanvasApplication.ts')
    .then(null, console.error.bind(console))
})(this)