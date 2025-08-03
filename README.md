# @nanoweb/types

Universal and flexible system for managing data structures and types in JavaScript applications, based on the philosophy that **zero represents the universe** – the origin of all numbers and possibilities.

## Features

- **NANO Format Parser/Stringifier**: Simple and strict YAML-like format for structured data storage.
- **ContainerObject**: Class for managing nested object hierarchies (e.g., children, level, find, flat).
- **Type Conversion Utilities**: Robust tools (`to`, `typeOf`, `functionOf`) to convert between various object representations.
- **Merge Utility**: Deep merging of objects and arrays with options for uniqueness and nesting control.
- **Validation Helpers**: Includes `Enum`, `match`, `oneOf`, `empty`/`notEmpty` for strong type-safe validation.
- **Pure JavaScript with JSDoc**: Fully typed with clear documentation, no TypeScript required.

## Installation

```bash
npm install @nanoweb/types
```

## Concepts

- `0` is Not a Number (`nan0`) — symbolizes the infinite universe from which everything originates.
- `rea1` — denotes *subjective reality*, since each person's reality differs.
- `g0d` — represents infinite energy; objective reality exists only when all become one with it.
- Built for composability, minimal memory footprint, high performance and good DX.

## Format: NANO

The `.nano` format simplifies data management using clean and human-readable syntax:

```nano
object:
  name: John
  age: 30
  bio: |
    Multiline
    description
array:
  - Hello
  - 123_456_789
  - true
  - null
```

### Rules

- All multiline strings begin with `|`
- Numbers formatted with `_` as thousand separator
- Empty objects: `{}`
- Empty arrays: `[]`
- Dates must be ISO format (`YYYY-MM-DD`) or datetime (`YYYY-MM-DDTHH:mm:ss`)
- Comments start with `# `

## API Overview

### NANO

```js
import NANO from '@nanoweb/types'

const data = NANO.parse('.nano formatted string')
const nano = NANO.stringify(data)
```

### ContainerObject

```js
import { ContainerObject } from '@nanoweb/types'

class Node extends ContainerObject {}
const root = new Node()

root.add(new Node({ level: 1, name: 'child' }))
root.find(child => child.name === 'child')
root.recent // last added child recursively
```

### Conversion Utilities

```js
import { to, typeOf, functionOf } from '@nanoweb/types'

to(Object)({ a: 1 }) // { a: 1 }
to(FullObject)(instance) // includes getters and methods
to(NonEmptyObject)({ a: 1, b: undefined }) // { a: 1 }
```

### Validation

```js
import { Enum, match, oneOf, empty } from '@nanoweb/types'

const color = Enum('red', 'blue', 'green')
color('red') // ✅ 'red'
color('yellow') // ❌ throws TypeError

match(/^hello/i)('Hello World') // ✅ true
oneOf(1, 2, 3)(2) // ✅ 2
oneOf(1, 2, 3)(4) // ✅ undefined
empty("", {}, []) // ✅ true
```

## Philosophy

We code not just to automate but to **realize reality** – building systems that mirror the logic of the universe. The `nan0` approach ensures data is not just structured, but metaphysically meaningful.

## License

[ISC](./LICENSE)
