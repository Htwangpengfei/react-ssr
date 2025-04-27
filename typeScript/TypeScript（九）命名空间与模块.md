# 命名空间（内部模块）
命名空间提供逻辑分组以防止名称冲突。

## 单文件命名空间
``` javascript { .theme-peacock }
namespace Validation {
	export interface FormValidator {
	    isAcceptable(s: string): boolean;
	}
	
	let lettersRegexp = /^[A-Za-z]+$/;
	let numberRegexp = /^[0-9]+$/;
	
	export class LettersValidator implements FormValidator {
	    isAcceptable(s: string) {
	        return lettersRegexp.test(s);
	    }
	}
	
	export class NumberValidator implements FormValidator {
	    isAcceptable(s: string) {
	        return s.length === 5 && numberRegexp.test(s);
	    }
	}
}
let validators: { [s: string]: Validation.FormValidator; } = {};
validators["letters"] = new Validation.LettersValidator();
validators["number"] = new Validation.NumberValidator();
```

## 多文件命名空间
``` javascript { .theme-peacock }
// Validation.ts
namespace Validation {
    export interface FormValidator {
        isAcceptable(s: string): boolean;
    }
}
```
``` javascript { .theme-peacock }
// LettersValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```
``` javascript { .theme-peacock }
// NumberValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
	let numberRegexp = /^[0-9]+$/;
    export class NumberValidator implements FormValidator {
	    isAcceptable(s: string) {
	        return s.length === 5 && numberRegexp.test(s);
	    }
	}
}
```

## 嵌套命名空间
成员的访问使用点号` . `
``` javascript { .theme-peacock }
// PersonValidation.ts
/// <reference path="Validation.ts" />
namespace Validation {
	export namespace PersonValidation {
        let numberRegexp = /^[0-9]+$/;
	    export class NumberValidator implements FormValidator {
		    isAcceptable(s: string) {
		        return s.length === 5 && numberRegexp.test(s);
		    }
		}
    }
}
```

# 模块（外部模块）
## export & import
此形式仅支持--module所有类型。
``` javascript { .theme-peacock }
// AllValidation.ts
// 默认导出
export default interface FormValidator {
    isAcceptable(s: string): boolean;
}
// 导出声明
const lettersRegexp = /^[A-Za-z]+$/;
const numberRegexp = /^[0-9]+$/;
export class LettersValidator implements FormValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}
class NumberValidator implements FormValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
// 导出语句
export { NumberValidator };
```

``` javascript { .theme-peacock }
// 导入模块某部分
import { LettersValidator } from "./AllValidation";
// 导入模块某部分并重命名
import { LettersValidator as lv } from "./AllValidation";
// 导入整个模块并重命名
import * as validator from "./AllValidation";
``` 

## export = & import = require()
此形式仅支持--module值为commonjs、amd。
``` javascript { .theme-peacock }
// EventEmitter.ts
interface Listener {
    (...values: any[]): void;
}
class EventEmitter {
    on(event: string | string[], listener: Listener) {
    };
    off(event: string, listener: Listener) {
    };
}
export = EventEmitter;
```
``` javascript { .theme-peacock }
import EventEmitter = require('./EventEmitter');
```

## 使用第三方库
``` javascript { .theme-peacock }
// types.d.ts
declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep: string;
}
declare module "express";
```
``` javascript { .theme-peacock }
// (1)node_modules/@types/jquery/index.d.ts
import $ = require('jquery');
import * as jquery from 'jquery';
// 开启--esModuleInterop
import jquery from 'jquery';
// (2)自定义.d.ts
import * as path from 'path';
// 开启--esModuleInterop
import path from 'path';
```

## 常见问题
1.如果仅导出单个 class 或 function，使用 export default
2.不要使用`/// <reference>`引入模块
3.不要将顶层命名空间导出为模块
不推荐
``` javascript { .theme-peacock }
// Shapes.ts
export namespace Shapes {
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
}
```
``` javascript { .theme-peacock }
import * as shapes from "./shapes";
let t = new shapes.Shapes.Triangle();
```
推荐
``` javascript { .theme-peacock }
// Shapes.ts
export class Triangle { /* ... */ }
export class Square { /* ... */ }
```
``` javascript { .theme-peacock }
import * as shapes from "./shapes";
let t = new shapes.Triangle();
```

