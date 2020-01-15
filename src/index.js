import '@babel/polyfill'
import './styles/index.scss'  
import $ from 'jquery';

window.$ = $
window.base = "https://stage.samsungeshop.com.cn/"
// document.getElementById('App').innerHTML = fs.createReadStream('./assets/newindex.html')
const html = require('./assets/newindex.html')
$('#App').html(html)