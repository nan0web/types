import { describe, it } from 'node:test'
import assert from 'node:assert'
import merge from './merge.js'

describe('merge()', () => {
	it('should merge two objects deeply', () => {
		const target = { a: 1, b: { c: 2, d: 3 } }
		const source = { b: { c: 4, e: 5 }, f: 6 }
		const result = merge(target, source)
		assert.deepStrictEqual(result, { a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 })
	})

	it('should handle non-object target', () => {
		const target = null
		const source = { a: 1 }
		const result = merge(target, source)
		assert.deepStrictEqual(result, { a: 1 })
	})

	it('should handle non-object source', () => {
		const target = { a: 1 }
		const source = null
		const result = merge(target, source)
		assert.deepStrictEqual(result, { a: 1 })
	})

	it('should merge arrays', () => {
		const target = { a: [1, 2, 3] }
		const source = { a: [4, 5] }
		const result = merge(target, source)
		assert.deepStrictEqual(result, { a: [1, 2, 3, 4, 5] })
	})

	it('should handle nested arrays and objects', () => {
		const target = { a: [1, { b: 2 }] }
		const source = { a: [{ c: 3 }] }
		const result = merge(target, source)
		assert.deepStrictEqual(result, { a: [1, { b: 2 }, { c: 3 }] })
	})

	it('should handle merging arrays uniqely', () => {
		const target = { a: [1, 2, 3, 3] }
		const source = { a: [2, 3, 4] }
		const result = merge(target, source, { unique: false })
		assert.deepStrictEqual(result, { a: [1, 2, 3, 3, 2, 3, 4] })
		const unique = merge(target, source)
		assert.deepStrictEqual(unique, { a: [1, 2, 3, 4] })
	})
})