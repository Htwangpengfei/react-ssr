# 泛型

泛型的目的是为了解决 类 接口 方法的复用性，并在成员之间提供有意义的约束，这些成员可以是：

- 类的实例成员
- 类的方法
- 函数参数
- 函数返回值

实现方式是在申明时不预先确定具体的类型，而在调用时再明确指定类型。允许传入多种类型而不丢失类型。

需求和示例：
一个identity函数接受一个参数，并原样返回。

``` javascript { .theme-peacock }
function identity(arg) {
  return arg;
}
``` 

从类型上看，无论参数是什么类型，返回值的类型都保持一致。

本质上，泛型可以理解为一个类型层面的函数，当我们指定具体的输入类型时，得到的结果是经过处理后的输出类型：

``` javascript { .theme-peacock }
const identity = arg => arg; // value level
type Identity<T> = T; // type level

const pair = (x, y) => [x, y]; // value level
type Pair<T, U> = [T, U]; // type level
``` 
在定义泛型时，我们只是定义了一个逻辑处理过程，只有在用具体输入类型调用它时，才会得到真正的结果类型。所以我们在编写泛型时，实际上是在进行类型层面的编程，因为它是一个函数。

(1) 重载
``` javascript { .theme-peacock }
function identity(arg: number): number;
function identity(arg: string): string;
function identity(arg: boolean): boolean;

identity(1);
identity('1');
identity(false);

identity({a: 1});  // ?
``` 
无法穷举arg的所有可能类型

(2) any
``` javascript { .theme-peacock }
function identity(arg: any): any {
    // 经过一系列的逻辑执行后。。。
    return arg;
};

let output = identity(1);  // type of output ? 如何保证它和输入类型的类型相同


``` 
any丢失参数与返回值的类型对应关系（即无法保证输入类型与输出类型一致）

(3) 泛型
``` javascript { .theme-peacock }
function identity<T>(arg: T): T;

// 调用泛型函数，可以在执行前检查到确保输入输出的类型是一致的
// 1. 传入所有的参数，包含类型参数：
let output = identity<string>("myString");  // type of output will be 'string'

// 2. 使用类型推论（编译器会根据传入的参数自动地帮助我们确定T的类型）：
let output = identity("myString");  // type of output will be 'string'

``` 


## 类型参数
类型参数T表示一个类型而不是值, 使用泛型创建泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型，所以只有所有类型共有的特征才能访问。

``` javascript { .theme-peacock }
function identity<T>(arg: T): T {
    return arg;
}

function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T 不一定会有 length 属性
    return arg;
}

function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // 因为 arg 被申明成了一个数组类型，所以它一定会有 length 属性
    return arg;
}
```

``` javascript { .theme-peacock }
// 定义泛型的时候，可以一次定义多个类型参数：

function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

## 泛型类型
``` javascript { .theme-peacock }
function identity<T>(arg: T): T {
    return arg;
}

// 像函数声明一样, 类型参数在最前面
let identity1: <T>(arg: T) => T = identity;
// 可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上
let identity2: <U>(arg: U) => U = identity;
// 调用签名的对象字面量来定义泛型函数
let identity3: {<T>(arg: T): T} = identity;

``` 

## 泛型约束

我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束：

``` javascript { .theme-peacock }
// 使用了 extends 约束了泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性。
interface Lengthwise {
    length: number;
}
function identity<T extends Lengthwise>(arg: T): T {
	console.log(arg.length);
    return arg;
}
```

多个类型参数之间也可以互相约束：

``` javascript { .theme-peacock }
// 使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```

## 泛型函数
``` javascript { .theme-peacock }
function identity<T>(arg: T): T {
    return arg;
}
let identity1 = identity<string>("a");
let identity2 = identity("a");
let identity3 = identity<number>(1);
``` 

## 泛型接口
``` javascript { .theme-peacock }
interface Identity {
    <T>(value: T): T; // 成员级类型参数
}
let identity1: Identity = identity;
``` 
``` javascript { .theme-peacock }
interface Identity<T> { // 接口级类型参数
    (value: T): T;
}
// 使用时必须指定类型
let identity2: Identity<number> = identity;
``` 

## 泛型类
``` javascript { .theme-peacock }
// demo1
class Identity<T> {
   log(value: T) {
     console.log(value);
     return value
   }
}
let identity1 = new Identity<number>();
identity1.log(1);
let identity2 = new Identity();
identity2.log("2");


// demo2
class Stack<T> {
    private count: number;
    private items: any;
  
    constructor() {
      this.count = 0;
      this.items = {};
    }
  
    push(element: T) {
      this.items[this.count] = element;
      this.count++;
    }
  
    pop() {
      if (this.isEmpty()) {
        return undefined;
      }
      this.count--;
      const result = this.items[this.count];
      delete this.items[this.count];
      return result;
    }
  
    peek() {
      if (this.isEmpty()) {
        return undefined;
      }
      return this.items[this.count - 1];
    }
  
    isEmpty() {
      return this.count === 0;
    }
  
    size() {
      return this.count;
    }
  
    clear() {
      /* while (!this.isEmpty()) {
        this.pop();
      } */
  
      this.items = {};
      this.count = 0;
    }
  
    toString() {
      if (this.isEmpty()) {
        return '';
      }
      let objString = `${this.items[0]}`;
      for (let i = 1; i < this.count; i++) {
        objString = `${objString},${this.items[i]}`;
      }
      return objString;
    }
}

const stackNumber = new Stack<number>();
stackNumber.push(1);
stackNumber.push(2);
console.log(stackNumber.toString());

const stackString = new Stack<string>();
stackString.push('1');
stackString.push('2');
console.log(stackString.toString());
```
注意：
(1) 类型可以指定也可以不指定(类型推论)
(2) 静态成员无法使用类型参数
(3) 所有成员的目标类型一致
