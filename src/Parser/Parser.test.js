import { describe, it } from 'node:test'
import assert from 'node:assert'
import Parser from './Parser.js'
import Node from './Node.js'

describe('Parser', () => {
	it('should create a Parser with default eol and tab', () => {
		const parser = new Parser()
		assert.strictEqual(parser.eol, '\n')
		assert.strictEqual(parser.tab, '  ')
	})

	it('should create a Parser with custom eol and tab', () => {
		const parser = new Parser({ eol: '\r\n', tab: '\t' })
		assert.strictEqual(parser.eol, '\r\n')
		assert.strictEqual(parser.tab, '\t')
	})

	it('should calculate indentation correctly', () => {
		const parser = new Parser()
		assert.strictEqual(parser.readIndent(''), 0)
		assert.strictEqual(parser.readIndent('  '), 1)
		assert.strictEqual(parser.readIndent('    '), 2)
		assert.strictEqual(parser.readIndent('      '), 3)
		assert.strictEqual(parser.readIndent('Hello'), 0)
		assert.strictEqual(parser.readIndent('  Hello'), 1)
		assert.strictEqual(parser.readIndent('    Hello'), 2)
	})

	it('should decode a simple text into a tree', () => {
		const parser = new Parser()
		const text = 'Root\n  Child1\n  Child2\n    Grandchild'
		const root = parser.decode(text)

		assert.ok(root instanceof Node)
		assert.strictEqual(root.content, '')
		assert.strictEqual(root.children.length, 1)

		const rootNode = root.children[0]
		assert.strictEqual(rootNode.content, 'Root')
		assert.strictEqual(rootNode.children.length, 2)

		const child1 = rootNode.children[0]
		const child2 = rootNode.children[1]
		assert.strictEqual(child1.content, 'Child1')
		assert.strictEqual(child1.children.length, 0)
		assert.strictEqual(child2.content, 'Child2')
		assert.strictEqual(child2.children.length, 1)

		const grandchild = child2.children[0]
		assert.strictEqual(grandchild.content, 'Grandchild')
		assert.strictEqual(grandchild.children.length, 0)
	})

	it('should encode a tree back into text', () => {
		const parser = new Parser()
		const root = new Node({
			children: [
				new Node({
					content: 'Root',
					children: [
						new Node({ content: 'Child1' }),
						new Node({
							content: 'Child2',
							children: [
								new Node({ content: 'Grandchild' })
							]
						})
					]
				})
			]
		})

		const expected = 'Root\n  Child1\n  Child2\n    Grandchild'
		const result = parser.encode(root.children[0])
		assert.strictEqual(result, expected)
	})

	it('should handle empty lines correctly during decoding', () => {
		const parser = new Parser()
		const text = 'Root\n\n  Child\n\n\n  AnotherChild'
		const root = parser.decode(text)

		assert.strictEqual(root.children.length, 1)
		const rootNode = root.children[0]
		assert.strictEqual(rootNode.content, 'Root')
		assert.strictEqual(rootNode.children.length, 2)

		const child1 = rootNode.children[0]
		const child2 = rootNode.children[1]
		assert.strictEqual(child1.content, 'Child')
		assert.strictEqual(child2.content, 'AnotherChild')
	})

	it("should find tab from text", () => {
		const text = [
			"# Document",
			"1. First task",
			"  1. First sub-task",
			"  1. Second sub-task",
			"    1. Sub-sub-task",
			"1. Second task",
		].join("\n")
		const short = Parser.findTab(text)
		assert.equal(short, "  ")

		const long = Parser.findTab(text, [4, "\t"])
		assert.equal(long, "    ")

		const tab = Parser.findTab("\tFirst line\n  Second line", ["\t", 2, 4])
		assert.equal(tab, "\t")
	})
})
