import NANO from './NANO.js'
import Parser from './Parser/Parser.js'
import Node from './Parser/Node.js'

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
export const exampleOfFormat = `
NaN0 format file structure:
  array when empty: []
  array when have values:
    - object with some values:
      name: Some values
    - 160_000_500.345
    - |
      multiple line
      string
      only with the | no other symbols are available
  object when empty: {}
  # comment inline
  # second comment inline
  object when have values:
    name as a one line string: One line, possible with "
    name as a one line with quotes: "Only double quotes are possible \\" escaped quotes"
    # multiline comment
      as simple, as object or text comment.
      What do you want to know?
    string as a multiline: |
      only with the | char,
      no other symbols
    date as a one line value only: 2024-11-13
    datetime as one line value only: 2024-11-13T19:34:00
    short datetime: 2024-11-13T19:34:00
    number as integer: 160_000_500
    number as a float: 160_000_500.345
    negative number: -160_000_500.345
    boolean: true
    null: null`

export const exampleOfExpected = {
	"NaN0 format file structure": {
		"array when empty": [],
		"array when have values":
			[
				{ "object with some values": { name: "Some values" } },
				160_000_500.345,
				"multiple line\nstring\nonly with the | no other symbols are available",
			],
		"object when empty": {},
		// # comment inline
		// # second comment inline
		"object when have values": {
			"name as a one line string": "One line, possible with \"",
			"name as a one line with quotes": "Only double quotes are possible \" escaped quotes",
			// # multiline comment
			//   as simple, as object or text comment.
			//   What do you want to know?
			"string as a multiline": "only with the | char,\nno other symbols",
			"date as a one line value only": new Date("2024-11-13"),
			"datetime as one line value only": new Date("2024-11-13T19:34:00"),
			"short datetime": new Date("2024-11-13T19:34:00"),
			"number as integer": 160_000_500,
			"number as a float": 160_000_500.345,
			"negative number": -160_000_500.345,
			boolean: true,
			null: null,
		}
	}
}

class NaN0 {
	static NEW_LINE = "\n"
	static TAB = "  "
	static EMPTY_ARRAY = "[]"
	static EMPTY_DATE = "0000-00-00"
	static EMPTY_OBJECT = "{}"
	static MULTILINE_START = "|"
	static VALUE_DELIMITER = [": ", ":\n"]
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
			if (s.includes('+') && !s.includes('+') && s.match(/[+-]\d{4}$/)) {
				const tzMatch = s.match(/([+-]\d{4})$/)
				if (tzMatch) {
					const tz = tzMatch[1]
					const hh = tz.substring(1, 3)
					const mm = tz.substring(3)
					dateStr = s.replace(tz, `+${hh}:${mm}`)
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

	static parseContainer(children, level = 0) {
		const filtered = children.filter(c => {
			const ct = c.content.trim()
			return ct !== '' && !ct.startsWith(this.COMMENT_START)
		})
		if (filtered.length === 0) return {}
		const firstContent = filtered[0].content.trim()
		if (firstContent === this.EMPTY_ARRAY) return []
		if (firstContent === this.EMPTY_OBJECT) return {}
		const isArray = filtered[0].content.trim().startsWith('- ')
		return isArray ? this.parseArray(filtered, level) : this.parseObject(filtered, level)
	}

	static parseObject(fields, level = 0) {
		const obj = {}
		for (const fieldNode of fields) {
			const fieldContent = fieldNode.content.trim()
			const colonIdx = fieldContent.indexOf(':')
			if (colonIdx === -1) {
				throw new Error(`Invalid object field at level ${level}: no colon in "${fieldContent}"`)
			}
			const key = fieldContent.substring(0, colonIdx).trim()
			let valuePart = fieldContent.substring(colonIdx + 1).trim()
			const fieldChildren = fieldNode.children.filter(c => {
				const ct = c.content.trim()
				return ct !== '' && !ct.startsWith(this.COMMENT_START)
			})
			const hasFieldChildren = fieldChildren.length > 0
			if (hasFieldChildren) {
				if (valuePart === this.MULTILINE_START) {
					// multiline
					const lines = fieldChildren.map(c => c.content).filter(l => l.trim() !== '').join(this.NEW_LINE)
					obj[key] = lines
				} else if (valuePart === '') {
					// container
					obj[key] = this.parseContainer(fieldChildren, level + 1)
				} else {
					throw new Error(`Invalid field with children at level ${level}: valuePart "${valuePart}" for key "${key}"`)
				}
			} else {
				// same line
				if (valuePart === this.EMPTY_ARRAY) {
					obj[key] = []
				} else if (valuePart === this.EMPTY_OBJECT) {
					obj[key] = {}
				} else {
					obj[key] = this.parseValue(valuePart)
				}
			}
		}
		return obj
	}

	static parseArray(items, level = 0) {
		const arr = []
		for (const itemNode of items) {
			if (!itemNode.content.trim().startsWith('- ')) {
				throw new Error(`Invalid array item at level ${level}: "${itemNode.content}"`)
			}
			let content = itemNode.content.trim().replace(/^-\s*/, '').trim()
			const itemChildren = itemNode.children.filter(c => {
				const ct = c.content.trim()
				return ct !== '' && !ct.startsWith(this.COMMENT_START)
			})
			const hasItemChildren = itemChildren.length > 0
			let value
			if (!hasItemChildren) {
				value = this.parseValue(content)
			} else {
				if (content === this.MULTILINE_START) {
					const lines = itemChildren.map(c => c.content).filter(l => l.trim() !== '').join(this.NEW_LINE)
					value = lines
				} else if (content.endsWith(':')) {
					const key = content.slice(0, -1).trim()
					const sub = this.parseContainer(itemChildren, level + 1)
					value = { [key]: sub }
				} else {
					throw new Error(`Invalid array item with children at level ${level}: "${itemNode.content}"`)
				}
			}
			arr.push(value)
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
	 * Parses the NaN0 format into an object
	 * @throws {Error} If invalid format
	 * @param {string} input - Input in NaN0 format
	 * @returns {any} - Parsed JavaScript object
	 */
	static parse(input) {
		const parser = new Parser({ eol: this.NEW_LINE, tab: this.TAB })
		const root = parser.decode(input)
		if (root.children.length !== 1) {
			throw new Error(`Invalid NaN0 document: expected one top-level key, got ${root.children.length}`)
		}
		const topNode = root.children[0]
		const topContent = topNode.content.trim()
		if (!topContent.endsWith(':')) {
			throw new Error(`Invalid NaN0 document: top line must end with ':'`)
		}
		const topKey = topContent.slice(0, -1).trim()
		const topChildren = topNode.children.filter(c => {
			const ct = c.content.trim()
			return ct !== '' && !ct.startsWith(this.COMMENT_START)
		})
		const topValue = this.parseContainer(topChildren)
		return { [topKey]: topValue }
	}

	/**
	 * Stringifies any input object into .NaN0 format
	 * @throws {Error} If input is not a single-key object
	 * @param {Object} input - Input object with exactly one top-level key
	 * @returns {string} - NaN0 formatted string
	 */
	static stringify(input) {
		if (typeof input !== 'object' || input === null || Object.keys(input).length !== 1) {
			throw new Error('NaN0.stringify requires an object with exactly one top-level key')
		}
		const [[topKey, topValue]] = Object.entries(input)
		const rootNode = new Node({ content: '', indent: -1 })
		this.addValueToNode(rootNode, topValue, 0, topKey)
		const topFieldNode = rootNode.children[0]
		return topFieldNode.toString({ tab: this.TAB, eol: this.NEW_LINE })
	}
}

export default NaN0