# Typescript（十二）：基于泛型的类型推导


## 类型回顾

### 基本类型

基本类型，也可以理解为原子类型。包括number、boolean、string、null、undefined、function、array、字面量（true，false，1，2，‘a’）等。它们无法再细分。

### 复合类型

TypeScript的复合类型可以分为两类：`set` 和 `map`。

`set` 类型是指一个无序的、无重复元素的集合。
`map` 类型则和JS中的对象一样，是一些没有重复键的键值对。

```javascript { .theme-peacock }
// set  如：联合类型
type Size = 'small' | 'default' | 'big' | 'large';
// map  如：接口
interface IA {
    a: string
    b: number
}
```

### 复合类型间的转换

```javascript { .theme-peacock }
// 基于 map 类型 构造 set 类型
type IAKeys = keyof IA;    // 'a' | 'b'
type IAValues = IA[keyof IA];    // string | number

// 基于 set 类型 构造 map 类型
type SizeMap = {
    [k in Size]: number
}
// 等价于
type SizeMap2 = {
    small: number
    default: number
    big: number
    large: number
}
```

### 类型操作符 keyof

keyof T，索引类型查询操作符。 对于任何类型T，keyof T的结果为 T 上已知的公共属性名的联合。

```javascript { .theme-peacock }
interface Person {
    name: string;
    age: number;
}

// keyof Person <==> 'name' | 'age' 等价
let person: keyof Person;


interface Person {
    name: string;
    age: number;
    address?: string;
    isMale?: boolean
}
// keyof Person <==> "name" | "age" | "address" | "isMale" 等价
```


### 类型操作符 T[K]

T[K]，索引访问操作符

表达式语法：person['name'] 与 类型语法：Person['name']

然后，就像索引类型查询一样，你可以在普通的上下文里使用类型语法 T[K]

## 泛型约束

泛型可以指代可能的参数类型，但指代任意类型范围太模糊，当我们需要对参数类型加以限制，或者确定只处理某种类型参数时，就可以对泛型进行 extends 修饰加以约束。

```javascript { .theme-peacock }
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

loggingIdentity({length: 10, value: 3});
```


## 基于泛型的类型推导

```javascript { .theme-peacock }
interface Person {
    name: string;
    age: number;
    address?: string;
    isMale?: boolean
}

let person: Person = {
    name: 'hey',
    age: 1
};

function getProperty(obj, key) {
  return obj[key];
}

function getProperty(obj: object, key: string) {
  return obj[key];
}

function getProperty<T>(obj: T, key: keyof T) {
  return obj[key];
}

// ? 不够精确
let name: string | number | boolean = getProperty(person, 'name'); // ok
let age: number = getProperty(person, 'age'); // error
let unknown = getProperty(person, 'unknown'); // error


// (obj: T, key: K) 意味着 obj[key]: T[K]
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]; //对参数 key 的类型启用类型推导： obj[key] is of type T[K]
}

let name: string = getProperty(person, 'name'); // ok
let age: number = getProperty(person, 'age'); // ok
let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in "name" | "age" | "address" | "isMale"
```

Typescript 的类型是可编程的。要新定义一个类型，是可以基于已有的类型，通过编程的手段，进行转化加工，最终得到一个新类型。而不是去从头到尾去定义这个新的类型。

在利用泛型做类型推导时, 需要知道:

1. 泛型只服务于类型的静态分析, 不服务于 Javascript 运行时；
2. 在考虑类型推导时的逻辑推算, 不应考虑"它在运行时会得到何种类型", 而应考虑"基于类型本身的特性会得到何种类型"；

### 全键可选

```javascript { .theme-peacock }
// 定义
/**
 * Make all properties in T optional
 * 构造类型T，并将它所有的属性设置为可选的。它的返回类型表示输入类型的所有子类型。
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// 1. 基于接口 Form，返回接口属性均修改为可选的 UninitForm 所有子类型作为其子类型。
interface Form {
    name: string
    age: number
    sex: 'male' | 'female' | 'other'
}

type UninitForm = Partial<Form>
// 等价于
{
    name?: string;
    age?: number;
    sex?: "male" | "female" | "other";
}

// 2. 对象的更新，确保了函数参数对应的更新对象是原对象的所有子类型
interface Todo {
    title: string;
    description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
    return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
    title: 'title1',
    description: 'description1',
};

const todo2 = updateTodo(todo1, {
    description: 'description2',
});

// output ===> todo2: {
//     title: 'title1',
//     description: 'description2',
// };
```

