# TypeScript（一）：起步

简单来说，TypeScript 就是在 JavaScript 的基础上加了类型束缚

TypeScript 是一个预编译语言。所谓预编译语言，是指想要运行 TypeScript，需要先把 TypeScript 编译成 JavaScript 然后交给浏览器或 Nodejs （JavaScript 运行时）运行的。如果你有用过 SASS 或 Less，应该会预处理语言不陌生，它们也是先由各自的编译器编译为`.css`，然后再由浏览器运行的

## 约定

我们约定如下格式：

在命令行代码中，所有的输入的命令以`$`打头，非`$`打头的则代表命令输出

```bash
$ echo 'hello world' # 命令
hello world # 该命令的输出
```

代码演示中，第一行可能会添加文件名的注释，也可能不添加仅仅是一个代码块演示

```ts
// hello-1.js

console.log('Hello');
```

同时会在代码中添加以`#`+字母打头的注释，来引用具体的一行

```js
// hello-2.js

const msg = 'hello'; // #a
console.log(msg); // #b
```

其中`hello-2.js#b`代表`console.log(msg); `代码行

代码演示中，第一行可能会添加文件名的注释，也可能不添加仅仅是一个代码块演示

```ts
// hello-1.js

console.log('Hello');
```

同时会在代码中添加以`#`+字母打头的注释，来引用具体的一行

```js
// hello-2.js

const msg = 'hello'; // #a
console.log(msg); // #b
```

其中`hello-2.js#b`代表`console.log(msg); `代码行

## 安装 TypeScript

在命令行中运行如下命令来全局安装 TypeScript

```bash
$ npm install typescript -g
$ tsc --help
```

> Tips: 没有 npm？你可能需要先安装 [Node.js](https://nodejs.org/zh-cn/) 运行环境

tsc 命令可以将 `.ts` 文件编译为 `.js` 文件，教程中我们将会频繁使用这个命令来演示

你可能还想在非命令行场景如 Webpack、Vue SFC、TSX 中使用 TypeScript，这些内容我们会放在稍后我们会讲解

## Hello World

接下来我们尝试用 TypeScript 输出一段`hello world`消息

编辑`hello-world.ts`内容为：

```ts
const msg :string = 'hello world';
console.log(msg);
```

保存它，然后在 CLI 中使用 `tsc` 将其编译为 JS 文件后用 Nodejs 运行

```bash
$ tsc hello-world.ts
$ node hello-world.js
```

在执行`tsc`命令后，你会发现该命令没有打印任何日志，这是一个好兆头！接着你会发现生成了与 ts 文件同名的 js 文件，这就是 tsc 的产出——它将 ts 文件编译为了 js 文件

> 练习：使用 ts 实现输出`hello world`

## 配置文件 tsconfig.json

通常来说每一个 TS 项目都需要一个`tsconfig.json`文件，它对与 TS 编译器意义非凡：

1. 指明 TS 项目的根目录，确定编译范围以及全局变量的作用范围
2. 配置 TS 的编译选项

下边是一个比较简单常用的 tsconfig 文件：

```json
{
  "compilerOptions": {
    "downlevelIteration": true,
    "strict": true,
    "module": "commonjs",
    "target": "es5",
    "moduleResolution": "node",
    "lib": ["esnext", "dom"],
    "sourceMap": true
  }
}
```

在项目根目录新建`tsconfig.json`文件，将上边代码拷如其中即可。请读者使用与上方一模一样的 tsconfig ，以确保本教程的例子运行正常

`tsconfig.json`文件中的`compilerOptions`代表编译选项，所有的编译选项既可以在 tsconfig 中配置，也可以在运行 tsc 时指定。比如上边 tsconfig 相当于：

```bash
$ tsc \
--downlevelIteration \
--strict \
--module commonjs \
--target es5 \
--moduleResolution node \
--lib esnext,dom \
---sourceMap
```

回到一开始的 HelloWorld 目录，配置 tsconfig 完成后，我们就解锁了一个新命令：不带参数的 `tsc` 命令

```bash
$ tsc
$ ls
hello-world.js		hello-world.js.map	hello-world.ts		tsconfig.json
```

随着对于 TypeScript 的讲解深入，我们会慢慢引入 tsconfig 的配置参数的讲解

更多详细的 tsconfig 配置，可参考：http://www.tslang.cn/docs/handbook/tsconfig-json.html

## TypeScript 编译器都做了什么

打开由`hello-world.ts`编译得出的`hello-world.js`文件，你会看到 tsc 实际上就是将类型移除，并将代码编译为 ES5 的版本（类似于 Babel）

校验类型，然后移除他们，再将高版本ECMAScript 语法转换成 tsconfig 中`compilerOptions.target`配置的版本。这就是 TypeScript 做的，其实很简单。TypeScript 最终还是要编译成 JavaScript 的，所以无论多么神奇的特性最终都会转换成 JavaScript 的实现

TypeScript 能做的，JavaScript 都能做到。而 JavaScript 能做的，通常来说 TypeScript 可以做的更好

## TypeScript vs JavaScript

TypeScript 转换成 JavaScript 经历了一次类型检查，这意味着可以将编码过程中更多的“运行时问题”变成“编译时问题”，极大的减小 Debug 成本。

同时，由于拥有极强的类型束缚，代码的可维护性得到进一步的提升。毕竟，想把 TypeScript 代码的弄的一团糟可没那么容易，TS 编译器会代表 Code Reviewer 狠狠惩罚那些人

那是否有不适合 TypeScript 的情景呢？有的，当你的项目模块扁平且大多“各干各的”时，引入 TypeScript 只会降低你的开发效率！

![图片](https://agroup-bos.cdn.bcebos.com/e48e5a0a78dbedf1731a7c113990198fd4360487)



