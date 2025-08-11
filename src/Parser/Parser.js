import Node from "./Node.js"

/**
 * Base class that knows how to:
 *   1️⃣ read an indentation string,
 *   2️⃣ build a generic tree from a multiline text,
 *   3️⃣ stringify that tree again.
 *
 * Concrete parsers (NaN0, Markdown, …) inherit from it and
 * transform the generic tree into their own domain objects.
 */
class Parser {
	/** default line‑break & tab characters – override in ctor if you need something else */
	static EOL = "\n"
	static TAB = "  "

	/** @type {string} */
	eol
	/** @type {string} */
	tab

	/**
	 * @param {object} input
	 * @param {string} [input.eol="\n"]
	 * @param {string} [input.tab="  "]
	 */
	constructor(input = {}) {
		const {
			eol = Parser.EOL,
			tab = Parser.TAB,
		} = input
		this.eol = String(eol)
		this.tab = String(tab)
	}

	/**
	 * Indentation calculator.
	 * Returns how many *tab‑units* (default two spaces) the line starts with.
	 * @param {string} str
	 * @returns {number}
	 */
	readIndent(str) {
		let indent = 0
		for (let i = 0; i < str.length; i += this.tab.length) {
			const slice = str.slice(i, i + this.tab.length)
			if (slice !== this.tab) break
			++indent
		}
		return indent
	}

	/**
	 * Build the generic tree.
	 * @param {string} text
	 * @returns {Node}
	 */
	decode(text) {
		const rows = String(text).split(this.eol)
		const root = new Node()
		/** -1 = virtual root depth */
		const stack = [{ node: root, indent: -1 }]

		for (let i = 0; i < rows.length; i++) {
			const raw = rows[i]
			// skip completely empty lines
			if (!raw.trim()) continue

			const indent = this.readIndent(raw)
			const payload = raw.slice(indent * this.tab.length).trimEnd()

			// ----- find correct parent by popping deeper frames -----
			while (stack.length && indent <= stack[stack.length - 1].indent) {
				stack.pop()
			}
			const parent = stack[stack.length - 1].node

			// ----- create a new generic node -----
			const node = new Node({ content: payload })
			parent.children.push(node)

			// ----- push it onto the stack – it may own children -----
			stack.push({ node, indent })
		}

		return root
	}

	/**
	 * Stringify the generic tree.
	 * @param {Node} node
	 * @param {object} options
	 * @param {number} [options.indent=0]
	 * @returns {string}
	 */
	encode(node, options = {}) {
		const { indent = 0 } = options
		const line = `${this.tab.repeat(indent)}${node.content}`
		if (!node.children || node.children.length === 0) {
			return line
		}
		const childLines = node.children
			.map(child => this.encode(child, { indent: indent + 1 }))
			.join(this.eol)
			return `${line}${this.eol}${childLines}`
	}
}

export default Parser
