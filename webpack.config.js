// const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const package = require('./package')

module.exports = {
	mode: 'production',
 	entry: {
 		index: './src/elves.js'
 	},
 	output: {
 		filename: 'elves.min.js',
 		path: path.resolve(__dirname, 'dist'),
    library: 'Elves',
 		libraryTarget: 'umd'
	},
	externals: _externals(),
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader'
			},
		]
	},
 }

function _externals() {
  const exs = {}
	const externals = [
    'lodash',
    'us-common-utils'
  ]
	externals.forEach(ex => {
    exs[ex] = {
      commonjs: ex,
      commonjs2: ex,
      amd: ex
    }
  })

  return exs
}