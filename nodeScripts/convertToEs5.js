const babel = require("@babel/core");
const fs = require('fs')
const compressing = require('compressing')
const path = require("path")
const { clearDir , creatDir , deletDir, copyFile, getTargetDirObj } = require("./util")

const variable = getTargetDirObj()
// 获取资源文件名
const sourseName = variable.sourseDir + ".zip"

// 设置根目录
const root = "src/assets"
const outputPath = "outputZip"
// 设置目标目录
const distDir = outputPath + "/" + sourseName.match(/(.*)\.zip$/)[1]

const compossZipDir = function () {
    if (!fs.existsSync(`./${outputPath}`)) {
        fs.mkdirSync(`./${outputPath}`);
    }

    compressing.zip
        .compressDir(path.resolve(distDir), path.resolve("./", outputPath, sourseName))
        .then(() => {
            console.log("zip 压缩成功");
        })
        .catch(err => {
            console.log(chalk.red("Tip: 压缩报错"))
            console.error(err)
        })
}

function main() {
    if (!variable.sourseDir) {
        console.log("请放入源代码并且执行npm unzip");
    } else {
        // 删除缓存zip
        const reseultPath = path.resolve(`${outputPath}/${sourseName}`)
        if (fs.existsSync(reseultPath)) fs.unlinkSync(reseultPath)
        creatDir(path.resolve(distDir))
        // 清空并删除缓存文件夹
        clearDir(path.resolve(distDir))
        copyFile(path.resolve(root), path.resolve(distDir), variable.convertDir);
        compossZipDir()
    }
}

main()