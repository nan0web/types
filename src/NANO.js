/* eslint-disable @typescript-eslint/no-explicit-any */
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
const exampleOfFormat = `
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
  object when have values:
    name as a one line string: One line, possible with "
    name as a one line with quotes: "Only double quotes are possible \" escaped quotes"
    string as a multiline: |
      only with the | char,
      no other symbols
    date as a one line value only: 2024-11-13
    datetime as one line value only: 2024-11-13T19:34:00+2
    short datetime: 2024-11-13T19:34:00
    number as integer: 160_000_500
    number as a float: 160_000_500.345
    negative number: -160_000_500.345
    boolean: true
    null: null`

class NANO {
	static NEW_LINE = "\n"
	static TAB = "  "
	static EMPTY_ARRAY = "[]"
	static EMPTY_OBJECT = "{}"
	static MULTILINE_START = "|"
	static VALUE_DELIMITER = [": ", ":\n"]
	static COMMENT_START = "# "

	/**
	 * Parses the NANO format into an object
	 * @throws {Error} If invalid format
	 * @param {string | Array} input - Input in NANO format
	 * @returns {any} - Parsed JavaScript object
	 */
	static parse(input) {
		const rows = String(input).split("\n")
		const stack = []
		let root = null

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i]
			if (!row || row.trim().startsWith(NANO.COMMENT_START)) continue

			const indentLevel = (row.length - row.trimLeft().length) / NANO.TAB.length
			const trimmedRow = row.trim()

			// Adjust stack to current indent level
			while (stack.length > indentLevel) {
				stack.pop()
			}

			if (trimmedRow.startsWith("- ")) {
				// Handle array items
				const value = trimmedRow.slice(2)
				if (stack.length === 0) {
					// Top level array item
					if (!root) {
						root = []
					}
					root.push(value)
					stack.push({ type: 'arrayItem', data: value, parent: root, index: root.length - 1 })
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'array') {
						parentContext.data.push(value)
						stack.push({ type: 'arrayItem', data: value, parent: parentContext.data, index: parentContext.data.length - 1 })
					} else if (parentContext.type === 'objectProperty') {
						if (Array.isArray(parentContext.parent)) {
							parentContext.parent[parentContext.index] = value
						} else {
							parentContext.parent[parentContext.key] = value
						}
						stack.push({ type: 'arrayItem', data: value, parent: parentContext.parent, key: parentContext.key, index: parentContext.index })
					}
				}
			} else if (trimmedRow === NANO.EMPTY_ARRAY) {
				const newArray = []
				if (stack.length === 0) {
					root = newArray
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'array') {
						// @ts-ignore
						parentContext.data.push(newArray)
					} else if (parentContext.type === 'objectProperty') {
						parentContext.parent[parentContext.key] = newArray
					}
				}
				stack.push({ type: 'array', data: newArray })
			} else if (trimmedRow === NANO.EMPTY_OBJECT) {
				const newObject = {}
				if (stack.length === 0) {
					root = newObject
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'array') {
						// @ts-ignore
						parentContext.data.push(newObject)
					} else if (parentContext.type === 'objectProperty') {
						parentContext.parent[parentContext.key] = newObject
					}
				}
				stack.push({ type: 'object', data: newObject })
			} else if (trimmedRow.includes(":")) {
				// Handle key-value pairs
				const delimiterIndex = trimmedRow.indexOf(":")
				const key = trimmedRow.slice(0, delimiterIndex).trim()
				let value = trimmedRow.slice(delimiterIndex + 1).trim()

				// Handle special cases like multiline strings
				if (value === NANO.MULTILINE_START) {
					const multilineLines = []
					let j = i + 1
					while (j < rows.length) {
						const nextRow = rows[j]
						if (!nextRow) {
							j++
							continue
						}
						const nextIndentLevel = (nextRow.length - nextRow.trimLeft().length) / NANO.TAB.length
						if (nextIndentLevel > indentLevel) {
							multilineLines.push(nextRow.slice((indentLevel + 1) * NANO.TAB.length))
							j++
						} else {
							break
						}
					}
					value = multilineLines.join(NANO.NEW_LINE)
					i = j - 1 // Skip processed multiline rows
				} else if (value === NANO.EMPTY_ARRAY) {
					// @ts-ignore
					value = []
				} else if (value === NANO.EMPTY_OBJECT) {
					// @ts-ignore
					value = {}
				} else if (value === 'true') {
					// @ts-ignore
					value = true
				} else if (value === 'false') {
					// @ts-ignore
					value = false
				} else if (value === 'null') {
					// @ts-ignore
					value = null
				} else if (!isNaN(Number(value.replace(/_/g, "")))) {
					// @ts-ignore
					value = Number(value.replace(/_/g, ""))
				}

				if (stack.length === 0) {
					// Top level object property
					if (!root) {
						root = {}
					}
					root[key] = value
					stack.push({ type: 'objectProperty', data: value, parent: root, key: key })
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'object') {
						parentContext.data[key] = value
						stack.push({ type: 'objectProperty', data: value, parent: parentContext.data, key: key })
					} else if (parentContext.type === 'array') {
						const obj = { [key]: value }
						parentContext.data.push(obj)
						stack.push({ type: 'object', data: obj })
						stack.push({ type: 'objectProperty', data: value, parent: obj, key: key })
					}
				}
			}
		}

		return root
	}

	/**
	 * Stringifies any input object into .nano format
	 * @param {*} input - Input object to stringify
	 * @returns {string} - NANO formatted string
	 */
	static stringify(input) {
		const lines = []

		const processValue = (value, indent = 0) => {
			if (Array.isArray(value)) {
				if (value.length === 0) {
					return NANO.EMPTY_ARRAY
				} else {
					return value.map(item => {
						const indentedItem = processValue(item, indent + 1)
						if (typeof item === 'object' && item !== null) {
							return NANO.TAB.repeat(indent) + "- " + indentedItem
						} else {
							return NANO.TAB.repeat(indent) + "- " + item
						}
					}).join(NANO.NEW_LINE)
				}
			} else if (typeof value === 'object' && value !== null) {
				const entries = Object.entries(value)
				if (entries.length === 0) {
					return NANO.EMPTY_OBJECT
				} else {
					return entries.map(([key, val]) => {
						const indentedValue = processValue(val, indent + 1)
						if (typeof val === 'object' && val !== null) {
							return NANO.TAB.repeat(indent) + key + ":" + NANO.NEW_LINE + indentedValue
						} else {
							return NANO.TAB.repeat(indent) + key + ": " + val
						}
					}).join(NANO.NEW_LINE)
				}
			} else {
				return String(value)
			}
		}

		if (Array.isArray(input)) {
			lines.push(NANO.EMPTY_ARRAY)
			input.forEach(item => {
				if (typeof item === 'object' && item !== null) {
					lines.push("- " + processValue(item, 0))
				} else {
					lines.push("- " + item)
				}
			})
		} else if (typeof input === 'object' && input !== null) {
			Object.entries(input).forEach(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					lines.push(key + ":" + NANO.NEW_LINE + processValue(value, 0))
				} else {
					lines.push(key + ": " + value)
				}
			})
		} else {
			lines.push(String(input))
		}

		return lines.join(NANO.NEW_LINE)
	}
}

export default NANO
