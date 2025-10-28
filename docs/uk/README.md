# @nan0web/types

|[Status](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Documentation|Test coverage|Features|Npm version|
|---|---|---|---|---|
 |🟢 `98.0%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/types/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/types/blob/main/docs/uk/README.md) |🟡 `88.8%` |✅ d.ts 📜 system.md 🕹️ playground |1.0.2 |

Мінімальний, беззалежний інструментарій для управління структурами даних JavaScript,
конвертацій та перевірки типів. Створено на основі [філософії nan0web](https://github.com/nan0web/monorepo/blob/main/system.md#nanweb-nan0web),
де нуль символізує нескінченне джерело (всесвіт), з якого виникають значущі структури.

Цей пакет дозволяє працювати з типами, об’єктами, масивами, документами формату NaN0
та ієрархіями, подібними до відступів тексту. Особливо корисний у монорепозиторіях,
де важливі легкі, перевірені, багаторазові утиліти.

## Встановлення

Як встановити через npm?
```bash
npm install @nan0web/types
```

Як встановити через pnpm?
```bash
pnpm add @nan0web/types
```

Як встановити через yarn?
```bash
yarn add @nan0web/types
```

## Основні концепції

Пакет побудовано на принципах мінімалізму та точності:
- ✅ Повністю типізовано з **JSDoc** та `.d.ts` файлами
- 🔁 Підтримує синхронні та асинхронні операції
- 🧠 Орієнтовано на зрозумілість: кожна функція має чітке призначення
- 🌱 Без зовнішніх залежностей

## Використання: Базові типи

### `match(test, options)`
Перевіряє, чи відповідає будь-який або всі аргументи певному рядку або регулярному виразу.

- **Параметри**
  - `test` (string|RegExp) – Шаблон для порівняння.
  - `options` (object, optional) – Налаштування пошуку.
    - `caseInsensitive` (boolean) – За замовчуванням `false`.
    - `stringFn` (string) – Метод рядка, наприклад `startsWith`, `includes`.
    - `method` ("some"|"every") – Перевіряти всі або хоча б один аргумент. За замовчуванням `"some"`.

Як використовувати `match(regex)`?
```js
import { match } from "@nan0web/types"
const fn = match(/^hello$/)
console.info(fn("hello", "world")) // ← true
```

### `Enum(...values)`

Перевіряє значення (або масив значень) на відповідність списку допустимих значень
чи кастомних функцій валідації.

Як валідувати через Enum?
```js
import { Enum } from "@nan0web/types"
const color = Enum('red', 'green', 'blue')
console.info(color('red')) // ← red
console.info(color('yellow')) // ← TypeError: Enumeration must have one value of..
```

### `oneOf(...args)`
Повертає значення, якщо воно є серед списку допустимих або `undefined`.

Як використовувати oneOf?
```js
import { oneOf } from "@nan0web/types"
const fn = oneOf("a", "b", "c")
console.info(fn("b")) // ← "b"
console.info(fn("z")) // ← undefined
```

### `undefinedOr(fn)`
Застосовує `fn` лише коли значення не є `undefined`, інакше повертає `undefined`.

Як використовувати undefinedOr(fn)?
```js
import { undefinedOr } from "@nan0web/types"
const fn = undefinedOr((x) => x * 2)
console.info(fn(5)) // ← 10
console.info(fn(undefined)) // ← undefined
```

### `nullOr(fn)`
Застосовує `fn` лише коли значення не є `undefined`, інакше повертає `null`.

Як використовувати nullOr(fn)?
```js
import { nullOr } from "@nan0web/types"
const fn = nullOr((x) => x + 1)
console.info(fn(1)) // ← 2
console.info(fn(undefined)) // ← null
```

### `arrayOf(Fn)`
Застосовує `Fn` до кожного елемента масиву.

Як застосувати arrayOf(fn)?
```js
import { arrayOf } from "@nan0web/types"
const fn = arrayOf((x) => x.toUpperCase())
console.info(fn(["a", "b"])) // ← [ 'A', 'B' ]
```

### `typeOf(Fn)`
Перевіряє, чи значення є екземпляром заданого типу (чи примітивом).

Як перевірити тип через typeOf(String)?
```js
import { typeOf } from "@nan0web/types"
const fn = typeOf(String)
console.info(fn("hello")) // ← true
console.info(fn(123)) // ← false
```

### `functionOf(value)`
Намагається повернути конструктор заданого значення.

Як отримати конструктор через functionOf?
```js
import { functionOf } from "@nan0web/types"
console.info(functionOf("hello")) // ← [Function: String]
console.info(functionOf(123)) // ← [Function: Number]
console.info(functionOf(new Date())) // ← [Function (anonymous)]
```

### `empty(...values)`
Перевіряє, чи серед наданих значень є “порожні”.

Як перевірити значення на "порожність"?
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
Порівнює пари аргументів за строгим співставленням (наприклад, `equal(a, b, c, d)` → `a === b && c === d`).

Як строго порівняти значення через equal()?
```js
import { equal } from "@nan0web/types"
console.info(equal("a", "a", "b", "b")) // ← true
console.info(equal(1, "1")) // ← false
```

## Перетворення та інструменти

### `to(type)`

Конвертує значення до потрібного типу (наприклад, `.toObject()` або `.toArray()`).

Як конвертувати через to(Object)?
```js
import { to } from "@nan0web/types"
class A { x = 9 }
const converted = to(Object)(new A())
console.info(converted) // ← { x: 9 }
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

Маркер-клас, використовується через `to(FullObject)` для збирання усіх властивостей,
включаючи з прототипного ланцюга (наприклад, геттери).

Як збирати усе через to(FullObject)?
```js
import { to, FullObject } from "@nan0web/types"
class A { x = 9 }
class B extends A { get y() { return this.x ** 2 } }
const obj = to(FullObject)(new B())
console.info(obj) // ← { x: 9, y: 81 }

```

### UndefinedObject

Допоміжний класс, що дозволяє зберігати `undefined` у об’єктах через `to(UndefinedObject)`.

Як зберегти `undefined` у об’єкті через to(UndefinedObject)?
```js
import { to, UndefinedObject } from "@nan0web/types"
const data = { x: 9, y: undefined }
const obj = to(UndefinedObject)(data)
console.info(obj) // ← { x: 9, y: undefined }

```

### `clone(obj)`
Глибоко клонує об’єкти, масиви, Map, Set та користувацькі класи.

Як глибоко клонувати об'єкт?
```js
import { clone } from "@nan0web/types"
const original = { a: { b: [1, 2] } }
const copy = clone(original)
console.info(copy) // ← { a: { b: [ 1, 2 ] } }

```

### `merge(target, source, options?)`
Глибоко об’єднує два прості об'єкти або масиви, опціонально зберігає унікальність.

Як об’єднати два об’єкти через merge?
```js
import { merge } from "@nan0web/types"
const a = { x: 1, nested: { a: 1 } }
const b = { y: 2, nested: { b: 2 } }

const result = merge(a, b)
console.info(result) // ← { x: 1, nested: { a: 1, b: 2 }, y: 2 }

```

### `isConstructible(fn)`
Перевіряє, чи функцію можна викликати через `new`.

Як перевірити, чи функція constructible?
```js
import { isConstructible } from "@nan0web/types"
console.info(isConstructible(class X {})) // ← true
console.info(isConstructible(() => {})) // ← false
```

## Парсер та ієрархії

### `Parser`
Простий парсер ієрархії на основі відступів: ділить рядки на `Node`.

Як розпарсити відступний текст через Parser?
```js
import { Parser } from "@nan0web/types"
const parser = new Parser({ tab: "  " })
const text = "root\n  child\n    subchild"
const tree = parser.decode(text)

console.info(tree.toString({ trim: true })) // ← "root\n\n\tchild\n\n\t\tsubchild"
```

### `Node`
Базова нода дерева, що містить контент та дочірні елементи.
Можна розширити для конкретних форматів (наприклад, Markdown AST).

Як побудувати дерево через Node?
```js
import { Node } from "@nan0web/types"
const root = new Node({ content: "root" })
const child = new Node({ content: "child" })
root.add(child)
console.info(String(root)) // ← "root\n\nchild"
```

## Формати NANO та NaN0

Ці формати надають мінімалістичне, доступне для людини представлення типізованих даних.

- `NANO` – базова реалізація
- `NaN0` – розширена з підтримкою дати, коментарів тощо.

## Інтерактивне середовище

Як запустити CLI пісочницю?
```bash
# Щоб спробувати приклади та експериментувати:
git clone https://github.com/nan0web/types.git
cd types
npm install
npm run playground
```

## Java•Script

Використовує `d.ts` для автоматичних підказок.

## Внесок

Як зробити внесок? - [дивіться тут](https://github.com/nan0web/types/blob/main/CONTRIBUTING.md)

## Ліцензія

Ліцензія? - [ISC LICENSE](https://github.com/nan0web/types/blob/main/LICENSE) файл.
