# TypeScript（六）：type

在之前的场景，我们介绍了class，interface。同时在 [TypeScript（二）：基础语法
](http://agroup.baidu.com/swan-doc/md/article/2330764) 中我们使用type语法，本章的主要目的是对过去讲解的内容做一个回顾，说明不同类型定义方式的区别

## type：类型别名

别名，顾名思义，就是给一个类型起个新名字便于记忆和使用。

```javascript { .theme-peacock }
// type-1.ts

type Name = string;
type ShowName = () => string; // Typescript 中的 =>
type NameOrShowName = Name | ShowName; // 联合类型

const getName = (name: NameOrShowName) => { // ES6 中的 =>
    if(typeof name === 'string'){
        return name;
    } else {
        return name();
    }
}

let showName = () => 'pr is a boy';

console.log(getName('pr')); // pr
console.log(getName(showName())); // pr is a boy

```

### 其他定义

```javascript { .theme-peacock }
// type-2.ts

// primitive
type Name = string;
 
// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };
 
// union
type PartialPoint = PartialPointX | PartialPointY;
 
// tuple
type Data = [number, string];
 
// dom
let div = document.createElement('div');
type B = typeof div;

// 字面量
type EventNames = 'click' | 'scroll' | 'mousemove';
```


## 复杂类型

在TypeScript中，我们也可以通过type来定义一个复杂类型。

```javascript { .theme-peacock }
// type-3.ts

// type
type Animal = {
    readonly name: string;
    age?: number;
}

let animal: Animal = {
    name: 'bob',
    age: 10
}
```

在 `type-3.ts` 代码中，我们看到type定义对象时，与interface非常相似，都支持可选属性、只读属性。

```javascript { .theme-peacock }
// type-4.ts

// 错误：Cannot assign to 'name' because it is a read-only property
animal.name = 'jone';
```

## type、class、interface

type、class、interface非常相似，在很多场景中都可以互通有无。

### 相同：都可以描述一个对象

针对 `type-3.ts` 中Animal的定义，无论使用class，还是interface都是可行的。

```javascript { .theme-peacock }
// type-5.ts

// class or interface
class /* interface */ Animal {
    readonly name: string;
    age?: number;
}

let animal: Animal = {
    name: 'bob',
    age: 10
}

// type
type Animal = {
    readonly name: string;
    age?: number;
}

let animal: Animal = {
    name: 'bob',
    age: 10
}
```

### 相同：都允许扩展

interface、type、class 都可以拓展，并且不是相互独立的，也就是说 interface 可以 extends type, type 也可以 extends interface 。 **虽然效果差不多，但是两者语法不同**

```javascript { .theme-peacock }
// type-6.ts

// interface extends interface
interface Name { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}

// type extends type
type Name = { 
  name: string; 
}
type User = Name & { age: number  };

// interface extends type
type Name = { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}

// type extends interface
interface Name { 
  name: string; 
}
type User = Name & { 
  age: number; 
}
```

### 不同

#### type 可以声明基本类型别名，联合类型，元组等类型

```javascript { .theme-peacock }
// type-7.ts

// 基本类型别名
type Name = string

type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]
```

#### type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```javascript { .theme-peacock }
// type-8.ts
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```

#### interface 可以声明合并

```javascript { .theme-peacock }
// type-9.ts

interface Point { x: number; }
interface Point { y: number; }
 
const point: Point = { x: 1, y: 2 };
```

#### class 支持可以通过new来示例化，且支持private等私有属性

```javascript { .theme-peacock }
// type-10.ts

class Animal {
    readonly name: string;
    age?: number;
	private color: string;
}
```

## 总结

优先使用type，某些特定场景根据需要来选择使用class or interface