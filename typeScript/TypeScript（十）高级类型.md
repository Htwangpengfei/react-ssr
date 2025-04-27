# 操作符

## typeof
typeof返回操作数类型。
``` javascript { .theme-peacock }
enum Direction {
	Up,
    Down,
    Left,
    Right,
}
console.log(typeof Direction); // object

class People {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}
console.log(typeof People); // function
class Parent extends People {
    constructor(name: string, age: number) {
        super(name, age);
    }
    greet() {
        console.log('I am Parent');
    }
}
class Child extends People {
    constructor(name: string, age: number) {
        super(name, age);
    }
    greet() {
        console.log('I am Child');
    }
}
function getPeoplePrototype(people: typeof People): any {
    return people.prototype;
}
getPeoplePrototype(Parent).greet(); // I am Parent
getPeoplePrototype(Child).greet(); // I am Child
``` 

## &
``` javascript { .theme-peacock }
type index = string & number; // never
``` 

## |
``` javascript { .theme-peacock }
type index = string | number; // string | number
``` 


## keyof 索引类型查询操作符
keyof获取操作数的可访问索引字符串字面量类型。
``` javascript { .theme-peacock }
interface Person {
    name: string;
    age: number;
    location: string;
}
type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // "length" | "push" | "pop" | "concat" | ...
``` 

## in
in迭代对象的`键`。
``` javascript { .theme-peacock }
let list: number[] = [4, 5, 6];
for (let i in list) {
    console.log(i); // 0, 1, 2
}
``` 

# 高级类型

## 交叉类型（Intersection Types）
交叉类型是将多个类型合并为一个类型，用`&`分隔每个类型。
``` javascript { .theme-peacock }
interface Boy {
	name: string,
    age: number,
    favoriteGame: string
}
interface Girl {
    name: string,
    age: number,
    favoriteColor: string
}
type Intersection = Boy & Girl;
    let i: Intersection = {
	name: 'ChenJingzhi',
    age: 18,
    favoriteGame: 'lualu',
    favoriteColor: 'blue'
};
i.name;
i.favoriteGame;
i.favoriteColor;
``` 

## 联合类型（Union Types）
联合类型表示一个值可以是几种类型之一，用竖线`|`分隔每个类型。
如果一个值是联合类型，则只能访问此联合类型的所有类型里共有的成员。
``` javascript { .theme-peacock }
// 函数
function getDate(date?:  number | string | Date): Date  {
	console.log(date.length); // error
	console.log((<string>date).length); // 类型断言
	return new Date(date!);
}

// 接口
interface Boy {
	name: string,
    age: number,
    favoriteGame: string
}
interface Girl {
    name: string,
    age: number,
    favoriteColor: string
}
type Union = Boy | Girl;
let u: Union = {
	name: 'ChenJingzhi',
    age: 18,
    favoriteGame: 'lualu',
    favoriteColor: 'blue'
};
u.name;
// u.favoriteGame;
// u.favoriteColor;
// 类型断言
(<Boy>u).favoriteGame;
(<Girl>u).favoriteColor;

// 字符串字面量类型
type Easing = "ease-in" | "ease-out" | "ease-in-out";
function animate(dx: number, dy: number, easing: Easing) {
	if (easing === "ease-in") {
    }
    else if (easing === "ease-out") {
    }
    else if (easing === "ease-in-out") {
    }
    else {
        console.log('easing type is error');
    }
}
animate(0, 0, "ease-in");
animate(0, 0, "uneasy"); // error

// 数字字面量类型
type Score = 1 | 2 | 3;
function rank(score: Score) {
  if (score === 1) {
  }
  else if (score === 2) {
  }
  else if (score === 3) {
  }
}
rank(3);
// rank(0);

// 别名
// interface OneColor {
//   red?: string,
//   yellow?: string,
// }
type OneColor = { red: string, } | { yellow: string, }
```

## 可辨识联合（Discriminated Unions）
合并单例类型、联合类型、类型保护和类型别名来创建可辨识联合的高级模式，即标签联合或代数数据类型。 可辨识联合有3个要素：
(1)具有普通的单例类型属性— 可辨识的特征
(2)一个类型别名包含类型的联合— 联合
(3)属性上的类型保护

``` javascript { .theme-peacock }
interface Square {
    kind: "square"; // (1)
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
type Shape = Square | Rectangle | Circle; // (2)
function area(s: Shape) {
    switch (s.kind) { // (3)
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
``` 

