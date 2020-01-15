import '@babel/polyfill'
import './styles/index.scss'
import $ from 'jquery';
import './styles/index.scss'
import variable from '../__mocks__/globalVariable'

// 挂载全局变量
Object.assign(window, variable)
// Object.assign(window, $)
window.$ = $

// 挂载html
const html = require('./assets/newindex.html')
$('#app').html(html)
