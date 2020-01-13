import '@babel/polyfill'
import './styles/index.scss'
import variable from '../__mocks__/globalVariable'

// 挂载html
const html = require('./assets/newindex.html')
loadHtml(html)

function loadHtml(html) {
  let frame = document.createElement('iframe');
  document.getElementById("app").appendChild(frame)

  addGlobalScript(frame.contentDocument, "./js/jquery")
  // 挂载全局变量
  Object.assign(frame.contentWindow, variable)
  // 写入html

  frame.contentDocument.open();
  frame.contentDocument.write(html);
  frame.contentDocument.close();
}

function addGlobalScript(doc, src) {
  let script = doc.createElement("script")
  script.type = "text/javascript";
  script.src = src;
  // doc.getElementsByTagName('head')[0].appendChild(script)
}
