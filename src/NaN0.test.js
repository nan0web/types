import { describe, it } from 'node:test'
import assert from 'node:assert'
import NaN0, { exampleOfExpected, exampleOfFormat } from './NaN0.js'

describe('NaN0 parse and stringify', () => {
	describe("parse", () => {
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

		it("should parse all elements", () => {
			const result = NaN0.parse(exampleOfFormat)
			assert.deepStrictEqual(result, exampleOfExpected)
		})

		it('should throw on invalid top level', () => {
			const input = `key1: val1\nkey2: val2`
			assert.throws(() => NaN0.parse(input), /expected one top-level key/)
		})

		it('should throw on invalid array item', () => {
			const input = `test:\n  items:\n    - one\n    invalid`
			assert.throws(() => NaN0.parse(input), /Invalid array item/)
		})
	})

	describe("stringify", () => {
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

		it('Should throw on invalid input for stringify', () => {
			assert.throws(() => NaN0.stringify({ a: 1, b: 2 }), /exactly one top-level key/)
			assert.throws(() => NaN0.stringify('invalid'), /exactly one top-level key/)
			assert.throws(() => NaN0.stringify([]), /exactly one top-level key/)
		})
	})
})