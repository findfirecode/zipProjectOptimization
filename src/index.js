import '@babel/polyfill'
import $ from 'jquery';

// 挂载全局变量
const variable = require('./dependence/js/mock/globalVariable.js')
const compressJson = require('./dependence/json/compress.json')
Object.assign(window, variable)

// 挂载html
if (compressJson.sourseDir) {
  const html = require(`./assets/${compressJson.sourseDir}.html`)
  $('#app').html(html)
}


