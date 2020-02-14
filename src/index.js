import '@babel/polyfill'
import $ from 'jquery';
import axios from 'axios'
import variable from '../__mocks__/globalVariable'

// 挂载全局变量
Object.assign(window, variable)
window.$ = $
window.axios = axios

// 挂载html
const html = require('./assets/newindex.html')
$('#app').html(html)
