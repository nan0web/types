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
class Node extends ContainerObject {
	/** @type {string} */
	content
	/** @type {Node[]} */
	children = []

	constructor({ content = "", children = [] } = {}) {
		super({ children, level: 0 })
		this.content = String(content)
		// @ts-ignore
		this.children = children.map(c => Node.from(c))
	}

	toString() {
		return [
			this.content,
			...this.children.map(String),
		].join("\n\n")
	}
}

export default Node
