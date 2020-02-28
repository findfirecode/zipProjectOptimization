const fs = require('fs')
const babel = require("@babel/core")
const path = require("path")

const clearDir = function (fileUrl) {
  if (!fs.existsSync(fileUrl)) return

  const files = fs.readdirSync(fileUrl);//读取该文件夹
  files.forEach(function (file) {
    let filePath = fileUrl + '\\' + file
    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      clearDir(filePath)
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  })
}

const creatDir = function (dst) {
  // 验证是否有文件权限
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst);
  }
}

const deletDir = function (fileUrl) {
  clearDir(fileUrl)
  if (fs.existsSync(fileUrl)) fs.rmdirSync(fileUrl)
}

const copyFile = function (src, dst, convertDir) {
  let paths = fs.readdirSync(src); //同步读取当前目录

  paths.forEach(function (dirPath) {
    var _src = src + '\\' + dirPath;
    var _dst = dst + '\\' + dirPath;

    let stats = fs.statSync(_src)
    if (stats.isFile()) { //如果是个文件则拷贝 
      
      if (convertDir.length && !_src.match(/jsp$/) &&convertDir.filter(name => _src.match(name)).length) {
      console.log(3, _src);
        let transformCode = babel.transformFileSync(_src, {
          presets: ["@babel/preset-env"],
        }).code
        fs.writeFileSync(_dst, transformCode)
      } else {
        fs.copyFileSync(_src, _dst)
      }
    } else if (stats.isDirectory()) { //是目录则 递归 
      creatDir(_dst)
      copyFile(_src, _dst, convertDir)
    }
  });
}

const getTargetDirObj = function () {
  const variableString = fs.readFileSync(path.resolve('./src/dependence/json/compress.json'), 'utf-8')
  return JSON.parse(variableString)
}

module.exports = {
  clearDir,
  creatDir,
  deletDir,
  copyFile,
  getTargetDirObj
}