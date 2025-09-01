import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import DB from '@nan0web/db-fs'
import { NoConsole } from "@nan0web/log"
import { DocsParser, MemoryDB, runSpawn, DatasetParser } from "@nan0web/test"
import {
	oneOf, undefinedOr, nullOr, arrayOf, typeOf, functionOf,
	empty, equal, to, FullObject, UndefinedObject, NonEmptyObject,
	match, Enum, clone, merge, isConstructible,
	Parser, Node,
} from './index.js'

const fs = new DB()
let pkg

// Load package.json once before tests
before(async () => {
	const doc = await fs.loadDocument('package.json', {})
	pkg = doc || {}
})

let console = new NoConsole()

beforeEach(() => {
	console = new NoConsole()
})

/**
 * Core test suite that also serves as the source for README generation.
 *
 * The block comments inside each `it` block are extracted to build
 * the final `README.md`. Keeping the comments here ensures the
 * documentation stays close to the code.
 */
function testRender() {
	/**
	 * @docs
	 * # @nan0web/types
	 *
	 * <!-- %PACKAGE_STATUS% -->
	 *
	 * A minimal, zero-dependency toolkit for managing JavaScript data structures,
	 * conversions, and type validation. Built for [nan0 philosophy](https://nan0.dev),
	 * where zero represents the infinite source (universe), from which emerge meaningful structures.
	 *
	 * This package helps you work safely with types, objects, arrays, NaN0 format documents,
	 * and basic tree structures like indented texts. It is especially useful in monorepos
	 * where lightweight, proven, reusable utilities are essential.
	 *
	 * This document is available in other languages:
	 * - [Ukrainian 🇺🇦](./docs/uk/README.md)
	 *
	 * ## Installation
	 */
	it("How to install with npm?", () => {
		/**
		 * ```bash
		 * npm install @nan0web/types
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/types")
	})
	/**
	 * @docs
	 */
	it("How to install with pnpm?", () => {
		/**
		 * ```bash
		 * pnpm add @nan0web/types
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/types")
	})
	/**
	 * @docs
	 */
	it("How to install with yarn?", () => {
		/**
		 * ```bash
		 * yarn add @nan0web/types
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/types")
	})

	/**
	 * @docs
	 * ## Core Concepts
	 *
	 * This package is designed with minimalism and precision:
	 * - ✅ Fully typed with **JSDoc** and `.d.ts` files
	 * - 🔁 Supports both sync and async operations
	 * - 🧠 Built for cognitive clarity: each function has a clear purpose
	 * - 🌱 No external dependencies
	 *
	 * ## Usage: Basic Types
	 *
	 * ### `match(test, options)`
	 * Checks if any or all of the arguments match a string or regex pattern.
	 *
	 * - **Parameters**
	 *   - `test` (string|RegExp) – Pattern to match against.
	 *   - `options` (object, optional) – Matching settings.
	 *     - `caseInsensitive` (boolean) – Default `false`.
	 *     - `stringFn` (string) – A method like `startsWith`, `includes`.
	 *     - `method` ("some"|"every") – Whether check one or all args. Default `"some"`.
	 *
	 * @example
	 * const validUrl = match(/^https?:\/\//, { method: 'some' })
	 * validUrl('https://nan0.dev', 'invalid') // true
	 */
	it('How to use `match(regex)`?', () => {
		const fn = match(/^hello$/)
		console.info(fn("hello", "world")) // ← true
		assert.equal(fn("hello", "world"), true)
		assert.equal(fn("world"), false)
	})

	/**
	 * @docs
	 * ### `Enum(...values)`
	 *
	 * Validates a value (or array of values) against a list of allowed values
	 * or custom validator functions.
	 *
	 * @example
	 * const colorValidator = Enum("red", "green", "blue", (val) => typeof val === "string" && val.length > 2)
	 * colorValidator("red") // red
	 * colorValidator("purple") // purple
	 * colorValidator(123) // throws TypeError
	 */
	it('How to validate with Enum?', () => {
		const color = Enum('red', 'green', 'blue')
		assert.equal(color('red'), 'red')
		assert.throws(() => color('yellow'), {
			name: "TypeError",
			message: [
				"Enumeration must have one value of",
				"- red",
				"- green",
				"- blue",
				"but provided",
				"yellow"
			].join('\n')
		})
	})

	/**
	 * @docs
	 * ### `oneOf(...args)`
	 * Returns a value if it exists in the list, otherwise returns undefined.
	 *
	 * @example
	 * const fn = oneOf("a", "b", "c")
	 * assert.strictEqual(fn("a"), "a")
	 * assert.strictEqual(fn("x"), undefined)
	 */
	it('How to use oneOf?', () => {
		const fn = oneOf("a", "b", "c")
		console.info(fn("b")) // ← "b"
		console.info(fn("z")) // ← undefined
		assert.equal(fn("b"), "b")
		assert.equal(fn("z"), undefined)
	})

	/**
	 * @docs
	 * ### `undefinedOr(fn)`
	 * Applies `fn` only if the value is not `undefined`, otherwise returns `undefined`.
	 */
	it('How to use undefinedOr(fn)?', () => {
		const fn = undefinedOr((x) => x * 2)
		console.info(fn(5)) // ← 10
		console.info(fn(undefined)) // ← undefined
		assert.equal(fn(5), 10)
		assert.equal(fn(undefined), undefined)
	})

	/**
	 * @docs
	 * ### `nullOr(fn)`
	 * Applies `fn` only if the value is not `undefined`, otherwise returns `null`.
	 */
	it('How to use nullOr(fn)?', () => {
		const fn = nullOr((x) => x + 1)
		console.info(fn(1)) // ← 2
		console.info(fn(undefined)) // ← null
		assert.equal(fn(1), 2)
		assert.equal(fn(undefined), null)
	})

	/**
	 * @docs
	 * ### `arrayOf(Fn)`
	 * Applies `Fn` to each element of an array.
	 */
	it('How to map array with arrayOf(fn)?', () => {
		const fn = arrayOf((x) => x.toUpperCase())
		console.info(fn(["a", "b"])) // ← ["A", "B"]
		assert.deepEqual(fn(["a", "b"]), ["A", "B"])
	})

	/**
	 * @docs
	 * ### `typeOf(Fn)`
	 * Checks if value is instance of the given type (or primitive).
	 */
	it('How to check type with typeOf(String)?', () => {
		const fn = typeOf(String)
		console.info(fn("hello")) // ← true
		console.info(fn(123)) // ← false
		assert.equal(fn("hello"), true)
		assert.equal(fn(123), false)
	})

	/**
	 * @docs
	 * ### `functionOf(value)`
	 * Attempts to return the constructor for a given value.
	 */
	it('How to get constructor with functionOf?', () => {
		console.info(functionOf("hello")) // ← String
		console.info(functionOf(123)) // ← Number
		console.info(functionOf(new Date())) // ← Date
		assert.equal(functionOf("hello"), String)
		assert.equal(functionOf(123), Number)
		assert.ok(functionOf(new Date()) instanceof Function)
	})

	/**
	 * @docs
	 * ### `empty(...values)`
	 * Checks if any of provided values are considered empty.
	 */
	it('How to check for empty values?', () => {
		//import { empty } from "@nan0web/types"
		console.info(empty(undefined)) // ← true
		console.info(empty("")) // ← true
		console.info(empty({})) // ← true
		console.info(empty(null)) // ← true
		console.info(empty([])) // ← true
		console.info(empty(0)) // ← false
		assert.equal(console.output()[0][1], true)
		assert.equal(console.output()[1][1], true)
		assert.equal(console.output()[2][1], true)
		assert.equal(console.output()[3][1], true)
		assert.equal(console.output()[4][1], true)
		assert.equal(console.output()[5][1], false)
	})

	/**
	 * @docs
	 * ### `equal(...args)`
	 * Compares pairs of arguments for strict equality (e.g., `equal(a, b, c, d)` → `a === b && c === d`).
	 */
	it('How to compare values strictly with equal()?', () => {
		//import { equal } from "@nan0web/types"
		console.info(equal("a", "a", "b", "b")) // ← true
		console.info(equal(1, "1")) // ← false
		assert.equal(equal("a", "a", "b", "b"), true)
		assert.equal(equal(1, "1"), false)
	})

	/**
	 * @docs
	 * ## Conversions & Utilities
	 *
	 * ### `to(type)`
	 *
	 * Converts values into target type-friendly representations (e.g., `.toObject()` or `.toArray()`).
	 */
	it('How to convert using to(Object)?', () => {
		//import { to } from "@nan0web/types"
		class A { x = 9 }
		const converted = to(Object)(new A())
		console.info(converted) // ← { x: 9 }
		assert.deepStrictEqual(converted, { x: 9 })
	})

	/**
	 * @docs
	 * ### NonEmptyObject
	 *
	 * A base class whose `.toObject()` skips properties with empty values.
	 *
	 * @example
	 * class B extends NonEmptyObject {
	 *   name = "Name"
	 *   emptyValue = ""
	 * }
	 *
	 * const obj = new B().toObject()
	 * console.log(obj) // { name: "Name" }
	 */
	it('How to use NonEmptyObject to filter empty values?', () => {
		class B extends NonEmptyObject {
			name = "Name"
			emptyValue = ""
		}

		const obj = new B().toObject()
		console.info(obj) // ← { name: "Name" }

		assert.deepStrictEqual(obj, { name: "Name" })
	})

	/**
	 * @docs
	 * ### FullObject
	 *
	 * A marker class used via `to(FullObject)` to collect all enumerable properties,
	 * including those from prototype chain (like getters).
	 */
	it('How to collect everything with to(FullObject)?', () => {
		class A { x = 9 }
		class B extends A { get y() { return this.x ** 2 } }
		const obj = to(FullObject)(new B())
		console.info(obj) // ← { x: 9, y: 81 }

		assert.deepStrictEqual(obj, { x: 9, y: 81 })
	})

	/**
	 * @docs
	 * ### UndefinedObject
	 *
	 * A helper used via `to(UndefinedObject)` to keep `undefined` values in objects.
	 */
	it('How to keep `undefined` in objects via to(UndefinedObject)?', () => {
		const data = { x: 9, y: undefined }
		const obj = to(UndefinedObject)(data)
		console.info(obj) // ← { x: 9, y: undefined }

		assert.ok(obj.x === 9)
		assert.ok('y' in obj)
		assert.ok(obj.y === undefined)
	})

	/**
	 * @docs
	 * ### `clone(obj)`
	 * Deep clones objects, arrays, Maps, Sets, and custom classes.
	 */
	it('How to deeply clone objects?', () => {
		const original = { a: { b: [1, 2] } }
		const copy = clone(original)
		console.info(copy) // ← { a: { b: [1, 2] } }

		assert.deepStrictEqual(copy, original)
		assert.ok(copy !== original)
		assert.ok(copy.a !== original.a)
		assert.ok(copy.a.b !== original.a.b)
	})

	/**
	 * @docs
	 * ### `merge(target, source, options?)`
	 * Deeply merges two plain objects or arrays, optionally preserving uniqueness.
	 */
	it('How to merge two objects?', () => {
		const a = { x: 1, nested: { a: 1 } }
		const b = { y: 2, nested: { b: 2 } }

		const result = merge(a, b)
		console.info(result) // ← { x: 1, y: 2, nested: { a: 1, b: 2 } }

		assert.deepStrictEqual(result, { x: 1, y: 2, nested: { a: 1, b: 2 } })
	})

	/**
	 * @docs
	 * ### `isConstructible(fn)`
	 * Checks whether a function can be called with `new`.
	 */
	it('How check if function is constructible?', () => {
		assert.equal(isConstructible(class X {}), true)
		assert.equal(isConstructible(() => {}), false)
	})

	/**
	 * @docs
	 * ## Parser & Tree Structures
	 */

	/**
	 * @docs
	 * ### `Parser`
	 * Basic indentation-based document parser: splits rows into `Node` hierarchy.
	 */
	it('How to parse indented string with Parser?', () => {
		const parser = new Parser({ tab: "  " })
		const text = "root\n  child\n    subchild"
		const tree = parser.decode(text)

		console.info(tree.toString({ trim: true })) // ← "root\n\nchild\n\nsubchild"
		assert.ok(tree instanceof Node)
		assert.ok(tree.children.length === 1)
		assert.ok(tree.children[0].content === "root")
	})

	/**
	 * @docs
	 * ### `Node`
	 * Generic tree node that holds content and children.
	 * You can extend it into format-specific nodes (e.g., Markdown AST).
	 *
	 * @example
	 * const node = new Node({ content: "Title", indent: 0 })
	 * node.add(new Node({ content: "Paragraph", indent: 1 }))
	 */
	it('How to build a tree with Node?', () => {
		const root = new Node({ content: "root" })
		const child = new Node({ content: "child" })
		root.add(child)
		console.info(String(root)) // ← "root\n\nchild"
		assert.equal(String(root), "root\n\nchild")
	})

	/**
	 * @docs
	 * ## NANO & NaN0 Formats
	 *
	 * These formats provide minimalistic, human-friendly serialization for typed data.
	 *
	 * - `NANO` – core implementation
	 * - `NaN0` – extended with support for date, comments, etc.
	 */

	/**
	 * @docs
	 * ## Playground
	 */
	it("How to run CLI sandbox?", () => {
		/**
		 * ```bash
		 * # To try out examples and play with the library:
		 * git clone https://github.com/nan0web/types.git
		 * cd types
		 * npm install
		 * npm run playground
		 * ```
		 */
		assert.ok(String(pkg.scripts?.playground).includes("node playground"))
	})
	/**
	 * @docs
	 * ## Java•Script
	 */
	it("Uses `d.ts` to provide autocomplete hints.", () => {
		assert.equal(pkg.types, "types/index.d.ts")
		assert.ok(String(pkg.scripts?.build).split(" ").includes("tsc"))
	})
	/**
	 * @docs
	 * ## Contributing
	 */
	it("How to contribute? - [check here](./CONTRIBUTING.md)", async () => {
		assert.equal(pkg.scripts?.precommit, "npm test")
		assert.equal(pkg.scripts?.prepush, "npm test")
		assert.equal(pkg.scripts?.prepare, "husky")

		const text = await fs.loadDocument("CONTRIBUTING.md")
		const str = String(text)
		assert.ok(str.includes('# Contributing'))
	})
	/**
	 * @docs
	 * ## License
	 */
	it("How to license? - [ISC LICENSE](./LICENSE) file.", async () => {
		/** @docs */
		const text = await fs.loadDocument('LICENSE')
		assert.ok(String(text).includes('ISC'))
	})
}

describe('README.md testing', testRender)

describe("Rendering README.md", async () => {
	let text = ""
	const format = new Intl.NumberFormat("en-US").format
	const parser = new DocsParser()
	text = String(parser.decode(testRender))
	await fs.saveDocument("README.md", text)
	const dataset = DatasetParser.parse(text, pkg.name)
	await fs.saveDocument(".datasets/README.dataset.jsonl", dataset)

	it(`document is rendered in README.md [${format(Buffer.byteLength(text))}b]`, async () => {
		const text = await fs.loadDocument("README.md")
		assert.ok(text.includes("## License"))
	})
})
