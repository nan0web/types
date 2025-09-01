# @nan0web/types

|[Status](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Documentation|Test coverage|Features|Npm version|
|---|---|---|---|---|
 |🟢 `98.3%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/types/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/types/blob/main/docs/uk/README.md) |🟢 `90.4%` |✅ d.ts 📜 system.md 🕹️ playground |1.0.0 |

A minimal, zero-dependency toolkit for managing JavaScript data structures,
conversions, and type validation. Built for [nan0web philosophy](https://github.com/nan0web/monorepo/blob/main/system.md#nanweb-nan0web),
where zero represents the infinite source (universe), from which emerge meaningful structures.

This package helps you work safely with types, objects, arrays, NaN0 format documents,
and basic tree structures like indented texts. It is especially useful in monorepos
where lightweight, proven, reusable utilities are essential.

## Installation

How to install with npm?
```bash
npm install @nan0web/types
```

How to install with pnpm?
```bash
pnpm add @nan0web/types
```

How to install with yarn?
```bash
yarn add @nan0web/types
```

## Core Concepts

This package is designed with minimalism and precision:
- ✅ Fully typed with **JSDoc** and `.d.ts` files
- 🔁 Supports both sync and async operations
- 🧠 Built for cognitive clarity: each function has a clear purpose
- 🌱 No external dependencies

## Usage: Basic Types

### `match(test, options)`
Checks if any or all of the arguments match a string or regex pattern.

- **Parameters**
  - `test` (string|RegExp) – Pattern to match against.
  - `options` (object, optional) – Matching settings.
    - `caseInsensitive` (boolean) – Default `false`.
    - `stringFn` (string) – A method like `startsWith`, `includes`.
    - `method` ("some"|"every") – Whether check one or all args. Default `"some"`.

How to use `match(regex)`?
```js
const fn = match(/^hello$/)
console.info(fn("hello", "world")) // ← true
```
### `Enum(...values)`

Validates a value (or array of values) against a list of allowed values
or custom validator functions.

How to validate with Enum?
```js
const color = Enum('red', 'green', 'blue')
```
### `oneOf(...args)`
Returns a value if it exists in the list, otherwise returns undefined.

How to use oneOf?
```js
const fn = oneOf("a", "b", "c")
console.info(fn("b")) // ← "b"
console.info(fn("z")) // ← undefined
```
### `undefinedOr(fn)`
Applies `fn` only if the value is not `undefined`, otherwise returns `undefined`.

How to use undefinedOr(fn)?
```js
const fn = undefinedOr((x) => x * 2)
console.info(fn(5)) // ← 10
console.info(fn(undefined)) // ← undefined
```
### `nullOr(fn)`
Applies `fn` only if the value is not `undefined`, otherwise returns `null`.

How to use nullOr(fn)?
```js
const fn = nullOr((x) => x + 1)
console.info(fn(1)) // ← 2
console.info(fn(undefined)) // ← null
```
### `arrayOf(Fn)`
Applies `Fn` to each element of an array.

How to map array with arrayOf(fn)?
```js
const fn = arrayOf((x) => x.toUpperCase())
console.info(fn(["a", "b"])) // ← ["A", "B"]
```
### `typeOf(Fn)`
Checks if value is instance of the given type (or primitive).

How to check type with typeOf(String)?
```js
const fn = typeOf(String)
console.info(fn("hello")) // ← true
console.info(fn(123)) // ← false
```
### `functionOf(value)`
Attempts to return the constructor for a given value.

How to get constructor with functionOf?
```js
console.info(functionOf("hello")) // ← String
console.info(functionOf(123)) // ← Number
console.info(functionOf(new Date())) // ← Date
```
### `empty(...values)`
Checks if any of provided values are considered empty.

How to check for empty values?
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
Compares pairs of arguments for strict equality (e.g., `equal(a, b, c, d)` → `a === b && c === d`).

How to compare values strictly with equal()?
```js
import { equal } from "@nan0web/types"
console.info(equal("a", "a", "b", "b")) // ← true
console.info(equal(1, "1")) // ← false
```
## Conversions & Utilities

### `to(type)`

Converts values into target type-friendly representations (e.g., `.toObject()` or `.toArray()`).

How to convert using to(Object)?
```js
import { to } from "@nan0web/types"
class A { x = 9 }
const converted = to(Object)(new A())
console.info(converted) // ← { x: 9 }
```
### NonEmptyObject

A base class whose `.toObject()` skips properties with empty values.

How to use NonEmptyObject to filter empty values?
```js
class B extends NonEmptyObject {
	name = "Name"
	emptyValue = ""
}

const obj = new B().toObject()
console.info(obj) // ← { name: "Name" }

```
### FullObject

A marker class used via `to(FullObject)` to collect all enumerable properties,
including those from prototype chain (like getters).

How to collect everything with to(FullObject)?
```js
class A { x = 9 }
class B extends A { get y() { return this.x ** 2 } }
const obj = to(FullObject)(new B())
console.info(obj) // ← { x: 9, y: 81 }

```
### UndefinedObject

A helper used via `to(UndefinedObject)` to keep `undefined` values in objects.

How to keep `undefined` in objects via to(UndefinedObject)?
```js
const data = { x: 9, y: undefined }
const obj = to(UndefinedObject)(data)
console.info(obj) // ← { x: 9, y: undefined }

```
### `clone(obj)`
Deep clones objects, arrays, Maps, Sets, and custom classes.

How to deeply clone objects?
```js
const original = { a: { b: [1, 2] } }
const copy = clone(original)
console.info(copy) // ← { a: { b: [1, 2] } }

```
### `merge(target, source, options?)`
Deeply merges two plain objects or arrays, optionally preserving uniqueness.

How to merge two objects?
```js
const a = { x: 1, nested: { a: 1 } }
const b = { y: 2, nested: { b: 2 } }

const result = merge(a, b)
console.info(result) // ← { x: 1, y: 2, nested: { a: 1, b: 2 } }

```
### `isConstructible(fn)`
Checks whether a function can be called with `new`.

How check if function is constructible?

## Parser & Tree Structures

/**
@docs
### `Parser`
Basic indentation-based document parser: splits rows into `Node` hierarchy.

How to parse indented string with Parser?
```js
const parser = new Parser({ tab: "  " })
const text = "root\n  child\n    subchild"
const tree = parser.decode(text)

console.info(tree.toString({ trim: true })) // ← "root\n\nchild\n\nsubchild"
```
### `Node`
Generic tree node that holds content and children.
You can extend it into format-specific nodes (e.g., Markdown AST).

How to build a tree with Node?
```js
const root = new Node({ content: "root" })
const child = new Node({ content: "child" })
root.add(child)
console.info(String(root)) // ← "root\n\nchild"
```
## NANO & NaN0 Formats

These formats provide minimalistic, human-friendly serialization for typed data.

- `NANO` – core implementation
- `NaN0` – extended with support for date, comments, etc.

## Playground

How to run CLI sandbox?
```bash
# To try out examples and play with the library:
git clone https://github.com/nan0web/types.git
cd types
npm install
npm run playground
```

## Java•Script

Uses `d.ts` to provide autocomplete hints.

## Contributing

How to contribute? - [check here](https://github.com/nan0web/types/blob/main/CONTRIBUTING.md)

## License

How to license? - [ISC LICENSE](https://github.com/nan0web/types/blob/main/LICENSE) file.
