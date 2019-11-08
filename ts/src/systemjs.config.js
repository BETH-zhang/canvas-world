(function (global) {
  System.config({
    transpiler: 'typescript',
    package: {
      '/': {
        defaultExtension: 'ts'
      }
    },
  })
  //   System
  //     .import('./main.ts')
  //     .then(null, console.error.bind(console))
  //   System
  //     .import('./test/doom3TokenizerTest.ts')
  //     .then(null, console.error.bind(console))
  //   System
  //     .import('./test/asyncAjaxTest.ts')
  //     .then(null, console.error.bind(console))
  System
  .import('./canvas/requestAnimationFrame.ts')
  .then(null, console.error.bind(console))

})(this)