# TypeScript（四）：类

本章开始主要介绍TypeScript中的类（class）

## 前言

传统的JavaScript程序使用函数和基于原型的继承来创建可重用的组件，但对于熟悉使用面向对象方式的程序员来讲就有些棘手，因为他们用的是基于类的继承并且对象是由类构建出来的。 从ECMAScript 2015，也就是ECMAScript 6开始，JavaScript程序员将能够使用基于类的面向对象的方式。 使用TypeScript，我们允许开发者现在就使用这些特性，并且编译后的JavaScript可以在所有主流浏览器和平台上运行，而不需要等到下个JavaScript版本。

```javascript { .theme-peacock }
// class-1.ts

interface IRacer {
    category: string;
    signUp(): void;
}

class Animal {
    name?: string;
    constructor(theName: string) {
        this.name = theName;
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Horse extends Animal implements IRacer {
    category: string;
    constructor(name: string, category: string) {
        super(name);
    this.category = category;
    }

    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }

    signUp() {
        console.log(`${this.name} is signed ${this.category}`);
    }
}

let tom: Horse = new Horse("Tommy", "horsemanship");

tom.move(34);
tom.signUp();

```

## 鸭式辨型法

> TypeScript的核心原则之一是对值所具有的结构进行类型检查。 也被称做“鸭式辨型法”或“结构性子类型化”。

基于鸭式辨型法，TypeScript中两个结构相同对象可以互相赋值。

```javascript { .theme-peacock }
// class-2.ts

class Animal {
    name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}

class Employee {
    name: string;
    constructor(name: string, public age: number) {
        this.name = name;
    }
}

let animal: Animal = new Animal("Goat");
let employee: Employee = new Employee("Bob", 1);
let employeeAnimal: Animal = new Employee("Bob", 10);

animal = rhino;
animal = employee;
```

## 修饰符

修饰符可以方便的描述类中成员属性的作用域，以及可以对属性执行的操作。在JavaScript中，人们普遍使用 `_`  前缀来表示私有变量，`$` 前缀来表示系统变量。

在TypeScript编译的过程中，TS编译器会根据不同的属性修饰符，来确定对属性的访问和操作是否合法。

###  public

* 使用 `public` 修饰的变量可以被任意访问。
* 如果一个属性没有设置修饰符，则默认为 `public`。

```javascript { .theme-peacock }
// class-3.ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }

    speak() {
        console.log(`${this.name}: woof woof !`);
    }
}

let dog: Dog = new Dog("yubao");
dog.speak();
dog.move(10);
console.log(dog.name);
```

### private

#### 属性被标记成 private时，它就不能在声明它的类的外部访问

1. `private` 属性不能被派生类访问
2. `private` 属性不能实例访问

```javascript { .theme-peacock }
// class-4.ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
    private move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
    public run() {
        console.log(`${this.name} runing.`);
        this.move(30);
    }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.

class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }

    speak() {
        console.log(`${this.name}: woof woof !`);// 错误：'name' 是私有的.
    }
}

let dog: Dog = new Dog("dog");  
dog.move(10);     // 错误：'move' 是私有的.
dog.run();   // 正确
```

#### 会导致"鸭式辨型法"失灵，两个相同描述的类的实例不能兼容

```javascript { .theme-peacock }
// class-5.ts

class Animal {
    private name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}

class Employee {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}

let animal: Animal = new Animal("Goat");
let employee: Employee = new Employee("Bob");

animal = employee; // 错误: Animal 与 Employee 不兼容.

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}
animal = new Rhino();  // 正确: Rhino 继承了 Animal
```

### protected

* 与 **`protected` 成员在派生类中仍然可以访问**。
* 也会导致"鸭式辨型法"失灵

```javascript { .theme-peacock }
// class-6.ts

class Animal {
    protected name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.

class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }

    speak() {
        console.log(`${this.name}: woof woof !`);   // 正确
    }
}
```

### readonly

* `readonly` 修饰的属性在初始化之后不允许被改变
* 只读属性必须在声明时或构造函数里被初始化
* 不影响"鸭式辨型法"

