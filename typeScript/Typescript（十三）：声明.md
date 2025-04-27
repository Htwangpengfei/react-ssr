# Typescript（十三）：声明


## 声明的本质
声明的本质主要是告知编译器一个标识符的**类型信息**，相应的声明文件能让我们在使用第三方库时便于获得对应的**代码补全、接口提示等功能**。其中声明可分为**内部声明**和**外部声明**。

## 内部声明
在TypeScript源码(.ts/.tsx结尾，不包括.d.ts结尾的文件)里面的声明都可称为**内部声明**：
```javascript { .theme-peacock }
// 声明name为一个string
let name: string;
// 声明age为一个number并且初始值为19
let age: number = 19;
// 声明一个接口
interface Person {
	...
}
// 声明一个函数
function fn(arg: string): void {}
// 声明一个枚举值
enum SexEnum {
	MALE，
	FEMALE
}
// 申明一个命名空间
namespace NS {}

```
内部声明可以不仅可以声明类型的同时还可以给**初始值**。

## 外部声明
外部声明指的时在ts项目中，如果要使用外部第三方的js库就需要外部声明。

一个常见的例子：
```javascript { .theme-peacock }
// index.html
// 注册全局变量$
<script src="path/to/jquery.js"></script> 

// app.ts
// Cannot find name '$'. Do you need to install type definitions for jQuery? Try `npm i @types/jquery`.
$('body').html('typescript');
```
报错了，是因为ts编译器更本不知道**$**代表什么。这个时候我们需要提供一个jquery.js模块的声明文件，或者去[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/)获取对应第三方模块的声明文件。**npm i @types/jquery -D**。

```javascript { .theme-peacock }
// 为第三方库提供一个声明文件
// jquery.d.ts
declare let $: (selector: string) => {
    html: (content: string) => void;
};
```
在添加了jquery模块对于的声明文件之后，ts编译器就知道**$**的类型或外观改了。

上面的例子中，jQuery即是一个函数有是一个对象，为了是这两个声明不冲突，ts会将两个声明进行合并。

## [声明合并](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
“声明合并”是指编译器将针对同一个名字的两个独立声明合并为单一声明。 合并后的声明同时拥有原先两个声明的特性。 任何数量的声明都可被合并；不局限于两个声明
### 函数的合并
我们可以使用重载定义多个函数类型：
```javascript { .theme-peacock }
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
### 合并接口
注意，合并的同名属性的类型必须是唯一的。每组接口里的声明顺序保持不变，但各组接口之间的顺序是后来的接口重载出现在靠前位置
```javascript { .theme-peacock }
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
}
```
```javascript { .theme-peacock }
interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
    clone(animal: Sheep): Sheep;
    clone(animal: Animal): Animal;
}
```
### 合并命名空间

```javascript { .theme-peacock }
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```
等同于：
```javascript { .theme-peacock }
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```
除了这些合并外，你还需要了解非导出成员是如何处理的。 非导出成员仅在其原有的（合并前的）命名空间内可见。这就是说合并之后，从其它命名空间合并进来的成员无法访问非导出成员。
```javascript { .theme-peacock }
namespace Animal {
    let haveMuscles = true;

    export function animalsHaveMuscles() {
        return haveMuscles;
    }
}

