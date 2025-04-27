# TypeScript（二）：基础语法

## 值与类型

下边是一个典型的 TypeScript 变量声明方式：

```ts
const msg :string = 'hello world';
```

上边代码表示：

1. 声明一个 msg 的常量
2. 常量的类型为 string
3. 常量的值为 'hello world'

对比 JavaScript，TypeScript 多了一步：将值绑定一个类型

在 TypeScript 的世界中，有 2 种组成要素：

- 值
- 类型

所以在上边的代码中，`'hello world'` 是值，而冒号后边的`string`是类型，`msg`是一个类型为`string`值为`hello world`的常量

我们都知道如何声明一个拥有值的变量，那么我们是否可以单独声明一个类型呢？答案是可以的：

```ts
type MessageString = string;
const msg :MessageString = 'hello world';
```

上边我们声明了一个`MessageString`的类型，声明了一个类型为`MessageString`值为`hello world`的`msg`常量

你可以会质疑说用`type`关键字来声明一个类型毫无意义，毕竟`MessageString`完全等价于`string`。在上边的例子中确实如此，但是当程序变得非常复杂，一个类型可能也会变得很复杂，比如：

```ts
type UserID = string | number;
const id1 :UserID = 39;
const id2 :UserID = '1227';
```

上边的例子中，我们声明了一个`UserID`的类型，同时允许数字或字符串，而此时，声明一个类型的优势就显而易见了

这种`|`连接的类型方式，我们称为“计算类型”，会在后边章节中讲解

## 基础类型

下边的类型与 JavaScript 中别无二一，相信读者扫一眼就能看明白：

```ts
// 原始类型

let isDone :boolean = false;

let decLiteral :number = 6;

let uersname :string = "bob";
let sentence :string = `Hello, my name is ${ uersname }.`;

// 引用类型

let list :number[] = [1, 2, 3];

let obj :{ a :number } = {
    a: 1,
};

let exp :RegExp = /\w+/;

function sayHello(username :string) :string {
    return `hello ${ username }`;
}
const sayBye :(username :string) => string = function (username) {
    return `bye ${ username }`;
};
```

> 练习：使用 ts 实现 parseInt 方法 

> Tips: 使用 js 中的原始类型构造函数，可以类型转换。如`Number('123')`可将字符串转换成数字，`Boolean(233)`可将数字转换成布尔

### 将值作为类型

我们可以将一个明确的值作为类型。比如如下 ts 代码：

```ts
'exit'
```

这个显然是一个字符串表达式，在 js 中，我们可以将它赋值给一个变量。如：

```js
const exitDirective = 'exit';
```

而在 ts 中，它不仅可以赋值给一个变量，可以可以赋给一个类型：

```ts
type ExitDirective = 'exit';
const exitDirective :ExitDirective = 'exit';

const exitDirective2 :'exit' = 'exit';
```

虽然看上去有些奇怪，但是依旧符合我们对于 ts 值与类型的理解：

1. `ExitDirective`是类型，`exitDirective`是值
2. 由于`ExitDirective`是类型，所以会在编译阶段移除，无法被`console.log`打印

将值作为类型是非常常用的，它会在后续的类型计算中被大量用到。比如我们可以定义一个简单的字符串枚举：

```ts
type Directive = 'exit' | 'open';

let directive :Directive = 'exit'; // ok
directive = 'open'; // ok
directive = 'close'; // error
```

### 空值 Void、Null、Undefined、Never

TypeScript 还定义了一系列空值

```ts
let aNull :null = null;
let anUndefined :undefined = undefined;

function throwAnError(msg :string) :never {
  throw new Error(msg);
}

function sayHello(name :string) :void {
  console.log(`hello ${name}`);
}
```

其中`null`和`undefined`类型可以理解为是一个值类型，而`void`仅仅被用作描述函数无返回

`never`就比较有趣了，如果单独使用，它意味着连返回值都无法返回的函数（上边的`throwAnError()`），基本上没啥用，但是在类型计算中，`never`大放异彩。我们在稍后的类型计算会着重讲`never`

