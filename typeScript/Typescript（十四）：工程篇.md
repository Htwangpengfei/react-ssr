# tsconfig介绍

- 文件选项
- 编译选项
- 工程引用

### 文件选项
- 基本的文件选项有：files、include、exclude
```json
{
    //编译器需要编译的单文件列表
    "files": [
        "a.ts"
    ],
    //编译器需要编译的文件或者目录
    "include": [
        "module"
    ],
    //编译器需要排除编译的文件或者目录,默认ts会排除node_modules文件和所有的声明文件
    "exclude": [
        "module/node"
    ]
}
```
- 另外配置文件之间是可以继承的，我们可以把一些基础的配置抽离出来，方便复用
```json
{
    "extends": "./tsconfig.base.json",
    "exclude": []
}
```
### 编译选项
- 示例一

```json
{
	"compilerOptions": {
		"incremental": true, //增量编译，打开增量编译后会产出一个增量编译的信息文件tsconfig.tsbuildinfo
		"diagnostics": true, //打印诊断信息
		"tsBuildInfoFile": "./buildFile", //增量编译文件存放位置
		"outFile": "./app.js", //将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中
	}
}
```

增量编译对比
前：
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-a32ce85e43276791d600e0c2bd511378820bea8d)
后：
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-c34d2e0ed9f55da46d55e5a69d657ed4e26780f9)

- 示例二
```json
{
	"compilerOptions": {
		"target": "es5",// 目标版本
		"module": "commonjs"， //模块标准
		"outFile": "./app.js", //将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中
		"lib": ["dom", "es5", "scripthost"], // ts需要引用的一些类库，声明文件，如果我们不指定的话，也会默认导入一些类库
		
	}
}
```
- 示例三（类型检查相关）
```json
{
	"compilerOptions": {
		"strict": true /* strict的值为true或false，用于指定是否启动所有类型检查，如果设为true则会同时开启下面这几个严格类型检查，默认为false */,
    "noImplicitAny": true,                 /* noImplicitAny的值为true或false，如果我们没有为一些值设置明确的类型，编译器会默认认为这个值为any，如果noImplicitAny的值为true的话。则没有明确的类型会报错。默认值为false */
    "strictNullChecks": true,              /* strictNullChecks为true时，null和undefined值不能赋给非这两种类型的值，别的类型也不能赋给他们，除了any类型。还有个例外就是undefined可以赋值给void类型如： */
    "strictBindCallApply": true, /* 设为true后会对bind、call和apply绑定的方法的参数的检测是严格检测的 */
    "noImplicitThis": true,                /* 当this表达式的值为any类型的时候，生成一个错误 */
    "alwaysStrict": true,                  /* alwaysStrict的值为true或false，指定始终以严格模式检查每个模块，并且在编译之后的js文件中加入"use strict"字符串，用来告诉浏览器该js为严格模式 */
	}
}
```
- 示例四（[模块解析策略](http://agroup.baidu.com/share/md/a1c8c1742703444aac5ddd808619fe3c)相关）
```json
{
	"compilerOptions": {
	    "rootDirs": ["src", "out"], //可以将多个目录放在一个虚拟目录下，方便运行时访问
		"moduleResolution": "node",            /* 用于选择模块解析策略，有'node'和'classic'两种类型' */
    "baseUrl": "./",                       /* baseUrl用于设置解析非相对模块名称的基本目录，相对模块不会受baseUrl的影响 */
    "paths": {},                           /* 用于设置模块名称到基于baseUrl的路径映射 */
	}
}
```

- rootDirs:
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-72be662818386f2d83e748a4dd64f38b0b70ee02)
```
"rootDirs": [
      "src/views",
      "generated/templates/views"
    ]   
```
- baseUrl、paths:
```
"baseUrl": ".", //解析非相对模块的基地址
    "paths": {
      "jquery": ["../../node_modules/jquery/dist/jquery"] //相对于baseUrl的路径映射
    }
```

### 工程引用

```json
{
	"composite": true,//开启表示工程可以被引用&开启增量编译
    "declaration": true，//composite为true时，该项必须开启
    "references": [
        { "path": "../src" }
    ]
}
```

**优点：**
- 解决了输出目录结构的问题
- 可以构建单个工程构建，同时可以解决依赖的问题
- 通过增量编译提升了构建速度

