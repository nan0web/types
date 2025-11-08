# @nan0web/types

|[Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Документація|Тестове покриття|Фічі|Версія npm|
|---|---|---|---|---|
|🟢 `99.7%`|🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/types/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/types/blob/main/docs/uk/README.md)|🟢 `99.3%`|✅ d.ts 📜 system.md 🕹️ playground|1.0.3|

Мінімалістичний інструментарій без зовнішніх залежностей для роботи з JavaScript‑структурами даних, конверсіями та валідацією типів. Створений згідно з [філософією nan0web](https://github.com/nan0web/monorepo/blob/main/system.md#nanweb-nan0web), де нуль — це нескінченне джерело (Всесвіт), звідки виникають значущі структури.

Цей пакет допомагає безпечно працювати з типами, об’єктами, масивами, документами у форматі NaN0 та базовими деревовидними структурами, такими як відступний текст. Особливо корисний у монорепо, де потрібні легкі, перевірені та багаторазово використані утиліти.

## Встановлення

Як встановити за допомогою npm?
```bash
npm install @nan0web/types
```

Як встановити за допомогою pnpm?
```bash
pnpm add @nan0web/types
```

Як встановити за допомогою yarn?
```bash
yarn add @nan0web/types
```

## Основні концепції

Пакет спроектовано з урахуванням мінімалізму та точності:
- ✅ Повністю типізовано за допомогою **JSDoc** та `.d.ts`‑файлів
- 🔁 Підтримує синхронні та асинхронні операції
- 🧠 Створений для когнітивної ясності: кожна функція має чітку мету
- 🌱 Не має зовнішніх залежностей

## Використання: базові типи

### `match(test, options)`
Перевіряє, чи будь‑який з аргументів відповідає рядковому або regex‑шаблону.

- **Параметри**
  - `test` (string|RegExp) – Шаблон для порівняння.
  - `options` (object, optional) – Параметри порівняння.
    - `caseInsensitive` (boolean) – За замовчуванням `false`.
    - `stringFn` (string) – Метод типу `includes`, `startsWith` тощо.
    - `method` ("some"|"every") – Перевіряти один чи усі аргументи. За замовчуванням `"some"`.

Як використовувати `match(regex)`?
```js
import { match } from "@nan0web/types"
const fn = match(/^hello$/)
console.info(fn("hello", "world")) // ← true
```

### `Enum(...values)`

Валідує значення (або масив значень) проти списку дозволених значень або кастомних функцій‑валидаторів.

Як валідувати за допомогою Enum?
```js
import { Enum } from "@nan0web/types"
const color = Enum('red', 'green', 'blue')
console.info(color('red')) // ← red
console.info(color('yellow')) // ← throws a TypeError → Enumeration must have one value of..
```

### `oneOf(...args)`
Повертає значення, якщо воно міститься у списку, інакше повертає `undefined`.

Як використовувати oneOf?
```js
import { oneOf } from "@nan0web/types"
const fn = oneOf("a", "b", "c")
console.info(fn("b")) // ← "b"
console.info(fn("z")) // ← undefined
```

### `undefinedOr(fn)`
Застосовує `fn` лише якщо значення не `undefined`, інакше повертає `undefined`.

Як використовувати undefinedOr(fn)?
```js
import { undefinedOr } from "@nan0web/types"
const fn = undefinedOr((x) => x * 2)
console.info(fn(5)) // ← 10
console.info(fn(undefined)) // ← undefined
```

### `nullOr(fn)`
Застосовує `fn` лише якщо значення не `null`, інакше повертає `null`.

Як використовувати nullOr(fn)?
```js
import { nullOr } from "@nan0web/types"
const fn = nullOr((x) => x + 1)
console.info(fn(1)) // ← 2
console.info(fn(undefined)) // ← null
```

### `arrayOf(Fn)`
Застосовує `Fn` до кожного елементу масиву.

Як мапити масив за допомогою arrayOf(fn)?
```js
import { arrayOf } from "@nan0web/types"
const fn = arrayOf((x) => x.toUpperCase())
console.info(fn(["a", "b"])) // ← [ 'A', 'B' ]
```

### `typeOf(Fn)`
Перевіряє, чи значення є інстанцією заданого типу (або примітиву).

Як перевірити тип за допомогою typeOf(String)?
```js
import { typeOf } from "@nan0web/types"
const fn = typeOf(String)
console.info(fn("hello")) // ← true
console.info(fn(123)) // ← false
```

### `functionOf(value)`
Повертає конструктор для переданого значення.

Як отримати конструктор за допомогою functionOf?
```js
import { functionOf } from "@nan0web/types"
console.info(functionOf("hello")) // ← [Function: String]
console.info(functionOf(123)) // ← [Function: Number]
console.info(functionOf(new Date())) // ← [Function (anonymous)]
```

### `empty(...values)`
Перевіряє, чи будь‑яке з переданих значень вважається порожнім.

Як перевірити порожні значення?
```js
import { empty } from "@nan0web/types"
console.info(empty(undefined)) // ← true
console.info(empty("")) // ← true
console.info(empty({})) // ← true
console.info(empty(null)) // ← true
console.info(empty([])) // ← true
console.info(empty(0)) // ← false
```

### `equal(...args)`
Порівнює пари аргументів на строгий збіг (наприклад, `equal(a, b, c, d)` → `a === b && c === d`).

Як порівняти значення строго за допомогою equal()?
```js
import { equal } from "@nan0web/types"
console.info(equal("a", "a", "b", "b")) // ← true
console.info(equal(1, "1")) // ← false
```

## Конверсії та утиліти

### `to(type)`

Конвертує значення у представлення, зручне для цільового типу (наприклад, `.toObject()` чи `.toArray()`).

Як конвертувати за допомогою to(Object)?
```js
import { to } from "@nan0web/types"
class A { x = 9 }
const converted = to(Object)(new A())
console.info(converted) // ← { x: 9 }
```

### ContainerObject

Конструктор та `add()` додані для правильного типізування класу `B`.  
@todo додати короткий опис.

Як використовувати NonEmptyObject для фільтрації порожніх значень?
```js
import { ContainerObject } from "@nan0web/types"
/** @typedef {import("@nan0web/types/types/Object/ContainerObject").ContainerObjectArgs} ContainerObjectArgs */
class B extends ContainerObject {
	/** @type {string} */
	body
	/** @type {B[]} */
	children = []
	/** @param {ContainerObjectArgs & string} */
	constructor(input = {}) {
		if ("string" === typeof input) {
			input = { body: input }
		}
		const {
			children = [],
			body = "",
			...rest
		} = input
		super(rest)
		this.body = String(body)
		children.map(c => this.add(c))
	}
	/**
	 * Додає елемент до контейнера.
	 * @param {Partial<B>} element
	 * @returns {B}
	 */
	add(element) {
		this.children.push(B.from(element))
		this._updateLevel()
		return this
	}
	/**
	 * @param {Partial<B> | string} input
	 * @returns {B}
	 */
	static from(input) {
		if (input instanceof B) return input
		return new B(input)
	}
}

const root = new B("root")
root.add("1st")
root.add("2nd")
console.info(root)
// B { body: "root", level: 0, children: [
//   B { body: "1st", level: 1, children: [] }
//   B { body: "2nd", level: 1, children: [] }
// ] }
```

### NonEmptyObject

Базовий клас, чий `.toObject()` пропускає властивості з порожніми значеннями.

Як використовувати NonEmptyObject для фільтрації порожніх значень?
```js
import { NonEmptyObject } from "@nan0web/types"
class B extends NonEmptyObject {
	name = "Name"
	emptyValue = ""
}

const obj = new B().toObject()
console.info(obj) // ← { name: "Name" }
```

### FullObject

Маркер‑клас, що використовується через `to(FullObject)` для збору всіх enumerable‑властивостей, включно з тими, що успадковуються (наприклад, геттери).

Як зібрати усе за допомогою to(FullObject)?
```js
import { to, FullObject } from "@nan0web/types"
class A { x = 9 }
class B extends A { get y() { return this.x ** 2 } }
const obj = to(FullObject)(new B())
console.info(obj) // ← { x: 9, y: 81 }
```

### UndefinedObject

Допоміжний клас, що використовується через `to(UndefinedObject)` для збереження `undefined` у об’єктах.

Як зберегти `undefined` у об’єктах через to(UndefinedObject)?
```js
import { to, UndefinedObject } from "@nan0web/types"
const data = { x: 9, y: undefined }
const obj = to(UndefinedObject)(data)
console.info(obj) // ← { x: 9, y: undefined }
```

### `clone(obj)`
Глибоке клонування об’єктів, масивів, Map, Set та кастомних класів.

Як глибокі клонувати об’єкти?
```js
import { clone } from "@nan0web/types"
const original = { a: { b: [1, 2] } }
const copy = clone(original)
console.info(copy) // ← { a: { b: [ 1, 2 ] } }
```

### `merge(target, source, options?)`
Глибоке злиття двох простих об’єктів або масивів, опціонально з унікальністю елементів.

Як зливати два об’єкти?
```js
import { merge } from "@nan0web/types"
const a = { x: 1, nested: { a: 1 } }
const b = { y: 2, nested: { b: 2 } }

const result = merge(a, b)
console.info(result) // ← { x: 1, nested: { a: 1, b: 2 }, y: 2 }
```

### `isConstructible(fn)`
Перевіряє, чи функцію можна викликати з `new`.

Як перевірити, чи функція конструктор?
```js
import { isConstructible } from "@nan0web/types"
console.info(isConstructible(class X { })) // ← true
console.info(isConstructible(() => { })) // ← false
```

## Парсер та деревовидні структури

### `Parser`
Базовий парсер документів, що працює з відступами: розбиває рядки на ієрархію `Node`.

Як розпарсити відступний рядок за допомогою Parser?
```js
import { Parser } from "@nan0web/types"
const parser = new Parser({ tab: "  " })
const text = "root\n  child\n    subchild\nsibling to root"
const tree = parser.decode(text)
console.info(tree)
console.info(tree.toString({ trim: true })) // ← "root\nchild\nsubchild\nsibling to root"
```

### `Node`
Універсальний вузол дерева, що зберігає вміст та дочірні елементи. Можна розширювати для формат‑специфічних вузлів (наприклад, AST Markdown).

Як створити дерево за допомогою Node?
```js
import { Node } from "@nan0web/types"
const root = new Node({ content: "root" })
const child = new Node({ content: "child" })
root.add(child)
console.info(String(root)) // ← "root\n\tchild"
```

## Формат NaN0

Цей формат забезпечує мінімалістичну, зручну для людини серіалізацію типізованих даних.

## Пісочниця

Як запустити CLI‑пісочницю?
```bash
# Спробуйте приклади та пограйте з бібліотекою:
git clone https://github.com/nan0web/types.git
cd types
npm install
npm run play
```

## JavaScript

Використовує `.d.ts` для автодоповнень у редакторах.

## Внесок

Як внести свій вклад? — [перегляньте інструкції](https://github.com/nan0web/types/blob/main/CONTRIBUTING.md)

## Ліцензія

Як дізнатись про ліцензію? — файл [ISC LICENSE](https://github.com/nan0web/types/blob/main/LICENSE).
