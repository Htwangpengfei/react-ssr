# TypeScript（五）：接口

本章开始主要介绍TypeScript中的interface。

> interface是面向对象编程语言中接口操作的关键字，功能是把所需成员组合起来，用来装封一定功能的集合。它好比一个模板，在其中定义了对象必须实现的成员，通过类或结构来实现它。

## 前言

TypeScript中interface的主要作用是声明一个集合。如

```javascript { .theme-peacock }
// interface-1.ts

// 不使用interface
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

// 使用interface
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj: LabelledValue = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

对比上述两段代码，通过明确的类型定义，代码的整洁性和可读性都明显提升。

## 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。

```javascript { .theme-peacock }
// interface-2.ts

interface SquareConfig {
  color: string;    // 必选
  width?: number;   // 可选
}

// 正确
let sc: SquareConfig = {
    color: 'red',
    width: 100
}

// 正确
let sc1: SquareConfig = {
    color: 'red'
}
// 错误：Property 'color' is missing in type '{ width: number; }' but required in type 'SquareConfig'.
let sc2: SquareConfig = {
    width: 100
}
```

## 只读属性

参考：[TypeScript（四）：类](http://agroup.baidu.com/swan-doc/md/article/2354846)

```javascript { .theme-peacock }
//interface-3.ts

interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```


## 属性检查

```javascript { .theme-peacock }
// interface-4.ts

interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): void {}

let mySquare: void;
// 正确
mySquare = createSquare({ width: 100 });

// 错误： 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
mySquare = createSquare({ colour: "red", width: 100 });

// 错误
let square: SquareConfig = {
	colour: "red", 
	width: 100
}
```

可选属性允许某个属性不存在，但是TypeScript并不允许对象中出现未定义的其他属性。

> 如果在不了解对象详细内容的情况下， 定一个满足自己要求的对象呢？ 比如你从云端获取了一个数据，通过interface定义了该数据的数据结构，但云端可能给你一些额外的字段，这时候应该怎么搞？

## 函数接口

接口也可以描述函数类型。当通过interface来定义一个函数接口时，应该仅描述函数的输入输出，而不应关心具体实现。

```javascript { .theme-peacock }
// interface-5.ts

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}

mySearch = function(source: string, subString: string): boolean {
  let result = source.search(subString);
  return result > -1;
}

mySearch = function(a: string, b: string): boolean {
  let result = a.search(b);
  return result > -1;
}
```

## 可索引接口

满足上边提出问题，定义一个包含特定属性及其他任意属性的接口

```javascript { .theme-peacock }
// interface-6.ts

interface ISquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
    [index: number]: string;
}

let squareOptions: ISquareConfig = {
    colour: "red",
    width: 100,
    1: 'a',
    2: 'b',
    'a': 1,
    'b': 2
};

// 数组型接口
interface IArray {
    [index: number]: string;
}
let squareOptions: IArray = ['1', '2'];
let so: string[] = ['1', '2'];
```

## 混合类型

interface可以随便混合，同时定义函数、属性、是否可选、是否只读等。

一个例子就是，一个对象可以同时做为函数和对象使用，并带有额外的属性。
```javascript { .theme-peacock }
// interface-7.ts

let counter = function (start: number) { };

// error: Property 'interval' does not exist on type '(start: number) => void'.
counter.interval = 123;
```

以上这段代码会报错，不能给一个函数设置属性。正确做法如下：

```javascript { .theme-peacock }
// interface-8.ts

interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

let counter = <Counter>function (start: number) { };
counter.interval = 123;
counter.reset = function () { };

```


## 实现接口

与其他强类型语言一样，interface可以被class实现
```javascript { .theme-peacock }
// interface-9.ts

interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

## 扩展阅读

TypeScript中interface支持非常丰富的功能，但并不常用，这里不做过多介绍。该兴趣的同学请阅读[官方文档](http://www.tslang.cn/docs/handbook/interfaces.html)

* 继承接口
* 接口继承类
