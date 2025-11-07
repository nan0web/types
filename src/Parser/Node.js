/* -------------------------------------------------------------
	 parser/src/Parser.js
	 A minimal, dependency‑free indentation (tab‑bet) parser.
	 Only @nan0web/types is used for the ContainerObject base class.
	 ----------------------------------------------------------- */

import ContainerObject from "../Object/ContainerObject.js"

/**
 * ──  Generic tree node that every format will start from
 * ──  { content:string, children:Array<Node> }
 */
export default class Node extends ContainerObject {
	/** @type {string} */
	content
	/** @type {Node[]} */
	children = []
	/** @type {number} */
	indent

	constructor(input = {}) {
		const { content = "", children = [], indent = 0 } = input
		super({ children, level: 0 })
		this.content = String(content)
		// @ts-ignore
		this.children = children.map(c => Node.from(c))
		this.indent = Number(indent)
	}

	/**
	 * Maps over children.
	 *
	 * @param {(value: Node, index: number, arr: Node[]) => any[]} callback
	 * @param {boolean} [recursively=false]
	 * @returns {Array}
	 */
	map(callback, recursively) {
		return super.map(callback, recursively)
	}

	/**
	 * @param {object} [input]
	 * @param {boolean} [input.trim=false]
	 * @param {string} [input.tab="\t"]
	 * @param {string} [input.eol="\n"]
	 * @returns
	 */
	toString({ trim = false, tab = "\t", eol = "\n" } = {}) {
		const prefix = trim ? "" : tab.repeat(this.indent)
		return [
			prefix + this.content,
			...this.children.map(c => c.toString({ trim, tab, eol })),
		].join(eol)
	}

	/**
	 * @param {any} input
	 * @returns {Node}
	 */
	static from(input) {
		if (input instanceof Node) return input
		return new Node(input)
	}
}