### 任意值 Any、Unknown

有时我就是不想给变量或函数返回值定义类型怎么办？这时候就轮到 Any 出场了

```ts
// any-type.ts
const obj :any = {};
const str :any = 'hello';
const aNull :any = null;
const num :any = 233;

const ny :any = '';
const num :number = ny; // #a

num.abc(); // ok
```

Any 类型代表任意类型，Any 可以：

1. 赋值给任意类型
2. 被任意类型赋值（`any-type.ts#a`）
3. any 类型的任何属性和方法返回值都是 any

使用`any`意味着完全放弃类型检查，如果你的 ts 代码里存在着大量`any`，大多情况这意味着严重的设计缺陷

由于 Any 的第二个特性实在是太危险（`any-type.ts#a`），所以 TS 3.0 新增了一个叫做 Unknown 的类型。只允许被任意赋值，而不能赋值给其他人：

```ts
// unknown-1.ts
const unknown :unknown = 233;
const num1 :number = unknown; // error
const num2 :number = unknown as number; // #a
```

想要将 Unknown 类型赋值给其他变量，必须显式的使用“类型断言”（`unknown-1.ts#a`）。我们会在稍后讲解类型断言的相关内容

所以当使用 TypeScript 3.0+ 时，推荐使用 Unknown 类型来代替 Any

### 枚举 Enum

枚举是一个非常常用且有趣的东西。枚举的使用场景是：当你仅仅想判断一个值是否等于另一个值，而不在乎值本身是什么时，就适合用枚举

考虑如下的一个 js 函数：

```js
// directive-1.js
function runDirective(directive) {
  switch (directive) {
    case 'open':
      window.open('about:blank', '_blank');
      break;
    case 'exit':
      window.close();
      break;
    default:
      console.error(`Unknown directive of "${directive}"`);
  }
}

runDirective('open');
```

`runDirective`函数传入`open`则打开新页面，传入`exit`则关闭页面。而在内部实现过程中，其实我们并不关心`exit`值本身，我们只是关心它是不是`swtich...case`某个值。

同时，由于字符串全是由手动输入的，很容易发生拼写错误导致程序 Bug，且导致的程序 Bug 是运行时错误——只有当你运行到这个逻辑分支时才会出现 Bug

用 js 枚举的方式重写，可以写成如下这样：

```js
// directive-2.js
const Directive = { // #a
  exit: 0,
  open: 1,
};

function runDirective(directive) {
  switch (directive) {
    case Directive.open:
      window.open('about:blank', '_blank');
      break;
    case Directive.exit:
      window.close();
      break;
    default:
      console.error(`Unknown directive of "${directive}"`);
  }
}

runDirective(Directive.open);
```

这样重写的好处显而易见：

1. 拼成错误大大减少，现在`open`和`exit`单词是通过`Directive.`后敲出来的，拥有良好的编辑器代码提示
2. 可读性增加，不需要任何注释即可一眼看到`Directive`拥有2种——`open`和`exit`

回到 TypeScript。TS 为我们直接提供了类似于`directive-2.js`的这种枚举实现方式，改写起来非常简单：

```diff
// directive-2.ts.diff

- const Directive = {
-     exit: 0,
-     open: 1,
- };
+ enum Directive {
+     exit,
+     open,
+ }

- function runDirective(directive) {
+ function runDirective(directive :Directive) { // #a
      switch (directive) {
          case Directive.open: // #b
              window.open('about:blank', '_blank');
              break;
          case Directive.exit:
              window.close();
              break;
          default:
              console.error(`Unknown directive of "${directive}"`);
      }
  }

  runDirective(Directive.open);
```

若观察编译后的产物，你会发现其实 tsc 会将枚举编译成和`directive-2.js#a`差不多的样子

同时，如果你有对每个枚举项指定值的需求，可以在枚举中声明每个项的具体指，如：

