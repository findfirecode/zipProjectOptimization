const fs = require('fs')

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

module.exports = {
  clearDir,
  creatDir,
  deletDir
}