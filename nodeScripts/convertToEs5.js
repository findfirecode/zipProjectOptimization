const babel = require("@babel/core");
const fs = require('fs')
const pathFn = require("path")

// 设置根目录
const root = "../src/assets"
// 设置目标目录
const distDir = "../babelDist"

const copy = function(src, dst){
  let paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function(path){
      var _src = src + '/' + path;
      var _dst = dst + '/' + path;
      fs.stat(_src, function(err, stats){  //stats  该对象 包含文件属性
          if(err)throw err;
          if (_src.indexOf(".js") > 0) {
            const transformCode = babel.transformFileSync(_src, {
                presets:  ["@babel/preset-env", "vue"],
            }).code
            fs.writeFileSync(_dst, transformCode)
          }else if(stats.isFile()){ //如果是个文件则拷贝 
              let  readable = fs.createReadStream(_src);//创建读取流
              let  writable = fs.createWriteStream(_dst);//创建写入流
              readable.pipe(writable);
          }else if(stats.isDirectory()){ //是目录则 递归 
              checkDirectory(_src,  _dst , copy);
          }
      });
  });
}
const checkDirectory = function(src,dst,callback){
  // 验证是否有文件权限
  fs.access(dst, fs.constants.F_OK, (err) => {
      if(err){
          fs.mkdirSync(dst);
          callback(src, dst);
      }else{
          callback(src, dst);
      }
    });
};

checkDirectory(pathFn.resolve(root), pathFn.resolve(distDir), copy);