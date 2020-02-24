const babel = require("@babel/core");
const fs = require('fs')
const compressing = require('compressing')
const pathFn = require("path")
const ctFiles = [
    "jScript"
]

const jsonPath = pathFn.resolve('./__mocks__/globalVariable.json')
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

    paths.forEach(function (path) {
        var _src = src + '\\' + path;
        var _dst = dst + '\\' + path;

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

const creatDir = function (dst) {
    // 验证是否有文件权限
    if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst);
    }
}
const compossZipDir = function () {
    if (!fs.existsSync(`./${outputPath}`)) {
        fs.mkdirSync(`./${outputPath}`);
    }

    // 清空之前的zip
    const zipName = fs.readdirSync("./outputZip").find(filename => { return filename.match(/\.zip$/) })
    zipName && fs.unlinkSync(pathFn.resolve(`./${outputPath}/${zipName}`))

    compressing.zip
        .compressDir(pathFn.resolve(distDir), pathFn.resolve("./", outputPath, sourseName))
        .then(() => {
            console.log("zip 压缩成功");
        })
        .catch(err => {
            console.log(chalk.red("Tip: 压缩报错"))
            console.error(err)
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
const deletDir = function (fileUrl) {
    clearDir(fileUrl)
    if (fs.existsSync(fileUrl)) fs.rmdirSync(fileUrl)
}


if (!fs.existsSync(pathFn.resolve(distDir))) {
    console.log("请放入源代码并且执行npm unzip");
} else {
    // 清空并删除文件
    clearDir(pathFn.resolve(distDir))
    copyFile(pathFn.resolve(root), pathFn.resolve(distDir));
    compossZipDir()

}
