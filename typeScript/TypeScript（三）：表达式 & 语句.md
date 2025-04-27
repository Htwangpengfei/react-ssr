# TypeScript（三）：表达式 & 语句

本文档为javascript基础学习文档，主要介绍javascript中的表达式和语句。

## 前言

```javascript { .theme-peacock }
// hello.js

function(){}        //报错
(function(){})      //不报错
(function(){}())    // 不报错
function f(x){ return x + 1 }()    //报错
function f(x){ return x + 1 }(1)   //不报错

```
为什么？

## 表达式

> 表达式，是由数字、运算符、数字分组符号（括号）、自由变量和约束变量等以能求得数值的有意义排列方法所得的组合。------百度百科

### JavaScript中的表达式

**js 中的一个短语，js 解释器会将其计算出一个结果。**

程序中的常量是最简单的一类表达式。

变量名也是一种简单的表达式，它的值就是赋值给变量的值；复杂表达式是由简单表达式组成的。

将简单表达式组合成复杂表达式最常用的方法就是使用运算符（opetator）。

#### 示例

JavaScript中存在非常多种形式的表达式，如

* 函数表达式
* 类表达式
* 字面量
* 运算符

> 参考文献：[表达式和运算符-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators)

```javascript { .theme-peacock }
// expression-1.js

// 数据访问
a = array[0];

// 解构赋值
[a, b] = [10, 20]

// this
this.b = "MDN"

// 对象
obj = {}

// 类表达式
Foo = class {
  constructor() {}
  bar() {
    return "Hello World!";
  }
}

// 函数表达式
count = function (a, b) {
   return a + b;
}

// 函数调用
count(1, 2)
```


### TypeScript中的表达式

```javascript { .theme-peacock }
// expression-2.ts

// 函数表达式
count = function (a: number, b: number): nunber {
   return a + b;
};
```


## 语句

JavaScript 应用程序是由许多语法正确的语句组成的。js 语句是以分号结束；单个语句可以跨多行。如果每个语句用分号隔开，那么多个语句可以在一行中出现。

> 参考文献：[语句和声明-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements)

### JavaScript中的语句

JS中主要存在以下类型的语句

* 控制流程语句
* 声明语句
* 函数和类语句
* 迭代器
* 其他

```javascript { .theme-peacock }
// statement-1.js

// 块声明
{
  var x = 2;
}

// 循环语句
for (var i = 0; i < 9; i++) {
   console.log(i);
}

// 变量声明
var a;
var a = 1;

// 函数声明
function count(a, b) {
	return a + b;
}

// 匿名函数声明  会报错，参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function
function (a, b) {
	return a + b;
}

// 类声明
class Polygon {
	constructor(height, width) {
		this.area = height * width;
	}
}

```

### TypeScript中的语句

```javascript { .theme-peacock }
// statement-2.ts

// 变量声明
let a;
const a = 1;

// 函数声明
function count(a: number, b: number): number {
	return a + b;
}

// 类声明
class Polygon {
	area: number;
	constructor(readonly height: number, readonly width: number) {
		this.area = height * width;
	}
}

// 枚举
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

// 接口
interface LabelledValue {
  label: string;
}

// 命名空间
namespace Validation {
}

// 声明
declare module Runoob { 
   export class Calc { 
      doSum(limit: number): number; 
   }
}

```

## 表达式和语句的关系

1. 一个表达式会产生一个值,它可以放在任何需要一个值的地方
2. 语句是由分号分隔的句子或命令
3. 语句不能作为函数的参数，表达式可以；
4. 表达式是构成语句的一部分

```javascript { .theme-peacock }
// diff.js

a = 1   // 表达式：赋值表达式
a = 1;  // 语句：增加分号的语句

var fn;  // 语句：声明语句
fn = function () {}  // 表达式：函数表达式
var fn = function () {}  // 语句：由一个声明语句 + 函数表达式构成
function fn () {}   // 语句：函数声明语句

if (true) return;  // 语句：条件语句

```

## 前言问题解答

```javascript { .theme-peacock }
// hello.js

function(){}        //报错
(function(){})      //不报错
(function(){}())    // 不报错
function f(x){ return x + 1 }()    //报错
function f(x){ return x + 1 }(1)   //不报错

```

1.  `hello.js:3`  function开头是语句，js不允许匿名语句
2. `hello.js:4`  ()是表达式，表达式的值为一个函数
3. `hello.js:5`  表达式，值为undefined
4. `hello.js:5`  语句 + ()表达式，但()表达式为计算出任何值
5. `hello.js:5`  语句 + ()表达式，()表达式的值为1

## 练习

```javascript { .theme-peacock }
{} + []    // 输出

[] + {}   // 输出
```
