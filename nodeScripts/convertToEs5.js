const babel = require("@babel/core");
const fs = require('fs')
const compressing = require('compressing')
const pathFn = require("path")
const ctFiles = [
    "jScript"
]

// 获取资源文件名
const sourseName = fs.readdirSync("./").find(filename => { return filename.match(/\.zip$/) })
// 设置根目录
const root = "src/assets"
// 设置目标目录
const distDir = sourseName.match(/(.*)\.zip$/)[1]
const outputPath = "outputZip"

const copyFile = function (src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录

    paths.forEach(function (path) {
        var _src = src + '\\' + path;
        var _dst = dst + '\\' + path;

        fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
            // creatDir(_dst)
            if (ctFiles.filter(c => _src.match(c)).length) {
                const transformCode = babel.transformFileSync(_src, {
                    presets: ["@babel/preset-env"],
                }).code
                fs.writeFileSync(_dst, transformCode)
            } else if (stats.isFile()) { //如果是个文件则拷贝 
                // let readable = fs.createReadStream(_src);//创建读取流
                // let writable = fs.createWriteStream(_dst);//创建写入流
                // readable.pipe(writable);
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

    clearDir(pathFn.resolve(outputPath))
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
const deletDir = function(fileUrl) {
    clearDir(fileUrl)

    if (fs.existsSync(fileUrl)) fs.rmdirSync(fileUrl)
}

// creatDir(pathFn.resolve(distDir))
// 清空并删除文件
clearDir(pathFn.resolve(distDir))
copyFile(pathFn.resolve(root), pathFn.resolve(distDir));
compossZipDir()
clearDir(fileUrl)
// deletDir(pathFn.resolve(distDir))