namespace Animal {
    export function doAnimalsHaveMuscles() {
        return haveMuscles;  // Error, because haveMuscles is not accessible here
    }
}
```
### 非法的合并
TypeScript并非允许所有的合并。 目前，类不能与其它类或变量合并。 想要了解如何模仿类的合并。


## [声明文件](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
通常我们会把声明语句放到单独的文件里面(jquery.d.ts)，这个文件就称为声明文件。并且声明文件必须已**.d.ts**为后缀。
通常当用到第三方库的时，我们可以去[搜索页面](https://microsoft.github.io/TypeSearch/)查找库的声明文件。

### 书写声明文件
当一个库没有声明文件且在社区里面也没有的话，就需要我们为该库提供一个声明文件，来确保ts编译是不会发生报错。

在不同场景声明文件的内容和使用方式会有所不一样：

 - **全局变量**：通过 < script > 标签引入第三方库，注入全局变量
 - **npm包**：通过 import foo from 'foo' 导入，符合 ES6 模块规范
 - **UMD库**：既可以通过 < script > 标签引入，又可以通过 import 导入
 - **直接扩展全局变量**：通过 < script > 标签引入后，改变一个全局变量的结构
 - **在 npm 包或 UMD 库中扩展全局变量**：引用 npm 包或 UMD 库后，改变一个全局变量的结构
 - **模块插件**：通过 < script > 或 import 导入后，改变另一个模块的结构

### 全局变量
上面举的例子就是通过 < script > 标签引入 jQuery，注入全局变量 $ 和 jQuery。

使用全局变量的声明文件时，如果是以 npm i@types/xxx -D 安装的，则不需要任何配置。如果是将声明文件直接存放于当前项目中，则建议和其他源码一起放到 src 目录下（或者对应的源码目录下）：
```javascript { .theme-peacock }
/path/to/project
├── src
|  ├── index.ts
|  └── jQuery.d.ts
└── tsconfig.json
```
全局变量的声明文件主要有以下几种语法：

 - **declare var** 声明全局变量
 - **declare function** 声明全局方法
 - **declare class** 声明全局类
 - **declare enum** 声明全局枚举类型
 - **declare namespace** 声明（含有子属性的）全局对象
 - **interface** 和 **type** 声明全局类型

##### declare var
在所有的声明语句中，declare var 是最简单的，如之前所学，它能够用来定义一个全局变量的类型。与其类似的，还有 declare let 和 declare const，使用 let 与使用 var 没有什么区别：
```javascript { .theme-peacock }
// src/jQuery.d.ts
declare let jQuery: (selector: string) => any;

// src/index.ts
jQuery('#foo');
// 使用 declare let 定义的 jQuery 类型，允许修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
};
```

而当我们使用 const 定义时，表示此时的全局变量是一个常量，不允许再去修改它的值了:
```javascript { .theme-peacock }
// src/jQuery.d.ts
declare const jQuery: (selector: string) => any;

// src/index.ts
jQuery('#foo');
// 使用 declare let 定义的 jQuery 类型，允许修改这个全局变量
// error TS2588: Cannot assign to 'jQuery' because it is a constant.
jQuery = function(selector) {
    return document.querySelector(selector);
};
```
一般来说，全局变量都是禁止修改的常量，所以大部分情况都应该使用 **const** 而不是 var 或 let。

需要注意的是，**声明语句中只能定义类型，切勿在声明语句中定义具体的实现**

```javascript { .theme-peacock }
// src/jQuery.d.ts
// error TS1183: An implementation cannot be declared in ambient contexts.
declare const jQuery = function(selector) {
    return document.querySelector(selector);
};
```

##### declare function
declare function 用来定义全局函数的类型。jQuery 其实就是一个函数，所以也可以用 function 来定义：
```javascript { .theme-peacock }
// src/jQuery.d.ts
declare function jQuery(selector: string): any;

// src/index.ts
jQuery('#foo');
```
在函数类型的声明语句中，函数重载也是支持：
```javascript { .theme-peacock }
// src/jQuery.d.ts
declare function jQuery(selector: string): any;
declare function jQuery(domReadyCallback: () => any): any;

// src/index.ts
jQuery('#foo');
jQuery(function() {
    alert('Dom Ready!');
});
```

#### declare class
当全局变量是一个类的时候，我们用 declare class 来定义它的类型

```javascript { .theme-peacock }
// src/Animal.d.ts
declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string;
}

