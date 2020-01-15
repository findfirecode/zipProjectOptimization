const path = require('path')
const config = require('./webpack.config.js')

config.devServer = {
  historyApiFallback: true,
  open: true,  //自动打开浏览器
  contentBase: path.join(__dirname, '../build'),
  port: 3000,
}

config.devtool = 'inline-source-map'

module.exports = config
