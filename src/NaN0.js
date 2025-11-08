import Parser from './Parser/Parser.js'
import Node from './Parser/Node.js'

/**
 * @typedef {Object} Context
 * @property {Array<{ text: string, id: string }>} comments
 * @property {number} [i]
 * @property {string} [next]
 */

/**
 * NaN0 format - "0 is not a number" - zero is a universe that is a source of any
 * other numbers and else.
 * The word rea1 means subjective reality, because everyone's reality is different.
 * The word g0d means god as infinite energy and everything else is a part of it.
 * So there is no objective reality until everyone becomes an only one that is g0d.
 * Becomes here means rea1ize the rea0ity.
 * @example The top level element of NaN0 document can be any of NaN0 types.
 *          NaN0 document is useful in cases of storing pure data such as types:
 *          boolean, number, string, date, object, array, array of previous types.
 *          These types can cover most of business cases when structuring data into
 *          classes and nested and connected business logic as it is in rea1 life.
 */


export default class NaN0 {
	static NEW_LINE = "\n"
	static TAB = "  "
	static EMPTY_ARRAY = "[]"
	static EMPTY_DATE = "0000-00-00"
	static EMPTY_OBJECT = "{}"
	static MULTILINE_START = "|"
	static VALUE_DELIMITER = [": ", /^(.+):$/]
	static COMMENT_START = "# "

