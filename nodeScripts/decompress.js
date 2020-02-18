const compressing = require('compressing')
const path = require("path")
const fs = require('fs')
const sourseName = fs.readdirSync("./").find(filename => { return filename.match(/\.zip$/) })
const sourseDirName = sourseName.match(/(.*)\.zip$/)[1]

const creatDir = function (dst) {
  // 验证是否有文件权限
  if (!fs.existsSync(dst)) {
      fs.mkdirSync(dst);
  }
}
const copyFile = function (src, dst) {
  let paths = fs.readdirSync(src); //同步读取当前目录

  paths.forEach(function (path) {
    var _src = src + '\\' + path;
    var _dst = dst + '\\' + path;

    fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
      if (stats.isFile()) { //如果是个文件则拷贝 
        fs.renameSync(_src, _dst)
      } else if (stats.isDirectory()) { //是目录则 递归 
        creatDir(_dst)
        copyFile(_src, _dst)
      }
    })
  })
}
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

clearDir(path.resolve("./src/assets"))
compressing.zip.uncompress(path.resolve(`./${sourseName}`), path.resolve(`./src/assets`))
  .then(() => {
    copyFile(path.resolve(`./src/assets/${sourseDirName}`), path.resolve("./src/assets"))
    console.log("移动成功");
    // clearDir(path.resolve(`./src/assets/${sourseDirName}`))
  })
  .catch(err => {
    console.log("解压失败");
  })