// src/index.ts
let cat = new Animal('Tom');
```
同样的，declare class 语句也只能用来定义类型，不能用来定义具体的实现，比如定义 sayHi 方法的具体实现则会报错：

```javascript { .theme-peacock }
// src/Animal.d.ts
declare class Animal {
    name: string;
    constructor(name: string);
    // error TS1183: An implementation cannot be declared in ambient contexts.
    sayHi() {
        return `My name is ${this.name}`;
    };
}
```

#### declare enum
使用 declare enum 定义的枚举类型也称作外部枚举（Ambient Enums），举例如下:

```javascript { .theme-peacock }
// src/Direction.d.ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
// src/index.ts
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

与其他全局变量的类型声明一致，declare enum 仅用来定义类型，而不是具体的值。
Directions.d.ts 仅仅会用于编译时的检查，声明文件里的内容在编译结果中会被删除。它编译结果是：
```javascript { .theme-peacock }
// src/Direction.d.ts
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```
其中 Directions 是由第三方库定义好的全局变量。

#### declare namespace
namespace 是 ts 早期时为了解决模块化而创造的关键字，中文称为命名空间。在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。
比如 jQuery 是一个全局变量，它是一个对象，提供了一个 jQuery.ajax 方法可以调用，那么我们就应该使用 declare namespace jQuery 来声明这个拥有多个子属性的全局变量。

```javascript { .theme-peacock }
// src/jQuery.d.ts
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}

// index.ts
jQuery.ajax('/api/get_something');
```
注意，在 declare namespace 内部，我们直接使用 function ajax 来声明函数，而不是使用 declare function ajax。类似的，也可以使用 const, class, enum 等语句

```javascript { .theme-peacock }
// src/jQuery.d.ts
declare namespace jQuery {
    // error: A 'declare' modifier cannot be used in an already ambient context.
    declare function ajax(url: string, settings?: any): void;
    const version: number;
    class Event {
        blur(eventType: EventType): void
    }
    enum EventType {
        CustomClick
    }
}

// scr/index.ts
jQuery.ajax('/api/get_something');
console.log(jQuery.version);
const e = new jQuery.Event();
e.blur(jQuery.EventType.CustomClick);
```

##### interface和type
除了全局变量之外，可能有一些类型我们也希望能暴露出来。在类型声明文件中，我们可以直接使用 interface 或 type 来声明一个全局的接口或类型

```javascript { .theme-peacock }
// src/index.ts

interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
}

type AjaxSettings2 = {
    method?: 'GET' | 'POST'
    data?: any;
}

declare namespace jQuery {
    function ajax(url: string, settings?: AjaxSettings): void;
}

// src/index.ts
let settings: AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
let settings2: AjaxSettings2 = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```

暴露在最外层的 interface 或 type 会作为全局类型作用于整个项目中，我们应该尽可能的**减少全局变量或全局类型的数量**。故最好将他们放到 **namespace** 下。

### npm 包

在我们尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在。一般来说，npm 包的声明文件可能存在于两个地方：

 1. 与该 npm 包绑定在一起。判断依据是 package.json 中有 types 字段，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以以后我们自己创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起。
 2. 发布到 @types 里。我们只需要尝试安装一下对应的 @types 包就知道是否存在该声明文件，安装命令是 npm i @types/foo -D。这种模式一般是由于 npm 包的维护者没有提供声明文件，所以只能由其他人将声明文件发布到 @types 里了。
 
假如以上两种方式都没有找到对应的声明文件，那么我们就需要自己为它写声明文件了。由于是通过 import 语句导入的模块，所以声明文件存放的位置也有所约束，一般有两种方案：

1. 创建一个 node_modules/@types/foo/index.d.ts 文件，存放 foo 模块的声明文件。这种方式不需要额外的配置，但是 node_modules 目录不稳定，代码也没有被保存到仓库中，无法回溯版本，有不小心被删除的风险，故不太建议用这种方案，一般只用作临时测试。

2. 创建一个 types 目录，专门用来管理自己写的声明文件，将 foo 的声明文件放到 types/foo/index.d.ts 中。这种方式需要配置下 tsconfig.json 中的 paths 和 baseUrl 字段。


npm 包的声明文件主要有以下几种语法：

 - **export** 导出变量
 - **export namespace** 导出（含有子属性的）对象
 - **export default ES6** 默认导出
 - **export = commonjs** 导出模块

