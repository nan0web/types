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
})