```javascript { .theme-peacock }
// class-7.ts

class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
	
	setName(theName: string) {
        this.name = theName;  // 错误：只读属性对象初始化完成后赋值
    }
}
```

### getter / setter

* 基本与 ES5 中的getter / setter 一致
* 只有getter的属性会被自动推断为 readonly
```javascript { .theme-peacock }
// class-8.ts

let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }
    
    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";   // 成功

passcode = "secret";
let bob = new Employee();
bob.fullName = "Wob Wiler";   // 失败

```

### 参数属性

参数属性可以方便地让我们在一个地方定义并初始化一个成员。

```javascript { .theme-peacock }
// class-9.ts

class Animal {
    protected name: string;
    public age: number;
    readonly birthday: string;
    constructor(name: string, age: number, birthday: string) { 
	    this.name = name; 
	    this.age = age;
	    this.birthday = birthday;
	}
}

// 使用参数属性
class Animal {
    constructor(protected name: string, public age: number, readonly birthday: string) {}
}
```

## 静态属性 / 方法

* TypeScript 中同样支持静态属性 / 方法，使用方式与**ES6** 基本一致

```javascript { .theme-peacock }
// class-10.ts

class Grid {
    static origin = {x: 0, y: 0};
	constructor (public scale: number) {}
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }

    static print() {
         console.log(Grid.origin);
    }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));

let gridStruct: typeof Grid = Grid;
gridStruct.print();
```

代码 `class-10.ts:23` 中使用了 `typeof Grid` 意思是取Greeter类的类型，而不是实例的类型。你可以有如下方案来设置一个变量为类的类型

```javascript { .theme-peacock }

let gridStruct: typeof Grid = Grid;
let gridStruct = Grid;  // 利用TypeScript的类型推断

```


## 类的继承

面向对象的特征之一：继承

```javascript { .theme-peacock }
// class-11.ts

class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

类从基类中继承了属性和方法。 这里， Dog是一个 派生类，它派生自 Animal 基类，通过 extends关键字。 派生类通常被称作 子类，基类通常被称作 超类。

### 上转型

父类声明，子类实例化的对象称为上转型对象。

#### 特征

* 上转对象不能操作子类新增的成员变量，失掉了这部分属性，不能使用子类新增的方法，失掉了一些功能。
* 上转型对象可以操作子类继承的成员变量，也可以使用子类继承的或重写的方法。
* 如果子类重写了父类的某个方法后，当对象的上转型对象调用这个方法时一定是调用了子类重写的方法。
* 不可以将父类创建的对象赋值给子类声明的对象。
*  **TypeScript不可以将上转型对象再强制转换为一个子类对象，此时对象又具备了子类所有属性和功能（即将上转型对象还原为子类对象）。**

#### 示例

```javascript { .theme-peacock }
// class-12.ts

class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Horse extends Animal {
    constructor(name: string, public age: number) {
        super(name);
    }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let horse = new Horse("Tommy the Palomino", 10);let tom: Animal = horse;
// or let tom = <Animal> horse;

tom.move(34);

// console.log(tom.age);    // 错误：age不存在
let tom1: Horse = tom;      // 错误：ts中的不能将上转型对象赋值给派生类对象

```

## 抽象类

* 抽象类做为其它派生类的基类使用。 
* 它们一般不会直接被实例化。 
* 不同于接口，抽象类可以包含成员的实现细节。 
* abstract关键字是用于在抽象类内部定义抽象方法。
* 抽象方法必须在派生类中实现。

```javascript { .theme-peacock }
// class-13.ts

abstract class Department {
    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 抽象方法
}

class AccountingDepartment extends Department {

    constructor(public name: string) {
     
    }

    printMeeting(): void {   // 必须实现抽象类中的抽象方法
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printMeeting();

//按tab键跳到这里
```

## Next

本章未涉及以下部分，将在后续对应章节中补充：

1. 接口实现 -- 在interface中介绍
2. 混合类  --  在泛型中介绍

## 习题

1. 实现一个抽象类：Person，要求生日、姓名只读，且包含抽象方法；
2. 实现一个Person类的派生类：Male；