#### export
npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明。

export 的语法与普通的 ts 中的语法类似，区别仅在于声明文件中禁止定义具体的实现：
```javascript { .theme-peacock }
// src/index.ts
import { fooName, getName, Animal, Directions, Options } from 'my-foo';

console.log(fooName);
let myName = getName();
let cat = new Animal('Tom');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
    data: {
        name: 'my-foo'
    }
};

// src/types/my-foo/index.d.ts
export const fooName: string;
export function getName(): string;
export class Animal {
    constructor(name: string);
    sayHi(): string;
}
export enum Directions {
    Up,
    Down,
    Left,
    Right
}
export interface Options {
    data: any;
}
```

我们也可以使用 declare 先声明多个变量，最后再用 export 一次性导出。上例的声明文件可以等价的改写为：

```javascript { .theme-peacock }
// src/types/my-foo/index.d.ts
declare const fooName: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
declare interface Options {
    data: any;
}

export {fooName, getName, Animal, Directions, Options};
```

#### export namespace
与 declare namespace 类似，export namespace 用来导出一个拥有子属性的对象：

```javascript { .theme-peacock }
// src/types/my-bar/index.d.ts
export namespace bar {
    const name: string;
    namespace foo {
        function baz(): string;
    }
}
// src/bar-index.ts
import { bar } from 'my-bar';

console.log(bar.name);
bar.foo.baz();

```

#### export default
在 ES6 模块系统中，使用 export default 可以导出一个默认值，使用方可以用 import baz from 'my-baz' 而不是 import { baz } from 'my-baz' 来导入这个默认值。
```javascript { .theme-peacock }
// src/baz-index.ts
import baz from 'my-baz';

baz();

// src/types/my-baz/index.d.ts
export default function baz(): void;
```
注意，只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来，再默认导出。
```javascript { .theme-peacock }
// src/types/my-baz/index.d.ts
// Expression expected.
export default enum Directions {
    Up,
    Down,
    Left,
    Right
}

// good

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

export default Directions;
```

#### export =
在 commonjs 规范中，我们用以下方式来导出一个模块:
```javascript { .theme-peacock }
// 整体导出
module.exports = foo;
// 单个导出
exports.bar = bar;
```
在 ts 中，针对这种模块导出，有多种方式可以导入:
```javascript { .theme-peacock }
// 第一种----------
// 整体导入
const foo = require('foo');
// 单个导入
const bar = require('foo').bar;

// 第二种----------
// 整体导入
import * as foo from 'foo';
// 单个导入
import { bar } from 'foo';

// 第三种，这也是 ts 官方推荐的方式：----------
// 整体导入
import foo = require('foo');
// 单个导入
import bar = foo.bar;

```
对于这种使用 commonjs 规范的库，假如要为它写类型声明文件的话，就需要使用到 export = 这种语法了：

```javascript { .theme-peacock }
// types/foo/index.d.ts

export = foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```
需要注意的是，上例中使用了 export = 之后，就不能再单个导出 export { bar } 了。所以我们通过声明合并，使用 declare namespace foo 来将 bar 合并到 foo 里。

### UMD 库
既可以通过 < script > 标签引入，又可以通过 import 导入的库，称为 UMD 库。相比于 npm 包的类型声明文件，我们需要额外声明一个全局变量，为了实现这种方式，ts 提供了一个新语法 **export as namespace**。

一般使用 export as namespace 时，都是先有了 npm 包的声明文件，再基于它添加一条 export as namespace 语句，即可将声明好的一个变量声明为全局变量：
```javascript { .theme-peacock }
// src/types/foo/index.d.ts
export as namespace foo;
export = foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}

// 当然它也可以与 export default 一起使用：
export as namespace foo;
export default foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

### 直接扩展全局变量
有的第三方库扩展了一个全局变量，可是此全局变量的类型却没有相应的更新过来，就会导致 ts 编译错误，此时就需要扩展全局变量的类型。比如扩展 String 类型:
```javascript { .theme-peacock }
interface String {
    prependHello(): string;
}

