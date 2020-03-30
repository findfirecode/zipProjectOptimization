# 说明
活动页开发极其麻烦,需要将代码嵌入到java项目中,降低了前端开发人员的效率,并且无法多人协作.,该项目将启动一个node服务去载入活动页,使用git对活动包进行版本控制,并提供热重载,自动打包功能等.

## 安装nodejs
https://nodejs.org/en/download/

## 项目初始化
#### 初始化依赖
```
npm run install
```

#### 准备
将代码包(zip文件)放在项目根目录

> 注意: 项目根目录下只能保持一个zip文件
> 替换根目录下的zip文件后,需要重新执行npm run unzip,否则内容不变

#### 解压源代码
```
npm run unzip
```

#### build
```
npm run build
```

## 启动项目
```
npm run dev
```

* * *

> 以上操作按顺序执行,并且只需要执行一次

## 打包
执行命令.
```
npm run zip
```
生成文件在outputzip目录下,可以找到自动打包过后的zip

## 分支规则

* 不要直接在master修改
* 从master新拉分支,分支名为代码包名