# 模块解析
模块解析是指编译器在查找导入模块内容时所遵循的流程，如下：
(1) 编译器会尝试定位表示导入模块的文件。 编译器会遵循以下二种策略之一： Classic或Node。
(2) 如果上面的解析失败了并且模块名是非相对的，编译器会尝试定位一个外部模块声明。 
(3) 如果编译器还是不能解析这个模块，它会记录一个错误。

模块导入方式有相对导入和非相对导入两种，模块解析差异如下：
(1) 相对导入在解析时是相对于导入它的文件来进行解析，并且不能解析为一个外部模块声明。 
(2) 非相对导入在解析时相对于baseUrl或路径映射来进行解析，可以被解析成外部模块声明。 

## 模块解析策略
共有两种可用的模块解析策略Node和Classic。
(1) 使用`--moduleResolution`标记来指定模块解析策略。
(2) 若未指定，使用`--module AMD | System | ES2015`时的默认值为Classic，其它情况则为Node。

### Classic
#### 相对导入
``` javascript { .theme-peacock }
// /root/src/moduleA.ts
import { b } from "./moduleB";
```
``` javascript
/root/src/moduleB.ts
/root/src/moduleB.d.ts
```
![图片](https://agroup-bos.cdn.bcebos.com/61c3a78e58da68d09236be44dd8a2f2ec62d3477)

#### 非相对导入
编译器会从包含导入文件的目录开始依次向上级目录遍历。
``` javascript { .theme-peacock }
// /root/src/moduleA.ts
import { b } from "moduleB";
```

``` javascript
/root/src/moduleB.ts
/root/src/moduleB.d.ts

/root/moduleB.ts
/root/moduleB.d.ts

/moduleB.ts
/moduleB.d.ts
```
![图片](https://agroup-bos.cdn.bcebos.com/3652ba948037ab69fa04c22f27e607d7e6dd0bce)

### Node
TypeScript在Node解析逻辑基础上增加了TypeScript源文件的扩展名`.tsx`。 
TypeScript在 package.json里使用字段`types`来表示类似`main`的意义 ，编译器根据该字段找到对应文件。
#### 相对导入
``` javascript { .theme-peacock }
// /root/src/moduleA.ts
import { b } from "./moduleB";
```
``` javascript
/root/src/moduleB.ts
/root/src/moduleB.tsx
/root/src/moduleB.d.ts
/root/src/moduleB/package.json ("main"或"types"属性)
/root/src/moduleB/index.ts
/root/src/moduleB/index.tsx
/root/src/moduleB/index.d.ts
``` 
![图片](https://agroup-bos.cdn.bcebos.com/24d48650ca43a723c85f639a8bba5e79e0a9973c)

#### 非相对导入
编译器会从与当前文件同级目录下的node_modules开始依次向上级目录node_modules遍历。
``` javascript { .theme-peacock }
// /root/src/moduleA.ts
import { b } from "moduleB";
```
``` javascript
/root/src/node_modules/moduleB.ts
/root/src/node_modules/moduleB.tsx
/root/src/node_modules/moduleB.d.ts
/root/src/node_modules/moduleB/package.json
/root/src/node_modules/moduleB/index.ts
/root/src/node_modules/moduleB/index.tsx
/root/src/node_modules/moduleB/index.d.ts

/root/node_modules/moduleB.ts
/root/node_modules/moduleB.tsx
/root/node_modules/moduleB.d.ts
/root/node_modules/moduleB/package.json
/root/node_modules/moduleB/index.ts
/root/node_modules/moduleB/index.tsx
/root/node_modules/moduleB/index.d.ts

/node_modules/moduleB.ts
/node_modules/moduleB.tsx
/node_modules/moduleB.d.ts
/node_modules/moduleB/package.json
/node_modules/moduleB/index.ts
/node_modules/moduleB/index.tsx
/node_modules/moduleB/index.d.ts
```
![图片](https://agroup-bos.cdn.bcebos.com/ae08ce223a365d1330a611bb18e9f42b6b0a29a5)

## 跟踪模块解析
启用--traceResolution
http://agroup.baidu.com/chenjingzhi/md/edit/2390946