'foo'.prependHello();
```
通过**声明合并**，使用 interface String 即可给 String 添加属性或方法。也可以使用 declare namespace 给已有的命名空间添加类型声明.

### 在 npm 包或 UMD 库中扩展全局变量
如之前所说，对于一个 npm 包或者 UMD 库的声明文件，只有 export 导出的类型声明才能被导入。所以对于 npm 包或 UMD 库，如果导入此库之后会扩展全局变量，则需要使用另一种语法在声明文件中扩展全局变量的类型，那就是 declare global。
```javascript { .theme-peacock }
// src/types/foo
declare global {
    interface String {
        prependHello(): string;
    }
    interface jQuery {
        ajax(): string;
    }
}

export {};
// src/index.ts
'foo'.prependHello();

let jQuery: jQuery = {
    ajax() {
        return '';
    }
}

jQuery.ajax();
```
注意即使此声明文件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个全局变量的声明文件.

### 模块插件
有时通过 import 导入一个模块插件，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，而插件模块没有类型声明文件，就会导致类型不完整，缺少插件部分的类型。ts 提供了一个语法 declare module，它可以用来扩展原有模块的类型。

如果是需要扩展原有模块的话，需要在类型声明文件中先引用原有模块，再使用 **declare module** 扩展原有模块：

```javascript { .theme-peacock }
// src/types/moment-plugin/index.d.ts

import * as moment from 'moment';

declare module 'moment' {
    export function foo(): moment.CalendarKey;
}

// src/index.ts
import * as moment from 'moment';
import 'moment-plugin';

moment.foo();
```
#### 声明文件中的依赖
一个声明文件有时会依赖另一个声明文件中的类型，比如在前面的 declare module 的例子中，我们就在声明文件中导入了 moment，并且使用了 moment.CalendarKey 这个类型。

除了可以在声明文件中通过 import 导入另一个声明文件中的类型之外，还有一个语法也可以用来导入另一个声明文件，那就是三斜线指令。

#### 三斜线指令
与 namespace 类似，三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的三斜线指令来声明模块之间的依赖关系了。
但是在声明文件中，它还是有一定的用武之地。

类似于声明文件中的 import，它可以用来导入另一个声明文件。与 import 的区别是，当且仅当在以下几个场景下，我们才需要使用三斜线指令替代 import：

 - 当我们在书写一个全局变量的声明文件时
 - 当我们需要依赖一个全局变量的声明文件时

```javascript { .theme-peacock }
// src/types/jquery-plugin/index.d.ts

/// <reference types="jquery" />

declare function foo(options: JQuery.AjaxSettings): string;

// src/index.ts

foo({});
```
三斜线指令的语法如上，/// 后面使用 xml 的格式添加了对 jquery 类型的依赖，这样就可以在声明文件中使用 JQuery.AjaxSettings 类型了。

注意，三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释。

#### 依赖一个全局变量的声明文件
在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过 import 导入，当然也就必须使用三斜线指令来引入了。
```javascript { .theme-peacock }
// src/types/node-plugin/index.d.ts

/// <reference types="node" />

export function foo(p: NodeJS.Process): string;

// src/index.ts

import { foo } from 'node-plugin';

foo(global.process);
```
在上面的例子中，我们通过三斜线指引入了 node 的类型，然后在声明文件中使用了 NodeJS.Process 这个类型。最后在使用到 foo 的时候，传入了 node 中的全局变量 process。

由于引入的 node 中的类型都是全局变量的类型，它们是没有办法通过 import 来导入的，所以这种场景下也只能通过三斜线指令来引入了。

以上两种使用场景下，都是由于需要书写或需要依赖全局变量的声明文件，所以必须使用三斜线指令。在其他的一些不是必要使用三斜线指令的情况下，就都需要使用 import 来导入。

#### 拆分声明文件
```javascript { .theme-peacock }
// node_modules/@types/jquery/index.d.ts

