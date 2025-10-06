import { describe, it } from 'node:test'
import assert from 'node:assert'
import ContainerObject from './ContainerObject.js'

describe('ContainerObject', () => {
	it('should initialize with default values', () => {
		const container = new ContainerObject()
		assert.strictEqual(container.level, 0)
		assert.strictEqual(container.recent, null)
		assert.deepStrictEqual(container.children, [])
	})

	it('should add a child correctly', () => {
		const container = new ContainerObject()
		const child = new ContainerObject()

		container.add(child)

		assert.strictEqual(container.children.length, 1)
		assert.strictEqual(container.children[0], child)
		assert.strictEqual(container.recent, child)
		assert.strictEqual(child.level, 1)
	})

	it('should remove a child correctly', () => {
		const container = new ContainerObject()
		const child = new ContainerObject()

		container.add(child)
		container.remove(child)

		assert.strictEqual(container.children.length, 0)
		assert.strictEqual(container.recent, null)
	})

	it('should update recent when multiple children added', () => {
		const container = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()

		container.add(child1)
		container.add(child2)

		assert.strictEqual(container.recent, child2)
	})

	it('should handle child removal and update recent properly', () => {
		const container = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()
		const child3 = new ContainerObject()

		container.add(child1).add(child2).add(child3)
		container.remove(child2)

		assert.strictEqual(container.children.length, 2)
		assert.strictEqual(container.recent, child3)
	})

	it('should find children matching a condition', () => {
		const container = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()
		const grandChild1 = new ContainerObject()
		const grandChild2 = new ContainerObject()

		container.add(child1).add(child2)
		child1.add(grandChild1)
		child2.add(grandChild2)

		const found = container.find(node => node.level === 2, true)
		assert.ok(found)
		assert.ok(found === grandChild1 || found === grandChild2)
	})

	it('should find children matching a condition with grandchilren before children', () => {
		const container = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()
		const grandChild1 = new ContainerObject()
		const grandChild2 = new ContainerObject()

		child1.add(grandChild1)
		child2.add(grandChild2)
		container.add(child1).add(child2)

		const found = container.find(node => node.level === 2, true)
		assert.ok(found)
		assert.ok(found === grandChild1 || found === grandChild2)
	})

	it('should flatten all nested children', () => {
		const root = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()
		const grandChild1 = new ContainerObject()
		const grandChild2 = new ContainerObject()

		child1.add(grandChild1)
		child2.add(grandChild2)
		root.add(child1).add(child2)

		const flatChildren = root.flat()
		assert.strictEqual(flatChildren.length, 5) // root, child1, child2, grandChild1, grandChild2
		assert.ok(flatChildren.includes(root))
		assert.ok(flatChildren.includes(child1))
		assert.ok(flatChildren.includes(child2))
		assert.ok(flatChildren.includes(grandChild1))
		assert.ok(flatChildren.includes(grandChild2))
	})

	it('should map over children synchronously', () => {
		const container = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()

		container.add(child1).add(child2)

		const levels = container.map(child => child.level)
		assert.deepStrictEqual(levels, [1, 1])
	})

	it('should map over children asynchronously', async () => {
		const container = new ContainerObject()
		const child1 = new ContainerObject()
		const child2 = new ContainerObject()

		container.add(child1).add(child2)

		const asyncFn = async (child) => {
			return child.level * 2
		}

		const levels = await container.asyncMap(asyncFn)
		assert.deepStrictEqual(levels, [2, 2])
	})
})