	static numberRegex = /^-?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?$/
	static dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(?:[+-]\d{2}:\d{2}|[+-]\d{4}|Z)?)?$/

	static parseValue(str) {
		const s = str.trim()
		if (s === '') return ''
		// number first to avoid parsing as Date(ms)
		if (this.numberRegex.test(s)) {
			const cleanNum = s.replace(/_/g, '')
			const asNum = Number(cleanNum)
			if (!isNaN(asNum)) {
				return asNum
			}
		}
		// date
		if (this.dateRegex.test(s)) {
			let dateStr = s
			// Fix timezone without colon, e.g. +0000 -> +00:00
			if (s.match(/[+-]\d{4}$/) && !s.includes(':')) {
				const tzMatch = s.match(/([+-]\d{4})$/)
				if (tzMatch) {
					const tz = tzMatch[1]
					const hh = tz.substring(1, 3)
					const mm = tz.substring(3)
					dateStr = s.replace(tz, `${tz[0]}${hh}:${mm}`)
				}
			}
			const asDate = new Date(dateStr)
			if (!isNaN(asDate.getTime())) {
				return asDate
			}
		}
		// bool null
		if (s === 'true') return true
		if (s === 'false') return false
		if (s === 'null') return null
		// quoted string
		if (s.startsWith('"') && s.endsWith('"')) {
			try {
				return JSON.parse(s)
			} catch {
				return s.slice(1, -1)
			}
		}
		// plain string
		return s
	}

	static formatValue(value) {
		if (value === null) return 'null'
		if (typeof value === 'boolean') return value.toString()
		if (typeof value === 'number') {
			if (Number.isNaN(value)) return 'NaN'
			let numStr = value.toString()
			if (numStr === '-0') numStr = '0'
			return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '_')
		}
		if (value instanceof Date) {
			const year = value.getFullYear()
			if (isNaN(year)) return this.EMPTY_DATE
			const month = String(value.getMonth() + 1).padStart(2, '0')
			const day = String(value.getDate()).padStart(2, '0')
			const dateStr = `${year}-${month}-${day}`
			const hours = String(value.getHours()).padStart(2, '0')
			const minutes = String(value.getMinutes()).padStart(2, '0')
			const seconds = String(value.getSeconds()).padStart(2, '0')
			if (hours === '00' && minutes === '00' && seconds === '00') {
				return dateStr
			}
			return `${dateStr}T${hours}:${minutes}:${seconds}`
		}
		if (typeof value === 'string') {
			if (value.includes('"') || value.includes(this.NEW_LINE) || value.trim() === '' || /[:#]/.test(value)) {
				const escaped = value.replace(/"/g, '\\"')
				return `"${escaped}"`
			}
			return value
		}
		return String(value)
	}

	/**
	 * @param {string} text
	 * @param {string | RegExp | Array<string | RegExp>} condition
	 * @returns {{ condition: string | RegExp, name: string } | false}
	 */
	static match(text, condition) {
		if (!Array.isArray(condition)) {
			condition = [condition]
		}
		for (const cond of condition) {
			if (cond instanceof RegExp) {
				const found = text.match(cond)
				if (found) {
					return { condition: cond, name: found[1] }
				}
			}
			if ("string" === typeof cond && text.includes(cond)) {
				const [name] = text.split(cond)
				return { condition: cond, name }
			}
		}
		return false
	}

	static parseComments(allChildren, startIdx = 0) {
		let commentLines = []
		let i = startIdx
		let nextIdx = "."
		while (i < allChildren.length) {
			const c = allChildren[i]
			const ct = c.content.trim()
			if (ct !== '' && !ct.startsWith(this.COMMENT_START)) {
				const found = this.match(ct, this.VALUE_DELIMITER)
				if (found) {
					nextIdx = found.name
				}
				break
			}
			if (ct.startsWith(this.COMMENT_START)) {
				let commentText = ct.slice(this.COMMENT_START.length).trim()
				if (c.children.length > 0) {
					const subComments = c.children.map(sub => sub.content.trim()).filter(sub => sub !== '').join('\n')
					if (subComments) commentText += `\n${subComments}`
				}
				commentLines.push(commentText)
			}
			i++
		}
		return { comments: commentLines.join('\n'), nextIdx, i }
	}

	/**
	 * @param {any[]} allChildren
	 * @param {number} level
	 * @param {Context} context
	 * @returns {any}
	 */
	static parseContainer(allChildren, level = 0, context = { comments: [], i: 0 }) {
		if (allChildren.length === 0) return {}
		let { comments: topComments, i, nextIdx } = this.parseComments(allChildren)
		if (i >= allChildren.length) {
			const result = {}
			if (topComments) {
				context.comments.push({ text: topComments, id: "." })
			}
			return result
		}
		const firstNode = allChildren[i]
		const firstContent = firstNode.content.trim()

		/* ---------- EMPTY ARRAY ---------- */
		if (firstContent === this.EMPTY_ARRAY) {
			let result = []
			if (topComments || firstNode.children.length > 0) {
				const emptyComments = topComments ? `${topComments}\n` : ''
				const subComments = firstNode.children.map(c => c.content).filter(l => l.trim() !== '').join('\n')
				const allEmptyComments = subComments ? `${emptyComments}${subComments}` : emptyComments
				if (allEmptyComments) {
					/*  comment id for an empty array should refer to the first
					 *  array index (0) when the array is at the root level.
					 *  For nested arrays we keep the original behaviour
					 *  (use the node position `${i}`) to stay compatible
					 *  with existing expectations. */
					const commentId = level === 0 ? `[0]` : `[${i}]`
					context.comments.push({ text: allEmptyComments.trim(), id: commentId })
				}
			}
			return result
		}

		/* ---------- EMPTY OBJECT ---------- */
		if (firstContent === this.EMPTY_OBJECT) {
			let result = {}
			if (topComments || firstNode.children.length > 0) {
				const emptyComments = topComments ? `${topComments}\n` : ''
				const subComments = firstNode.children.map(c => c.content).filter(l => l.trim() !== '').join('\n')
				const allEmptyComments = subComments ? `${emptyComments}${subComments}` : emptyComments
				if (allEmptyComments) {
					context.comments.push({ text: allEmptyComments.trim(), id: nextIdx })
				}
			}
			return result
		}

		const isArray = firstContent.startsWith('- ')
		let result
		if (isArray) {
			const arrayChildren = allChildren.slice(i)
			context.i = i
			result = this.parseArrayWithComments(arrayChildren, level, context)
			if (topComments) {
				/*  Same logic as for empty arrays – comment index should be
				 *  `[0]` at the root level, otherwise keep the original
				 *  calculation based on the node position. */
				const commentId = level === 0 ? `[0]` : `[${i}]`
				context.comments.push({ text: topComments, id: commentId })
			}
		} else {
			const objectChildren = allChildren.slice(i)
			context.i = i
			context.next = nextIdx
			result = this.parseObjectWithComments(objectChildren, level, context)
			if (topComments) {
				context.comments.push({ text: topComments, id: nextIdx })
			}
		}
		return result
	}

	/**
	 *
	 * @param {any[]} allChildren
	 * @param {number} level
	 * @param {Context} [context]
	 * @returns
	 */
	static parseObjectWithComments(allChildren, level = 0, context = { comments: [] }) {
		const obj = {}
		let i = 0
		let currentComments = ''
		while (i < allChildren.length) {
			const { comments, i: nextI } = this.parseComments(allChildren, i)
			i = nextI
			if (i >= allChildren.length) break
			if (comments) currentComments += (currentComments ? '\n' : '') + comments

			const fieldNode = allChildren[i]
			const fieldContent = fieldNode.content.trim()
			const colonIdx = fieldContent.indexOf(':')
			if (colonIdx === -1) {
				throw new Error(`Invalid object field at level ${level}: no colon in "${fieldContent}"`)
			}
			const key = fieldContent.substring(0, colonIdx).trim()
			let valuePart = fieldContent.substring(colonIdx + 1).trim()
			const hasChildren = fieldNode.children.length > 0

			let value
			if (valuePart === this.MULTILINE_START) {
				// multiline
				const lines = fieldNode.children.map(c => c.content).filter(l => l.trim() !== '').join(this.NEW_LINE)
				value = lines
			} else if (valuePart === '' && hasChildren) {
				// container
				value = this.parseContainer(fieldNode.children, level + 1)
			} else {
				// same line
				if (valuePart === this.EMPTY_ARRAY) {
					value = []
				} else if (valuePart === this.EMPTY_OBJECT) {
					value = {}
				} else {
					value = this.parseValue(valuePart)
				}
			}
			if (currentComments) {
				context.comments.push({ text: currentComments, id: key || "." })
				currentComments = ''
			}
			obj[key] = value
			i++
			currentComments = ''
		}
		if (currentComments) {
			context.comments.push({ text: currentComments, id: "." })
		}
		return obj
	}

	/**
	 *
	 * @param {any[]} allChildren
	 * @param {number} level
	 * @param {Context} context
	 * @returns
	 */
	static parseArrayWithComments(allChildren, level = 0, context = { comments: [] }) {
		const arr = []
		let currentComments = ''
		let i = 0
		while (i < allChildren.length) {
			const { comments, i: nextI } = this.parseComments(allChildren, i)
			i = nextI
			if (i >= allChildren.length) break
			if (comments) currentComments += (currentComments ? '\n' : '') + comments

			const itemNode = allChildren[i]
			if (!itemNode.content.trim().startsWith('- ')) {
				throw new Error(`Invalid array item at level ${level}: "${itemNode.content}"`)
			}
			let content = itemNode.content.trim().replace(/^-\s*/, '').trim()
			const hasChildren = itemNode.children.length > 0

			let value
			let name
			if (!hasChildren) {
				value = this.parseValue(content)
			} else {
				const foundObject = this.match(content, this.VALUE_DELIMITER)
				if (content === this.MULTILINE_START) {
					const lines = itemNode.children.map(c => c.content).filter(l => l.trim() !== '').join(this.NEW_LINE)
					value = lines
				} else if (foundObject) {
					name = foundObject.name
					value = { [name]: this.parseContainer(itemNode.children, level + 1) }
				} else {
					throw new Error(`Invalid array item with children at level ${level}: "${itemNode.content}"`)
				}
			}
			if (currentComments && value && typeof value === 'object') {
				context.comments.push({ text: currentComments, id: name || "." })
				currentComments = ''
			}
			arr.push(value)
			i++
			currentComments = ''
		}
		if (currentComments) {
			context.comments.push({ text: currentComments, id: "[0]" })
		}
		return arr
	}

	static addValueToNode(parent, value, level, key) {
		const fieldNode = new Node({ content: '', indent: level })
		let content
		let needsChildren = false
		if (Array.isArray(value)) {
			if (value.length === 0) {
				content = `${key}: ${this.EMPTY_ARRAY}`
			} else {
				content = `${key}:`
				needsChildren = true
			}
		} else if (value instanceof Date) {
			content = `${key}: ${this.formatValue(value)}`
		} else if (typeof value === 'string') {
			if (value.includes(this.NEW_LINE)) {
				content = `${key}: ${this.MULTILINE_START}`
				needsChildren = true
			} else {
				const valStr = this.formatValue(value)
				content = `${key}: ${valStr}`
			}
		} else if (value && typeof value === 'object' && value !== null) {
			const keys = Object.keys(value)
			if (keys.length === 0) {
				content = `${key}: ${this.EMPTY_OBJECT}`
			} else {
				content = `${key}:`
				needsChildren = true
			}
		} else {
			const valStr = this.formatValue(value)
			content = `${key}: ${valStr}`
		}
		fieldNode.content = content
		parent.children.push(fieldNode)
		if (needsChildren) {
			if (Array.isArray(value)) {
				value.forEach(item => this.addArrayItemToNode(fieldNode, item, level + 1))
			} else if (typeof value === 'string') {
				// multiline
				const lines = value.split(this.NEW_LINE).filter(l => l.trim() !== '')
				lines.forEach(line => fieldNode.children.push(new Node({ content: line, indent: level + 1 })))
			} else {
				// object
				Object.entries(value).forEach(([subKey, subValue]) => this.addValueToNode(fieldNode, subValue, level + 1, subKey))
			}
		}
	}

	static addArrayItemToNode(parent, item, level) {
		const itemNode = new Node({ content: '', indent: level })
		let content
		let needsChildren = false
		let nodeType = 'simple'
		if (Array.isArray(item)) {
			if (item.length === 0) {
				content = `- ${this.EMPTY_ARRAY}`
			} else {
				// not supported currently
				throw new Error('NaN0 does not support nested non-empty arrays in array items')
			}
		} else if (item instanceof Date) {
			content = `- ${this.formatValue(item)}`
		} else if (typeof item === 'string') {
			if (item.includes(this.NEW_LINE)) {
				content = `- ${this.MULTILINE_START}`
				needsChildren = true
				nodeType = 'multiline'
			} else {
				const valStr = this.formatValue(item)
				content = `- ${valStr}`
			}
		} else if (item && typeof item === 'object' && item !== null) {
			const keys = Object.keys(item)
			if (keys.length === 0) {
				content = `- ${this.EMPTY_OBJECT}`
			} else if (keys.length === 1) {
				const [subKey, subValue] = Object.entries(item)[0]
				const isSubComplex = Array.isArray(subValue) ? subValue.length > 0 : (subValue && typeof subValue === 'object' && subValue !== null ? Object.keys(subValue).length > 0 : (typeof subValue === 'string' && subValue.includes(this.NEW_LINE)))
				if (isSubComplex) {
					content = `- ${subKey}:`
					needsChildren = true
					nodeType = 'complex'
				} else {
					const subValStr = this.formatValue(subValue)
					content = `- ${subKey}: ${subValStr}`
				}
			} else {
				throw new Error('NaN0 array items that are objects must have exactly one key')
			}
		} else {
			const valStr = this.formatValue(item)
			content = `- ${valStr}`
		}
		itemNode.content = content
		parent.children.push(itemNode)
		if (needsChildren) {
			if (nodeType === 'multiline') {
				const lines = item.split(this.NEW_LINE).filter(l => l.trim() !== '')
				lines.forEach(line => itemNode.children.push(new Node({ content: line, indent: level + 1 })))
			} else if (nodeType === 'complex') {
				const [subKey, subValue] = Object.entries(item)[0]
				if (typeof subValue === 'string' && subValue.includes(this.NEW_LINE)) {
					const lines = subValue.split(this.NEW_LINE).filter(l => l.trim() !== '')
					lines.forEach(line => itemNode.children.push(new Node({ content: line, indent: level + 1 })))
				} else {
					Object.entries(subValue).forEach(([k, v]) => this.addValueToNode(itemNode, v, level + 1, k))
				}
			}
		}
	}

	/**
	 * Parses the NaN0 format into an object or array
	 * @throws {Error} If invalid format
	 * @param {string} input - Input in NaN0 format
	 * @param {Context} context
	 * @returns {any} - Parsed JavaScript value (object or array)
	 */
	static parse(input, context = { comments: [] }) {
		const parser = new Parser({ eol: this.NEW_LINE, tab: this.TAB })
		const root = parser.decode(input)
		const result = this.parseContainer(root.children, 0, context)
		context.comments = context.comments.reverse()
		return result
	}

	/**
	 * Stringifies any input object or array into .NaN0 format
	 * @throws {Error} If input is not a non-null object or array
	 * @param {Object|Array} input - Input object or array
	 * @param {Context} context
	 * @returns {string} - NaN0 formatted string
	 */
	static stringify(input, context = { comments: [] }) {
		if (input == null || (typeof input !== 'object' && !Array.isArray(input))) {
			throw new Error('NaN0.stringify requires a non-null object or array')
		}

		const renderComments = (path) => {
			let str = ""
			if (context.comments) {
				str += context.comments.map(
					({ text, id }) => path === id ? text.split("\n").map(
						(row, i) => i > 0 ? this.TAB + row : row
					).join("\n") : ""
				).filter(Boolean).join("\n#")
				if (str) str = "# " + str + "\n"
			}
			return str
		}

		if (Array.isArray(input)) {
			const inputCopy = [...input]
			let rest = inputCopy
			let str = renderComments("[0]")
			if (rest.length === 0) {
				return str + this.EMPTY_ARRAY
			}
			const parent = new Node({ content: '', indent: 0 })
			rest.forEach(item => this.addArrayItemToNode(parent, item, 0))
			str += parent.children.map(c => c.toString({ trim: false, tab: this.TAB, eol: this.NEW_LINE })).join(this.NEW_LINE)
			return str
		} else {
			const inputCopy = { ...input }
			let str = renderComments(".")
			if (Object.keys(inputCopy).length === 0) {
				return str + this.EMPTY_OBJECT
			}
			const parent = new Node({ content: '', indent: 0 })
			Object.entries(inputCopy).forEach(([key, value]) => this.addValueToNode(parent, value, 0, key))
			str += parent.children.map(c => c.toString({ trim: false, tab: this.TAB, eol: this.NEW_LINE })).join(this.NEW_LINE)
			return str
		}
	}
}