```ts
enum Directive {
    exit = 'exit',
    open = 'open',
}

console.log(Directive.exit); // 输出 'exit' 字符串
```

### 既是值，也是类型

你发没发现，在文件`directive-2.ts.diff`中我们定义的枚举`Directive`，我们既将它在`directive-2.ts.diff#a`当做类型使用，又在`directive-2.ts.diff#b`当做值来使用

这奇怪吗？其实不奇怪，在 ts 中，同名的值与类型是完全可以共存的

```ts
type hello = 'hello';
const hello :hello = 'hello';

console.log(hello);
```

所以我们在`directive-2.ts.diff`声明 Directive 枚举时，其实是同时声明了一个叫做 Directive 的类型，和一个叫做 Directive 的值

值和类型的边界依旧存在，只是枚举会同时声明同名的值和类型而已

###（不常用）引用类型 Object 

与`any`相似的，有个叫做`object`的类型。此类型极少会用到，可以被非原始类型赋值，如：

```ts
// object-type-1.ts
const exp :object = /\w+/;
const arr :object = [1, 2, 3];
const obj :object = { a: 1 };
```

但是这样做其实并不聪明，改写`object-type-1.ts`为下边的`object-type-2.ts`更加明智：

```ts
// object-type-2.ts
const exp :RegExp = /\w+/;
const arr :number[] = [1, 2, 3];
const obj :{ a :number } = { a: 1 };
```

### （不常用）元组 Tuple

接下来介绍没个锤子用的数据结构，我从未使用过或是见到其他人使用它。而且 TypeScript 3.0 导致元组有了一次 break change

简单来说，元组就是规定了数组子项类型的数组：

```ts
// tuple-type.ts
let tpl :[string, number] = ['hello', 233];
```

类型`[string, number]`表示，数组的第一项为`string`，第二项为`number`

而再往后的子项呢？这个就分为 2.x 和 3.x 了

在 2.x 中，超过元组定义的子项为联合类型，在`tuple-type.ts`中则为`string | number`

如下代码在 2.x 中是运行OK的，但是 3.x 会报错：

```ts
const tpl :[string, number] = ['hello', 233];

tpl[3] = 2333;
tpl[3] = '2333';
```

而在 3.x，TypeScript 对元组进行了更加严格的限制，后续子项必须使用“剩余参数运算符”来显式声明

如下代码在 3.x 中是运行OK的，但是 2.x 会报错：

```ts
const tpl :[string, number, ...string[]] = ['hello', 233];

tpl[3] = '2333';
```

## 类型推论、断言、保护

### 类型推论

其实在 ts 中声明变量也可以不声明变量类型，让 tsc 自己去猜：

```ts
const msg = 'hello'; // ok
console.log(msg);
```

TypeScrip 拥有一套相对复杂的类型推论机制，它可以根据上下文来推论变量类型

```ts
// inference-1.ts
window.onclick = function(mouseEvent) {
    console.log(mouseEvent.target); // ok
    console.log(mouseEvent.abc); // error
};
```

在上边代码中，`mouseEvent`会被自动推断为`MouseEvent`类型，所以使用`target`属性的 OK 的，而使用`abc`属性则会因为 MouseEvent 中没有`abc`而报错

当一个变量有多个赋值语句时，TypeScript 还会去归类赋值语句，来推论出一个兼容所有赋值语句的类型：

```ts
let box; // 推论为 number | string

box = 123;
box = 'hello';
```

不过，如果一开始就给变量赋一个初始值，那么类型推断会固定为初始值的类型：

```ts
let box = 123; // 推论为 number

box = 233; // ok
box = 'hello'; // error
```

尽可能的少用类型推论，除非你非常确定推论出的结果符合预期。比如结合类型断言：

```ts
let num = JSON.parse('233') as number; // 使用类型断言一定会被推论成断言的类型
```

类型推论中，一个比较危险的情况是——一个变量被推论成 Any。这意味着和该变量相关的所有操作都跳过了类型检查。因为实在是太危险了，所有 tsc 里专门有一个选项可以禁用推论出 Any 的类型推论：

