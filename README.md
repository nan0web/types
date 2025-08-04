# @nan0web/types

Universal and flexible system for managing data structures and types in JavaScript applications, based on the philosophy that **zero represents the universe** – the origin of all numbers and possibilities.

## Features

- **NANO Format Parser/Stringifier**: Simple and strict YAML-like format for structured data storage with support for:
  - Multiline strings (using `|`)
  - Numbers with thousand separators (`_`)
  - Empty objects (`{}`) and arrays (`[]`)
  - Dates in ISO format
  - Comments (starting with `# `)
- **ContainerObject**: Class for managing nested object hierarchies with methods for:
  - Adding/removing children
  - Finding elements recursively
  - Flattening nested structures
- **Type Conversion Utilities**: Robust tools (`to`, `typeOf`, `functionOf`) to convert between various object representations:
  - `Object` - Standard JavaScript objects excluding undefined values
  - `FullObject` - Objects including getters and methods
  - `NonEmptyObject` - Objects excluding empty values
  - `UndefinedObject` - Objects preserving undefined values
  - `ObjectWithAlias` - Objects with property aliasing support
- **Merge Utility**: Deep merging of objects and arrays with options for uniqueness and nesting control
- **Clone Utility**: Deep cloning of objects, arrays, and custom class instances with circular reference handling
- **Validation Helpers**: Includes `Enum`, `match`, `oneOf`, `empty`/`notEmpty` for strong type-safe validation
- **Pure JavaScript with JSDoc**: Fully typed with clear documentation, no TypeScript required

## Installation

```bash
npm install @nan0web/types
```

## Concepts

- `nan0` - "0 is not a number" representing the universe as the source of all possibilities
- `rea1` - Denotes subjective reality, since each person's reality differs
- `g0d` - Represents infinite energy; objective reality exists only when all become one with it
- Built for composability, minimal memory footprint, high performance and good DX

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
- Numbers formatted with `_` as thousand separator (e.g., `160_000_500`)
- Empty objects: `{}`
- Empty arrays: `[]`
- Dates in ISO format (`YYYY-MM-DD`) or datetime (`YYYY-MM-DDTHH:mm:ss`)
- Comments start with `# `

## API Overview

### NANO

```js
import NANO from '@nan0web/types'

const data = NANO.parse('.nano formatted string')
const nano = NANO.stringify(data)
```

### ContainerObject

```js
import { ContainerObject } from '@nan0web/types'

class Node extends ContainerObject {}
const root = new Node({ level: 0 })

root.add(new Node({ level: 1, name: 'child' }))
root.find(child => child.name === 'child')
root.recent // last added child recursively
root.flat() // flatten nested structure to array
```

### Conversion Utilities

```js
import { to, typeOf, functionOf, FullObject, NonEmptyObject } from '@nan0web/types'

// Convert to standard Object (excluding undefined values)
to(Object)({ a: 1, b: undefined }) // { a: 1 }

// Convert to FullObject (including getters and methods)
to(FullObject)(instance) 

// Convert to NonEmptyObject (excluding empty values)
to(NonEmptyObject)({ a: 1, b: "", c: null }) // { a: 1 }

// Check type
typeOf(String)("hello") // true
typeOf(Number)(42) // true

// Get constructor function
functionOf("hello") // String
functionOf(42) // Number
```

### Merge and Clone Utilities

```js
import { merge, clone } from '@nan0web/types'

// Deep merge objects
const target = { a: 1, b: { c: 2 } }
const source = { b: { d: 3 }, e: 4 }
merge(target, source) // { a: 1, b: { c: 2, d: 3 }, e: 4 }

// Deep clone objects/arrays with circular reference handling
const original = { a: 1, b: [2, 3] }
const copied = clone(original)
```

### Validation

```js
import { Enum, match, oneOf, empty } from '@nan0web/types'

// Enumeration validation
const color = Enum('red', 'blue', 'green')
color('red') // ✅ 'red'
color('yellow') // ❌ throws TypeError

// Pattern matching
match(/^hello/i)('Hello World') // ✅ true
match('test', { caseInsensitive: true, stringFn: "includes" })('This is a TEST') // ✅ true

// One of values
oneOf(1, 2, 3)(2) // ✅ 2
oneOf(1, 2, 3)(4) // ✅ undefined

// Empty checks
empty("", {}, []) // ✅ true
empty("hello", [1], { a: 1 }) // ✅ false
```

## Philosophy

We code not just to automate but to **realize reality** – building systems that mirror the logic of the universe. The `nan0` approach ensures data is not just structured, but metaphysically meaningful. Zero represents the universe that contains infinite possibilities, and we build tools that help developers create from this universal source.

## Contributing

By contributing, you accept and agree to the terms in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Testing

Run the test suite with:

```bash
npm test
```

Before commits, tests are automatically run to ensure code quality.

## License

[ISC](./LICENSE)
