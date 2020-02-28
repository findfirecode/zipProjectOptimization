import '@babel/polyfill'
import $ from 'jquery';

// 挂载全局变量
const variable = require('../__mocks__/globalVariable.js')

Object.assign(window, variable)

// 挂载html
if (variable.sourseDir) {
  const html = require(`./assets/${variable.sourseDir}.html`)
  $('#app').html(html)
}


