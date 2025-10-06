import { describe, it } from 'node:test'
import assert from 'node:assert'
import Node from './Node.js'

describe('Node', () => {
	it('should create a Node with default content and children', () => {
		const node = new Node()
		assert.strictEqual(node.content, '')
		assert.deepStrictEqual(node.children, [])
	})

	it('should create a Node with custom content', () => {
		const node = new Node({ content: 'Custom Content' })
		assert.strictEqual(node.content, 'Custom Content')
		assert.deepStrictEqual(node.children, [])
	})

	it('should create a Node with custom children', () => {
		const childNode = new Node({ content: 'Child Node' })
		const node = new Node({ children: [childNode] })
		assert.strictEqual(node.content, '')
		assert.deepStrictEqual(node.children, [childNode])
	})

	it('should create a Node with both custom content and children', () => {
		const childNode = new Node({ content: 'Child Node' })
		const node = new Node({ content: 'Parent Node', children: [childNode] })
		assert.strictEqual(node.content, 'Parent Node')
		assert.deepStrictEqual(node.children, [childNode])
	})

	it('should handle multi-level nested nodes correctly', () => {
		const grandChildNode = new Node({ content: 'Grandchild Node', indent: 2 })
		const childNode = new Node({ content: 'Child Node', indent: 1, children: [grandChildNode] })
		const parentNode = new Node({ content: 'Parent Node', indent: 0, children: [childNode] })

		assert.strictEqual(parentNode.content, 'Parent Node')
		assert.strictEqual(parentNode.children.length, 1)

		const child = parentNode.children[0]
		assert.strictEqual(child.content, 'Child Node')
		assert.strictEqual(child.children.length, 1)
		assert.strictEqual(child.children[0].content, 'Grandchild Node')
		assert.strictEqual(child.children[0].indent, 2)
	})

	it('should convert node to string representation', () => {
		const node = new Node({
			content: 'Root',
			indent: 0,
			children: [
				new Node({
					content: 'Child',
					indent: 1,
					children: [
						new Node({ content: 'Grandchild', indent: 2 })
					]
				})
			]
		})

		const expectedString = 'Root\n\tChild\n\t\tGrandchild'
		assert.strictEqual(node.toString(), expectedString)
	})

	it('should convert node to trimmed string representation', () => {
		const node = new Node({
			content: 'Root',
			indent: 0,
			children: [
				new Node({
					content: 'Child',
					indent: 1,
					children: [
						new Node({ content: 'Grandchild', indent: 2 })
					]
				})
			]
		})

		const expectedString = 'Root\nChild\nGrandchild'
		assert.strictEqual(node.toString({ trim: true }), expectedString)
	})

	it("should properly add levels", () => {
		const node = new Node({
			content: "Root",
			children: [
				new Node({ content: "Child", children: [ new Node({ content: "Grandchild" }) ] }),
			]
		})
		assert.deepStrictEqual(node.flat().map(n => n.level), [0, 1, 2])
	})

	it('should find children matching a condition with grandchilren before children', () => {
		const container = new Node({ content: "container" })
		const child1 = new Node({ content: "child1" })
		const child2 = new Node({ content: "child2" })
		const grandChild1 = new Node({ content: "grandChild1" })
		const grandChild2 = new Node({ content: "grandChild2" })

		child1.add(grandChild1)
		child2.add(grandChild2)
		container.add(child1).add(child2)

		const found = container.find(node => node.level === 2, true)
		assert.ok(found)
		assert.ok(found === grandChild1 || found === grandChild2)
	})
})
