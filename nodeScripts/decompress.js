const compressing = require('compressing')
const path = require("path")
const fs = require('fs')
const { clearDir , creatDir , deletDir, copyFile, getTargetDirName } = require("./util")

const proFiles = fs.readdirSync("./")
const sourseName = proFiles.find(filename => { return filename.match(/\.zip$/) })
const sourseDirName = sourseName.match(/(.*)\.zip$/)[1]

function writeTargetProjectName() {
  let variable = getTargetDirName()
  variable.sourseDir = sourseDirName
  fs.writeFileSync(path.resolve('./__mocks__/globalVariable.json'), JSON.stringify(variable, "", "\t"))
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
      writeTargetProjectName()
      console.log("解压成功")
    })
    .catch(err => {
      console.log("解压失败", err);
    })
}

main()