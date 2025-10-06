import NaN0 from './NaN0.js'
import { describe, it } from 'node:test'
import assert from 'node:assert'

describe.skip('NaN0 parse and stringify', () => {
	it('Should parse empty array', () => {
		const input = NaN0.EMPTY_ARRAY
		const result = NaN0.parse(input)
		assert.deepEqual(result, [])
	})

	it('Should parse empty object', () => {
		const input = NaN0.EMPTY_OBJECT
		const result = NaN0.parse(input)
		assert.deepEqual(result, {})
	})

	it('Should stringify array', () => {
		const input = ['Item 1', 'Item 2']
		const output = NaN0.stringify(input)
		assert.strictEqual(output, `[]
  - Item 1
  - Item 2`)
	})

	it('Should stringify object', () => {
		const input = { name: 'John', age: 30 }
		const output = NaN0.stringify(input)
		const expected = `{}
  name: John
  age: 30`
		assert.strictEqual(output, expected)
	})
})
