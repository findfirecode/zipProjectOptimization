import '@babel/polyfill'
import './styles/index.scss'
import variable from './environment/js/globalVariable'

// 挂载全局变量
Object.assign(window, variable)

// 挂载html
const html = require('./assets/newindex.html')
document.getElementById("app").innerHTML = html
