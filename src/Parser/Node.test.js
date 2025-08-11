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
})