import '@babel/polyfill'
import $ from 'jquery';
import axios from 'axios'
import mockFun from '../__mocks__/globalFun'

// 挂载全局变量
const variable = require('../__mocks__/globalVariable.json')
Object.assign(window, variable)
Object.assign(window, mockFun)
window.axios = axios

// 挂载html
const html = require(`./assets/${variable.sourseDir}.html`)
$('#app').html(html)