>typescript项目已经使用工程引用优化过了，我们可以参考[typescript](https://github.com/microsoft/TypeScript/blob/master/src),另附[tsconfig部分说明](http://agroup.baidu.com/share/md/ba19d24644504edd86c54f57c091c2bf),及[tsconfig官方完整版](http://json.schemastore.org/tsconfig)


# 编译工具

相关工具ts-loader（官方）、awsome-typescript-loader（第三方开发者，不太推荐）、babel

### [ts-loader](https://www.npmjs.com/package/ts-loader#transpileonly)内部实际是调用的tsc的编译，共享tsconfig，ts-loader自己的配置项目放在options中，这里主要介绍一个选项:transpileOnly
```
{
     test: /\.tsx?$/i,
     use: [{
         loader: 'ts-loader',
         options: {
             transpileOnly: false//做语言转换的同时做类型检查
         }
     }],
     exclude: /node_modules/
 }
```
### [awsome-typescript-loader](https://www.npmjs.com/package/awsome-typescript-loader)，它与ts-loader的区别：

- 更适合与babel集成，使用babel的转义和缓存
- 不需要装额外的插件，类型检查放在独立进程中进行
- 缺点：类型检查存在遗漏

### 对比
- ts-loader
transpileOnly:false
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-a79039130d1dba7a9bace5408532cc6a9ca92e3a)
transpileOnly:true
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-fffc17d01d8ffc2a822afb95dd916107d0fc42f7)
- awesome-typescript-loader
transpileOnly:false
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-638cf2f055566293e447f32be5770949fb7d5faa)
transpileOnly:true
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-1085274e354eddfbc1f0d7b3f52ef532cd4eea15)

### babel：@babel/preset-typescript
>babel7之后支持了ts，这样就不需要各种loader了，babel借助ts的类型检查,babel只做语言转换，ts做类型检查

.babelrc配置如下：
```
{
    "presets": [
        "@babel/env",
        "@babel/preset-typescript"
    ],
    "plugins": [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
}
```
**babel中使用ts需要注意的事项（有4种语法在babel中是无法编译的）：**

- 命名空间
- 类型断言，babel只支持 as 方式,实际测试`<string>`也可以编译通过
- 常量枚举
- 默认导出

**建议**：

- 没有使用babel的项目首选typescript自身的编译器配合ts-loader使用
- 使用了babel的可以使用@babel/preset-typescript配合tsc做类型检查
- 两种不要混用

# 代码检查工具

>目前有两种代码检查工具： tslint、eslint，但ts官方后来决定将tslint向eslint迁移一个是tslint自身存在一些问题，另一个是使用eslint的比较多

![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-4310e7ea61d629d75df1b63973af49ec33841e04)

1. typescript会做类型检查、语言转换也会对一些语法错误进行检查；
2. eslint主要做检查语法，保证代码风格的统一

**这里推荐：typescript-eslint，配置 如下**

```
{
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "parserOptions": {
        "project": "./tsconfig.json"//有的规则需要使用类型信息的时候，使用tsconfig
    },
    "extends": [
        "plugin:@typescript-eslint/recommended"//指定规则
    ]
}
```
**如何配置自己的规则（[支持的规则配置](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)）：**

```json
 "rules": {
      "@typescript-eslint/no-inferrable-types": "off"
  }
```
**babel的eslint**

配置根目录下的文件.eslintrc,[如何配置](https://eslint.bootcss.com/docs/user-guide/configuring)

**对比：**
typescript-eslint: 基于typescript的AST，支持创建基于类型信息的规则：tsconfig.json

babel-eslint： 支持typescript没有的额外的语法检查，不支持类型检查

**建议：**
两者不要一起使用，如果项目中严重依赖babel的话可以使用babel-eslint，否则的话建议使用typescript-eslint

# 单测工具

以jest为例介绍两个工具ts-jest、babel-jest：

**ts-jest**
依赖按照ts-jest、@types/jest、jest
初始化config文件：`ts-jest config:init`,如何[指定配置](https://kulshekhar.github.io/ts-jest/user/config/tsConfig)
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```
新建test目录中，编写测试用例
```
//math.ts
function add(a: number, b: number) {
    return a+b;
}
function sub(a: number, b: number) {
    return a-b;
}
module.exports = {
    add,
    sub
}
```

```
const math = require('../math')

test('add: 1 + 1 = 2', () => {
    expect(math.add1(1, 1)).toBe(2);
})

test('add: 1 - 2 =-1', () => {
    expect(math.sub1(1, 2)).toBe(-1);
})
```
**babel-jest：**
需要安装：jest、babel-jest、@types/jest
配置babelrc文件编译ts文件,运行上一个例子中的测试用例即可

**对比：**
ts-jest:优势自身支持类型检查
babel-jest：自身不支持类型检查，需要结合tsc


#总结

![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-8d07a38138a3b4348ce344e526aaccdb41077300)