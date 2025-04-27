# 函数
## 函数类型
```javascript { .theme-peacock }
// 函数声明
function add(x, y) {
	return x + y;
}
// 函数表达式
let myAdd = function(x, y) { return x + y; };
```
完整的函数类型定义包含两部分：**参数类型**和**返回值类型**。
(1) 参数类型
以参数列表的形式写出参数类型，为每个参数指定一个名字和类型，只要参数类型匹配，即为有效的函数类型，不关心函数名称。
(2) 返回值类型
在函数和返回值类型之前使用`=>`符号，如果函数没有返回任何值，必须指定返回值类型为 void。
(3) 若在赋值语句的一边指定类型但是另一边没有类型的话，TypeScript编译器会自动推断出类型。
```javascript { .theme-peacock }
// 函数声明
function add(x: number, y: number): number {
    return x + y;
}
// 函数表达式
let myAdd: (x: number, y: number) => number =
    function(x: number, y: number): number { return x + y; };
let myAdd1: (m: number, n: number) => number =
    function(x: number, y: number): number { return x + y; };
// 类型推论
let myAdd2 = function(x: number, y: number): number { return x + y; };
let myAdd3: (x: number, y: number) => number =
    function(x, y) { return x + y; };
// 函数接口
interface FuncAdd {
	(x: number, y: nuber): number
}
let myAdd4: FuncAdd = function(x: number, y: number): number { return x + y; };
```

## 可选参数
使用 `?`标记参数为可选，可选参数必须在必选参数后面。
```javascript { .theme-peacock }
function buildName(firstName: string, lastName?: string): string {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
let result1 = buildName("Bob", "Adams");         // okay, returns "Bob Adams"
let result2 = buildName("Bob");                  // okay, returns "Bob"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
```

## 默认参数
使用`=`为参数设置默认值，默认参数都是可选参数。 
```javascript { .theme-peacock }
function buildName(firstName: string, lastName = "Smith"): string {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob", "Adams");		 // okay, returns "Bob Adams"
let result2 = buildName("Bob");                  // okay, returns "Bob Smith"
let result3 = buildName("Bob", undefined);       // okay, returns "Bob Smith"
let result4 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
```
默认参数不必放在必选参数的后面，但如果默认参数出现在必选参数前面，用户必须明确的传入undefined值来获得默认值。
```javascript { .theme-peacock }
function buildName(firstName = "Will", lastName: string): string {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob", "Adams");         // okay, returns "Bob Adams"
let result2 = buildName(undefined, "Adams");     // okay, returns "Will Adams"
let result3 = buildName("Bob");                  // error, too few parameters
let result4 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
```
## 剩余参数
使用`...`设置剩余参数，剩余参数是个数不限的可选参数。
```javascript { .theme-peacock }
function buildName(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}
let employeeName1 = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
let employeeName2 = buildName("Joseph");
```

## 函数重载
重载允许一个函数接收不同数量或类型的参数作出不同的处理。一个函数定义多个函数类型来校验不同的参数情况。
```javascript { .theme-peacock }
function reverse(x: string): string;
function reverse(x: number): number;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```