## 索引类型（Index types）
索引类型查询操作符keyof可以获取操作数的可访问索引字符串字面量类型。
场景：一个函数从对象中选取属性的子集
``` javascript { .theme-peacock }
// Javascript
function pluck(o, names) {
    return names.map(n => o[n]);
}
```
``` javascript { .theme-peacock }
// Typescript
// function pluck(o: object, names: string[]) {
//   return o[name]
// }
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}
interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Tom',
    age: 35
};
let strings: string[] = pluck(person, ['name']);
// T = Person
// K = "name" | "age"
// T[k] = Person["name"] = "Tom"
// T[k][] = ["Tom", "35"]
``` 

## 映射类型
映射类型允许新类型以相同的形式去转换旧类型里每个属性。
场景： 一个已知的类型每个属性都变为布尔类型
``` javascript { .theme-peacock }
interface Taste {
	hot: boolean,
	sweet: boolean
}
type TasteKeys = 'hot' | 'sweet';
type TasteMap = { [K in TasteKeys]: boolean };
``` 
映射类型有3个要素：
(1) 类型变量 K，依次绑定到每个属性。
(2) 字符串字面量联合类型，包含要迭代的属性名集合。
(3) 属性的结果类型。
场景： 一个已知的类型每个属性都变为可选的、只读的
``` javascript { .theme-peacock }
interface Person {
	name: string;
	age: number;
}
interface PersonPartial {
    name?: string;
    age?: number;
}
interface PersonReadonly {
    readonly name: string;
    readonly age: number;
}
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
type Partial<T> = {
    [P in keyof T]?: T[P];
}
type PersonPartial = Partial<Person>;
// T = Person
// P = "name" | "age"
// T[P] = Person["name"] = string
type ReadonlyPerson = Readonly<Person>;
``` 

## 综合示例 (泛型、索引、映射、联合、交叉、never)
``` javascript { .theme-peacock }
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never })[T];
 type A = Diff<"a" | "b" | "c", "a">; // "b" | "c"
 type B = Diff<"a" | "b" | "c", "b" | "d">; // "a" | "c"
 // T = "a" | "b" | "c";
 // U = "b" | "d";
 type C = ({
     "a": "a",
     "b": "b",
     "c": "c"
 } & {
     "b": never,
     "d": never
})["a" | "b" | "c"];
type D = {
    "a": "a",
    "b": "b" & never,
    "c": "c",
     "d": never
  }["a" | "b" | "c"];
type E = {
    "a": "a",
    "b": never,
    "c": "c",
    "d": never
 }["a" | "b" | "c"];
 type F = "a" | never | "c";
 type G = "a" | "c";
``` 

## 类型保护

### 自定义类型保护
自定义类型保护即定义一个函数，返回值为`parameterName is Type`类型谓词。调用此函数时，TypeScript会将变量类型收缩为具体的类型，只要该类型与变量的原始类型是兼容的。
``` javascript { .theme-peacock }
function isNumber(x: any): x is number {
  return typeof x === "number";
}
function isString(x: any): x is string {
  return typeof x === "string";
}
function getString(arg: number | string): any {
	if (isString(arg)) {
    return arg.length;
	}
	else if (isNumber(arg)) {
    return arg.toString();
  }
}
```

###  typeof 类型保护
typeof类型保护只能识别两种形式`typeof v === "typename"`和`typeof v !== "typename"`；
typename必须是number、string、boolean或symbol，其余的typeof检测结果不可靠，不作为类型保护。
``` javascript { .theme-peacock }
// 类型保护
function getString(arg: number | string): any {
	if (typeof arg === 'string') {
    return arg.length;
	}
	else if (typeof arg === 'number') {
    return arg.toString();
  }
}
// 非类型保护
let y: any = () => {};
if (typeof y === 'function') {
	console.log(y.arguments); // 运行报错
}
``` 

### instanceof 类型保护
instanceof类型保护的右侧要求是一个构造函数，左侧类型被收缩为：
(1) 类实例的类型，即构造函数的prototype属性的类型
(2) 构造函数所返回的类型的联合
``` javascript { .theme-peacock }
// 类实例的类型
let x: Date | RegExp = new Date();
if (x instanceof RegExp) {
  x.test('');
}
else {
  x.getTime();
}
``` 

### in类型保护
```javascript { .theme-peacock }
interface A { a: number };
interface B { b: string };

function foo(x: A | B) {
    if ("a" in x) {
        return x.a;
    }
    return x.b;
}
```
