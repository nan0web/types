import { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import ContainerObject from './ContainerObject.js'

describe('ContainerObject', () => {
	it('should create, add and retrieve elements', () => {
		const root = new ContainerObject()
		const child = new ContainerObject()
		root.add(child)
		assert.equal(root.children.length, 1)
		assert.ok(root.find(() => true) === child)
	})

	it('should flatten hierarchy', () => {
		const a = new ContainerObject()
		const b = new ContainerObject()
		const c = new ContainerObject()
		a.add(b)
		b.add(c)
		const flat = a.flat()
		assert.deepStrictEqual(flat, [a, b, c])
	})

	it('should filter recursively', () => {
		const a = new ContainerObject()
		const b = new ContainerObject()
		const leaf = new ContainerObject()
		a.add(b)
		b.add(leaf)
		const result = a.filter(() => true, true)
		assert.deepStrictEqual(result, [a, b, leaf])
	})

	it('should map recursively', () => {
		const a = new ContainerObject()
		const b = new ContainerObject()
		a.add(b)
		const ids = a.map((_, i) => i, true)
		assert.deepStrictEqual(ids, [0, 1])
	})

	it('should async map recursively', async () => {
		const a = new ContainerObject()
		const b = new ContainerObject()
		a.add(b)

		const asyncCallback = async (item, index) => {
			// Simulate async operation
			await new Promise(resolve => setTimeout(resolve, 1))
			return index
		}

		const ids = await a.asyncMap(asyncCallback, true)
		assert.deepStrictEqual(ids, [0, 1])
	})

	it('static from should return same instance when given ContainerObject', () => {
		const instance = new ContainerObject()
		const same = ContainerObject.from(instance)
		assert.strictEqual(same, instance)
	})

	it('static from should create new instance when given plain object', () => {
		const obj = { children: [] }
		const created = ContainerObject.from(obj)
		assert.ok(created instanceof ContainerObject)
	})
})
