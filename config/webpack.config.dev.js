const path = require('path')
const config = require('./webpack.config.js')

config.devServer = {
  historyApiFallback: true,
  open: true,  //自动打开浏览器
  contentBase: path.join(__dirname, '../build'),
  port: 3000,
  // host: "10.110.6.156",
  proxy: {
    '/api': {
      target: "https://uat.samsungeshop.com.cn",  //开发环境
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}

config.devtool = 'inline-source-map'

module.exports = config
