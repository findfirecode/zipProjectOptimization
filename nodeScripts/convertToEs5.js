const babel = require("@babel/core");
const fs = require('fs')
const compressing = require('compressing')
const path = require("path")
const { clearDir , creatDir , deletDir } = require("./util")
const ctFiles = [
    "jScript"
]

const jsonPath = path.resolve('./__mocks__/globalVariable.json')
const variableString = fs.readFileSync(jsonPath, 'utf-8')
const variable = JSON.parse(variableString)

// 获取资源文件名
const sourseName = variable.sourseDir + ".zip"

// 设置根目录
const root = "src/assets"
const outputPath = "outputZip"
// 设置目标目录
const distDir = outputPath + "/" + sourseName.match(/(.*)\.zip$/)[1]

const copyFile = function (src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录

    paths.forEach(function (dirPath) {
        var _src = src + '\\' + dirPath;
        var _dst = dst + '\\' + dirPath;

        fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
            if (ctFiles.filter(c => _src.match(c)).length) {
                const transformCode = babel.transformFileSync(_src, {
                    presets: ["@babel/preset-env"],
                }).code
                fs.writeFileSync(_dst, transformCode)
            } else if (stats.isFile()) { //如果是个文件则拷贝 
                fs.copyFileSync(_src, _dst)
            } else if (stats.isDirectory()) { //是目录则 递归 
                creatDir(_dst)
                copyFile(_src, _dst)
            }
        });
    });
}


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
        creatDir(path.resolve(distDir))
        // 清空并删除文件
        clearDir(path.resolve(distDir))
        copyFile(path.resolve(root), path.resolve(distDir));
        compossZipDir()
    }
}

main()