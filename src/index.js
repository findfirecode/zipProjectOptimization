import '@babel/polyfill'
import $ from 'jquery';
import variable from '../__mocks__/globalVariable'

// 挂载全局变量
Object.assign(window, variable)
window.$ = $

// 挂载html
const html = require('./assets/newindex.html')
$('#app').html(html)