/// <reference types="sizzle" />
/// <reference path="JQueryStatic.d.ts" />
/// <reference path="JQuery.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="legacy.d.ts" />

export = jQuery;
```
其中用到了 types 和 path 两种不同的指令。它们的区别是：types 用于声明对另一个库的依赖，而 path 用于声明对另一个文件的依赖。

上例中，sizzle 是与 jquery 平行的另一个库，所以需要使用 types="sizzle" 来声明对它的依赖。而其他的三斜线指令就是将 jquery 的声明拆分到不同的文件中了，然后在这个入口文件中使用 path="foo" 将它们一一引入。

### 自动生成声明文件
如果库的源码本身就是由 ts 写的，那么在使用 tsc 脚本将 ts 编译为 js 的时候，添加 declaration 选项，就可以同时也生成 .d.ts 声明文件了。

我们可以在命令行中添加 --declaration（简写 -d），或者在 tsconfig.json 中添加 declaration 选项。这里以 tsconfig.json 为例：
```javascript { .theme-peacock }
{
    "compilerOptions": {
        ...
        "declaration": true,
    }
}
```

### 发布声明文件
当我们为一个库写好了声明文件之后，下一步就是将它发布出去了。
此时有两种方案：

 1. 将声明文件和源码放在一起
 2. 将声明文件发布到 @types 下

这两种方案中优先选择第一种方案。保持声明文件与源码在一起，使用时就不需要额外增加单独的声明文件库的依赖了，而且也能保证声明文件的版本与源码的版本保持一致。

#### 将声明文件和源码放在一起
如果声明文件是通过 tsc 自动生成的，那么无需做任何其他配置，只需要把编译好的文件也发布到 npm 上，使用方就可以获取到类型提示了。

如果是手动写的声明文件，那么需要满足以下条件之一，才能被正确的识别：

 - 给 package.json 中的 types 或 typings 字段指定一个类型声明文件地址
 - 在项目根目录下，编写一个 index.d.ts 文件
 - 针对入口文件（package.json 中的 main 字段指定的入口文件），编写一个同名不同后缀的 .d.ts 文件
```javascript { .theme-peacock }
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "types": "foo.d.ts",
}
```
指定了 types 为 foo.d.ts 之后，导入此库的时候，就会去找 foo.d.ts 作为此库的类型声明文件了。

typings 与 types 一样，只是另一种写法。

如果没有指定 types 或 typings，那么就会在根目录下寻找 index.d.ts 文件，将它视为此库的类型声明文件。

如果没有找到 index.d.ts 文件，那么就会寻找入口文件（package.json 中的 main 字段指定的入口文件）是否存在对应同名不同后缀的 .d.ts 文件。

比如 package.json 是这样时:
```javascript { .theme-peacock }
// index.d.ts ？ lib.index.d.ts ?
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js"
}
```

就会先识别 package.json 中是否存在 types 或 typings 字段。发现不存在，那么就会寻找是否存在 index.d.ts 文件。如果还是不存在，那么就会寻找是否存在 lib/index.d.ts 文件。假如说连 lib/index.d.ts 都不存在的话，就会被认为是一个没有提供类型声明文件的库了。

有的库为了支持导入子模块，比如 import bar from 'foo/lib/bar'，就需要额外再编写一个类型声明文件 lib/bar.d.ts 或者 lib/bar/index.d.ts，这与自动生成声明文件类似，一个库中同时包含了多个类型声明文件

### 将声明文件发布到 @types 下
如果我们是在给别人的仓库添加类型声明文件，但原作者不愿意合并 pull request，那么就需要将声明文件发布到 @types 下。

与普通的 npm 模块不同，@types 是统一由[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 管理的。要将声明文件发布到 @types 下，就需要给 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 创建一个 pull-request，其中包含了类型声明文件，测试代码，以及 tsconfig.json 等。

pull-request 需要符合它们的规范，并且通过测试，才能被合并，稍后就会被自动发布到 @types 下。