### 全键必选

```javascript { .theme-peacock }
/**
 * Make all properties in T required
 * 构造一个类型，使类型T的所有属性为required。
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};

这里可以看到一个有意思的用法 -?, 含义就是将可选项代表的 ? 去掉, 从而让这个类型变成必选项. 与之对应的还有个+? , 这个含义自然与-?之前相反, 它是用来把属性变成可选项的.

// 1. 构造基于接口 CasualForm 的全键必选类型
interface CasualForm {
    name?: string;
    age?: number;
    sex?: "male" | "female" | "other";
}

type AllKeyRequriedForm = Required<CasualForm>


const obj: CasualForm = { name: 'hey' }; // OK

const obj2: AllKeyRequriedForm = { name: 'hey' }; // error

```

### 全键只读&&全键可写

```javascript { .theme-peacock }
/**
 * Make all properties in T readonly
 * 构造类型T，并将它所有的属性设置为readonly，也就是说构造出的类型的属性不能被再次赋值。
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Mutable<T> = { 
    -readonly [P in keyof T]: T[P];
} 
// 1. 基于Readonly类型别名声明的常量
interface Todo {
    title: string;
}

const todoReadonly: Readonly<Todo> = {
    title: 'raw title',
};

const todoMutable: Mutable<Todo> = {
    title: 'raw title',
};

todoReadonly.title = 'modified title'; // error
todoMutable.title = 'modified title'; // ok

// 2. 冻结对象的泛型函数描述
function freeze<T>(obj: T): Readonly<T> {
    return obj;
}

interface Todo {
    title: string;
}

const hey: Todo = {
    title: 'hey'
}

const todoFreeze = freeze(hey)

todoFreeze.title = 2;
```

### 条件类型：基于extends 三元推导

用来表述非单一形式的类型.

>Working through our (enormous) backlog of unsorted TypeScript "Suggestions" and it's remarkable how many of them are solved by conditional types.
-- Ryan Cavanaugh

形如 T extends [DEP] ? [RESULT1] : [RESULT2] 的表达式, 是 typescript 中的一种类型推导式, 它的规则是:

若泛型 T 必须满足 [DEP] 的约束(即 T extends [DEP] 为 true), 则表达式结果为 [RESULT1]; 反之表达式结果为 [RESULT2]:

1. 当 [DEP] 是基本类型时, 如果 T 是对应的基本类型, 则 T extends [DEP] 为 true, 反之为 false

2. 当 [DEP] 是 interface/class 时, 如果 T 必须满足它的约束, 则 T extends [DEP] 为 true, 反之为 false

3. 当 [DEP] 是 void/never 时, 按基本类型处理

4. 当 [DEP] 是 联合类型, 组成 [DEP] 的类型会依次代入 T 进行运算, 最终的结果是这些运算结果的联合类型

5. 当 [DEP] 是 any, 则 T extends [DEP] 恒为 true

应用：

```javascript { .theme-peacock }
/**
 * Extract from T those types that are assignable to U
 * 从类型T中提取所有可以赋值给U的类型，然后构造一个类型。
 */
type Extract<T, U> = T extends U ? T : never;

// 1.
type T0 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T1 = Extract<string | number | (() => void), Function>;  // () => void

/**
 * Exclude from T those types that are assignable to U
 * 从类型T中剔除所有可以赋值给U的属性，然后构造一个类型。
 */
type Exclude<T, U> = T extends U ? never : T;

// 2. 
type T0 = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "f">; // "b" | "c"
type T2 = Exclude<string | number | (() => void), Function>;  // string | number
```

### 挑选 && 排除

```javascript { .theme-peacock }
/**
 * From T, pick a set of properties whose keys are in the union K
 * 从类型T中挑选部分属性K来构造类型。
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// 1.
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
};

/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
/**
 * equivalent to { name: string, age: number }
 */
type SimplePersonInfo = Omit<Person, 'sex'>
```

