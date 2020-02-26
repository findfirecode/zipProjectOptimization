const compressing = require('compressing')
const path = require("path")
const fs = require('fs')
const { clearDir , creatDir , deletDir } = require("./util")

const proFiles = fs.readdirSync("./")
const sourseName = proFiles.find(filename => { return filename.match(/\.zip$/) })
const sourseDirName = sourseName.match(/(.*)\.zip$/)[1]

function copyFile(src, dst) {
  let paths = fs.readdirSync(src); //同步读取当前目录

  paths.forEach(function (path) {
    var _src = src + '\\' + path;
    var _dst = dst + '\\' + path;

    let stats = fs.statSync(_src)
    if (stats.isFile()) { //如果是个文件则拷贝 
      fs.renameSync(_src, _dst)
    } else if (stats.isDirectory()) { //是目录则 递归 
      creatDir(_dst)
      copyFile(_src, _dst)
    }
  })
}


function writeTargetProjectName() {
  const jsonPath = path.resolve('./__mocks__/globalVariable.json')
  const variableString = fs.readFileSync(jsonPath, 'utf-8')
  const variable = JSON.parse(variableString)
  variable.sourseDir = sourseDirName
  fs.writeFileSync(jsonPath, JSON.stringify(variable, "", "\t"))
}

function main() {
  clearDir(path.resolve("./src/assets"))

  if (proFiles.filter(name => name.match(/\.zip$/)).length > 1) {
    console.log('请保证项目目录下只有一个zip包');
    return
  }

  const assFilePath = path.resolve(`./src/assets`)
  compressing.zip.uncompress(path.resolve(`./${sourseName}`), assFilePath)
    .then(() => {
      copyFile(path.resolve(`./src/assets/${sourseDirName}`), assFilePath)
      deletDir(path.resolve(`./src/assets/${sourseDirName}`))
      creatDir(path.resolve(`./outputZip/${sourseDirName}`))
      writeTargetProjectName()
      console.log("解压成功")
    })
    .catch(err => {
      console.log("解压失败");
    })
}

main()