```bash
$ tsc --noImplicitAny
```

在 tsconfig.json 中的`compilerOptions.noImplicitAny`指定为`true`可以获得相同效果

而在我们一开始的 tsconfig.json 中，使用了`compilerOptions.strict`，该选项也会自动开启`noImplicitAny`

> 启用`--strict`相当于启用`--noImplicitAny`,`--noImplicitThis`,`--alwaysStrict`，`--strictNullChecks`和`--strictFunctionTypes`和`--strictPropertyInitialization`

### 类型断言

编写程序的程序员总是要比 tsc 更了解代码本身，所以 ts 提供了多种修改 tsc 行为的方式，类型断言就是其中之一

类型断言可以显式的指明一个值的类型，下面是语法：

```ts
JSON.parse('233') as number
<number>JSON.parse('233')
```

由于尖括号的方式和 jsx 语法冲突，所以当使用 jsx 的时候只能通过`as`的方式

类型断言是一个表达式级别的语法，所以用起来很方便。除了比较长：

```ts
const msg = (
  (JSON.parse('233') as number)) - 2 + (JSON.parse('“个用户”') as string))
) as string;
```

类型断言只是类型，会在编译时被移除，它不会对你的实际 js 代码产生影响

使用类型断言，你可以很容易写出错误的代码，所以使用前要小心：

```ts
const num :number = JSON.parse('{}') as number;
console.log(num - 1); // 输出 NaN
```

正是因为类型断言比较危险，所以 Unknown 类型需要显示的使用类型断言来告知程序员这一步很有可能出错。试着对比如下 Any 和 Unknown 的2种方式：

```ts
const jsonObj :any = JSON.parse('{}');
const num :number = jsonObj.a; // any 的任何属性都是 any，并且 any 可以赋给任何值
console.log(num - 1); // 输出 NaN
```

```ts
const jsonObj :unknown = JSON.parse('{}');
const num :number = jsonObj.a as number; // 必须使用类型断言才能赋值
console.log(num - 1); // 输出 NaN
```

### 类型保护

tsc 会根据某些特定的上下文来推论类型，非常典型的就是 js 中的`typoef`运算符和`instanceof`运算符：

```ts
// typeof-1.ts

const box :number | string = Math.random() > 0.5 ? 233 : '233';

console.log(box.length); // #a error

if (typeof box === 'string') {
  console.log(box.length); // #b ok
}
```

在`#a`中，tsc 没办法确定 box 是字符串还是数字，而数字是没有 length 属性的。所以会有一个编译时错误

而在`#b`中，由于使用了 typeof 运算符，所以 tsc 会将 box 自动推论为`string`

与 typeof 运算符类似的，`instanceof`运算符也会起到相同的作用：

```ts
// type-guards-1.ts

const box :{} | number[] = Math.random() > 0.5 ? {} : [1, 2, 3];

console.log(box.length); // error

if (box instanceof Array) {
  console.log(box.length); // ok
}
```

ts 也允许灵活的定义自己的类型保护函数，来触发 tsc 的类型保护：

```ts
// type-guards-2.ts

type ArrayLike = {
    length :number;
}

function isArrayLike (obj :any) :obj is ArrayLike { // #a
    if (typeof obj.length === 'number') {
        return true;
    }
    return false;
}

const box :{} | number[] = Math.random() > 0.5 ? {} : { length: 0 };

console.log(box.length); // error

if (isArrayLike(box)) {
    console.log(box.length); // ok
}

```

在`#a`中，我们定义了一个函数，返回值处写的`obj is ArrayLike`被称为*类型谓词（Type Predicate）*，指明这个函数是返回一个布尔值，来判断值`obj`是否属于类型`ArrayLike`

翻开`Array.isArray()`方法的类型声明，你会发现它也是被声明为类型保护函数了。所以你可以使用`Array.isArray()`来触发 tsc 的类型保护

> `isArray(arg: any): arg is Array<any>;`




