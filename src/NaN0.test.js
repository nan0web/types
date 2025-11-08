import { describe, it } from 'node:test'
import assert from 'node:assert'
import NaN0 from './NaN0.js'
import { exampleOfComments, exampleOfExpected, exampleOfFormat } from "./NaN0.examples.js"

describe('NaN0 parse and stringify', () => {
	describe("parse", () => {
		it('Should parse empty input as empty object', () => {
			const result = NaN0.parse('')
			assert.deepStrictEqual(result, {})
		})

		it('Should parse only comments as object with $$comments', () => {
			const input = `# First comment\n# Second comment\n`
			const context = { comments: [] }
			const result = NaN0.parse(input, context)
			assert.deepStrictEqual(result, {})
			assert.deepStrictEqual(context.comments, [{ text: "First comment\nSecond comment", id: "." }])
		})

		it('Should parse top-level empty object', () => {
			const input = `{}`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {})
		})

		it('Should parse top-level empty object with comments', () => {
			const input = `# Comment\n{}`
			const context = { comments: [] }
			const result = NaN0.parse(input, context)
			assert.deepStrictEqual(result, {})
			assert.deepStrictEqual(context.comments, [{ text: "Comment", id: "." }])
		})

		it('Should parse top-level empty array', () => {
			const input = `[]`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, [])
		})

		it('Should parse top-level empty array with comments', () => {
			const input = `# Comment\n[]`
			const context = { comments: [] }
			const result = NaN0.parse(input, context)
			assert.deepStrictEqual(result, [])
			assert.deepStrictEqual(context.comments, [{ text: "Comment", id: "[0]" }])
		})

		it('Should parse top-level object with multiple keys', () => {
			const input = `name: John\nage: 30`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, { name: 'John', age: 30 })
		})

		it('Should parse top-level object with comments', () => {
			const input = `# Top comment\nname: John\n# Inline ignored for now\nage: 30`
			const context = { comments: [] }
			const result = NaN0.parse(input, context)
			assert.deepStrictEqual(result, { name: 'John', age: 30 })
			assert.deepStrictEqual(context.comments, [
				{ text: "Top comment", id: "name" },
				{ text: "Inline ignored for now", id: "age" }
			])
		})

		it('Should parse empty array', () => {
			const input = `test:\n  []`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, { test: [] })
		})

		it('Should parse empty object', () => {
			const input = `test:\n  {}`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, { test: {} })
		})

		it('should parse simple object', () => {
			const input = `test:\n  name: John\n  age: 30`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, { test: { name: 'John', age: 30 } })
		})

		it('should parse nested object', () => {
			const input = `test:\n  user:\n    name: John\n    details:\n      age: 30`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					user: {
						name: 'John',
						details: { age: 30 }
					}
				}
			})
		})

		it('should parse array of primitives', () => {
			const input = `test:\n  items:\n    - one\n    - 42\n    - true`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					items: ['one', 42, true]
				}
			})
		})

		it('should parse top-level array of primitives', () => {
			const input = `- one\n- 42\n- true`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, ['one', 42, true])
		})

		it('should parse top-level array with comments', () => {
			const input = `# Array comment\n- one\n- 42`
			const context = { comments: [] }
			const result = NaN0.parse(input, context)
			assert.deepStrictEqual(result, ['one', 42])
			assert.deepStrictEqual(context.comments, [{ text: "Array comment", id: "[0]" }])
		})

		it('should parse array with wrapped object', () => {
			const input = `test:\n  items:\n    - obj:\n        name: Val\n    - 100`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					items: [{ obj: { name: 'Val' } }, 100]
				}
			})
		})

		it('should parse multiline string in object', () => {
			const input = `test:\n  desc: |\n    line one\n    line two`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					desc: 'line one\nline two'
				}
			})
		})

		it('should parse multiline string in array', () => {
			const input = `test:\n  lines:\n    - |\n      first\n      second`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					lines: ['first\nsecond']
				}
			})
		})

		it('should parse numbers with underscores', () => {
			const input = `test:\n  num: 160_000_500.345\n  neg: -42`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					num: 160000500.345,
					neg: -42
				}
			})
		})

		it('should parse dates', () => {
			const input = `test:\n  date: 2024-11-13\n  time: 2024-11-13T19:34:00`
			const result = NaN0.parse(input)
			assert.ok(result.test.date instanceof Date)
			assert.ok(result.test.time instanceof Date)
		})

		it('should parse quoted strings', () => {
			const input = `test:\n  quoted: "escaped \\" quote"`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, {
				test: {
					quoted: 'escaped " quote'
				}
			})
		})

		it.skip("should parse all elements", () => {
			const context = { comments: [] }
			const result = NaN0.parse(exampleOfFormat, context)
			assert.deepStrictEqual(result, exampleOfExpected)
			assert.deepStrictEqual(context.comments, exampleOfComments)
		})

		it('should throw on invalid top level', () => {
			const input = `test:\n  invalid`
			assert.throws(() => NaN0.parse(input), /no colon/)
		})

		it('should throw on invalid array item', () => {
			const input = `test:\n  items:\n    - one\n    invalid`
			assert.throws(() => NaN0.parse(input), /Invalid array item/)
		})

		it("should parse object inside array itens", () => {
			const input = `- Item 1\n- Item 2\n- nested:\n  object: 1`
			const result = NaN0.parse(input)
			assert.deepStrictEqual(result, ["Item 1", "Item 2", { nested: { "object": 1 } }])
		})
	})

	describe("stringify", () => {
		it('Should stringify empty object', () => {
			const input = {}
			const output = NaN0.stringify(input)
			const expected = `{}`
			assert.strictEqual(output, expected)
		})

		it('Should stringify empty object with comments', () => {
			const input = {}
			const output = NaN0.stringify(input, { comments: [{ text: "Comment", id: "." }] })
			const expected = `# Comment\n{}`
			assert.strictEqual(output, expected)
		})

		it('Should stringify empty array', () => {
			const input = []
			const output = NaN0.stringify(input)
			const expected = `[]`
			assert.strictEqual(output, expected)
		})

		it('Should stringify empty array with comments', () => {
			const input = []
			const output = NaN0.stringify(input, { comments: [{ text: "Comment", id: "[0]" }] })
			const expected = `# Comment\n[]`
			assert.strictEqual(output, expected)
		})

		it('Should stringify top-level object with multiple keys', () => {
			const input = { name: 'John', age: 30 }
			const output = NaN0.stringify(input)
			const expected = `name: John\nage: 30`
			assert.strictEqual(output, expected)
		})

		it('Should stringify top-level object with comments', () => {
			const input = { name: 'John', age: 30 }
			const output = NaN0.stringify(input, { comments: [{ text: "Top comment", id: "." }] })
			const expected = `# Top comment\nname: John\nage: 30`
			assert.strictEqual(output, expected)
		})

		it('Should stringify top-level array of primitives', () => {
			const input = ['one', 42, true]
			const output = NaN0.stringify(input)
			const expected = `- one\n- 42\n- true`
			assert.strictEqual(output, expected)
		})

		it('Should stringify top-level array with comments', () => {
			const input = ['one', 42]
			const context = { comments: [{ text: "Array comment\nNext line", id: "[0]" }] }
			const output = NaN0.stringify(input, context)
			const expected = `# Array comment\n  Next line\n- one\n- 42`
			assert.strictEqual(output, expected)
		})

		it('Should stringify empty array', () => {
			const input = { list: [] }
			const output = NaN0.stringify(input)
			const expected = `list: []`
			assert.strictEqual(output, expected)
		})

		it('Should stringify empty object', () => {
			const input = { obj: {} }
			const output = NaN0.stringify(input)
			const expected = `obj: {}`
			assert.strictEqual(output, expected)
		})

		it('Should stringify simple object', () => {
			const input = { data: { name: 'John', age: 30 } }
			const output = NaN0.stringify(input)
			const expected = `data:\n  name: John\n  age: 30`
			assert.strictEqual(output, expected)
		})

		it('Should stringify array of primitives', () => {
			const input = {
				list: {
					items: ['one', 42, true]
				}
			}
			const output = NaN0.stringify(input)
			const expected = `list:\n  items:\n    - one\n    - 42\n    - true`
			assert.strictEqual(output, expected)
		})

		it('Should stringify array with wrapped object', () => {
			const input = {
				list: {
					items: [
						{ obj: { name: 'Val' } },
						100
					]
				}
			}
			const output = NaN0.stringify(input)
			const expected = `list:\n  items:\n    - obj:\n      name: Val\n    - 100`
			assert.strictEqual(output, expected)
		})

		it('Should stringify multiline string in object', () => {
			const input = {
				data: {
					desc: 'line one\nline two'
				}
			}
			const output = NaN0.stringify(input)
			const expected = `data:\n  desc: |\n    line one\n    line two`
			assert.strictEqual(output, expected)
		})

		it('Should stringify multiline string in array', () => {
			const input = {
				data: {
					lines: ['first\nsecond']
				}
			}
			const output = NaN0.stringify(input)
			const expected = `data:\n  lines:\n    - |\n      first\n      second`
			assert.strictEqual(output, expected)
		})

		it('Should stringify numbers with underscores', () => {
			const input = {
				data: {
					num: 160000500.345,
					neg: -42
				}
			}
			const output = NaN0.stringify(input)
			const expected = `data:\n  num: 160_000_500.345\n  neg: -42`
			assert.strictEqual(output, expected)
		})

		it('Should stringify dates', () => {
			const date = new Date(2024, 10, 13)
			const time = new Date(2024, 10, 13, 19, 34, 0)
			const input = {
				data: {
					date,
					time
				}
			}
			const output = NaN0.stringify(input)
			const expected = `data:\n  date: 2024-11-13\n  time: 2024-11-13T19:34:00`
			assert.strictEqual(output, expected)
		})

		it('Should stringify quoted strings', () => {
			const input = {
				data: {
					quoted: 'escaped " quote'
				}
			}
			const output = NaN0.stringify(input)
			const expected = `data:\n  quoted: "escaped \\" quote"`
			assert.strictEqual(output, expected)
		})

		it('Should roundtrip parse-stringify', () => {
			const parsed = NaN0.parse(exampleOfFormat)
			const stringified = NaN0.stringify(parsed)
			const reparsed = NaN0.parse(stringified)
			assert.deepStrictEqual(reparsed, parsed)
		})

		it('Should roundtrip with top-level comments', () => {
			const input = `# Original comment\nname: John`
			const parsed = NaN0.parse(input)
			const stringified = NaN0.stringify(parsed)
			const reparsed = NaN0.parse(stringified)
			assert.deepStrictEqual(reparsed, parsed)
		})

		it('Should throw on invalid input for stringify', () => {
			assert.throws(() => NaN0.stringify('invalid'), /requires a non-null object or array/)
			assert.throws(() => NaN0.stringify(null), /requires a non-null object or array/)
			assert.throws(() => NaN0.stringify(42), /requires a non-null object or array/)
		})
	})
})
