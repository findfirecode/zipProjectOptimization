import '@babel/polyfill'
import './styles/index.scss'  

// document.getElementById('App').innerHTML = fs.createReadStream('./assets/newindex.html')
const html = require('./assets/newindex.html')
document.body.innerHTML = html