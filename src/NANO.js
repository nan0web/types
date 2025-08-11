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
	 * @param {string} input - Input in NANO format
	 * @returns {any} - Parsed JavaScript object
	 */
	static parse(input) {
		const rows = String(input).split(NANO.NEW_LINE)
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
				const parsedValue = NANO.parseValue(value)

				if (stack.length === 0) {
					// Top level array item
					if (!root) {
						root = []
					}
					root.push(parsedValue)
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'array') {
						parentContext.data.push(parsedValue)
					} else if (parentContext.type === 'objectProperty') {
						if (Array.isArray(parentContext.parent)) {
							parentContext.parent[parentContext.index] = parsedValue
						} else {
							parentContext.parent[parentContext.key] = parsedValue
						}
					}
				}

				// Push array item to stack only if it's an object or array
				if (typeof parsedValue === 'object' && parsedValue !== null) {
					stack.push({
						type: 'arrayItem',
						data: parsedValue,
						parent: stack.length === 0 ? root : stack[stack.length - 1].data,
						index: stack.length === 0 ? root.length - 1 : stack[stack.length - 1].data.length - 1
					})
				}
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
				}

				const parsedValue = value === '' ? {} : NANO.parseValue(value)

				if (stack.length === 0) {
					// Top level object property
					if (!root) {
						root = {}
					}
					root[key] = parsedValue
					if (typeof parsedValue === 'object' && parsedValue !== null) {
						stack.push({ type: 'objectProperty', data: parsedValue, parent: root, key: key })
					}
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'object') {
						parentContext.data[key] = parsedValue
						if (typeof parsedValue === 'object' && parsedValue !== null) {
							stack.push({ type: 'objectProperty', data: parsedValue, parent: parentContext.data, key: key })
						}
					} else if (parentContext.type === 'array') {
						const obj = { [key]: parsedValue }
						parentContext.data.push(obj)
						stack.push({ type: 'array', data: parentContext.data })
						stack.push({ type: 'object', data: obj })
						if (typeof parsedValue === 'object' && parsedValue !== null) {
							stack.push({ type: 'objectProperty', data: parsedValue, parent: obj, key: key })
						}
					} else if (parentContext.type === 'arrayItem') {
						// Handle nested objects in arrays
						parentContext.parent[parentContext.index][key] = parsedValue
						if (typeof parsedValue === 'object' && parsedValue !== null) {
							stack.push({ type: 'objectProperty', data: parsedValue, parent: parentContext.parent[parentContext.index], key: key })
						}
					}
				}
			} else if (trimmedRow === NANO.EMPTY_ARRAY) {
				const newArray = []
				if (stack.length === 0) {
					root = newArray
				} else {
					const parentContext = stack[stack.length - 1]
					if (parentContext.type === 'array') {
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
						parentContext.data.push(newObject)
					} else if (parentContext.type === 'objectProperty') {
						parentContext.parent[parentContext.key] = newObject
					}
				}
				stack.push({ type: 'object', data: newObject })
			} else if (trimmedRow !== '') {
				// Handle scalar values at root level
				if (stack.length === 0) {
					root = NANO.parseValue(trimmedRow)
				}
			}
		}

		return root
	}

	/**
	 * Parse a value according to NANO format rules
	 * @param {string} value - Value to parse
	 * @returns {any} - Parsed value
	 */
	static parseValue(value) {
		if (value === 'true') return true
		if (value === 'false') return false
		if (value === 'null') return null
		if (!isNaN(Number(value.replace(/_/g, "")))) return Number(value.replace(/_/g, ""))
		return value
	}

	/**
	 * Stringifies any input object into .nano format
	 * @param {*} input - Input object to stringify
	 * @param {number} indentLevel - Current indentation level
	 * @returns {string} - NANO formatted string
	 */
	static stringify(input, indentLevel = 0) {
		if (Array.isArray(input)) {
			if (input.length === 0) {
				return NANO.TAB.repeat(indentLevel) + NANO.EMPTY_ARRAY
			} else {
				const lines = [NANO.TAB.repeat(indentLevel) + NANO.EMPTY_ARRAY]
				for (const item of input) {
					if (typeof item === 'object' && item !== null) {
						// Handle objects in arrays
						const objLines = []
						for (const [key, value] of Object.entries(item)) {
							const indentedValue = NANO.stringify(value, indentLevel + 2)
							if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
								objLines.push(NANO.TAB.repeat(indentLevel + 1) + "- " + key + ":")
								objLines.push(indentedValue)
							} else {
								objLines.push(NANO.TAB.repeat(indentLevel + 1) + "- " + key + ": " + NANO.formatValue(value))
							}
						}
						lines.push(...objLines)
					} else {
						// Handle scalar values in arrays
						lines.push(NANO.TAB.repeat(indentLevel + 1) + "- " + NANO.formatValue(item))
					}
				}
				return lines.join(NANO.NEW_LINE)
			}
		} else if (typeof input === 'object' && input !== null) {
			if (Object.keys(input).length === 0) {
				return NANO.TAB.repeat(indentLevel) + NANO.EMPTY_OBJECT
			} else {
				const lines = []
				for (const [key, value] of Object.entries(input)) {
					const indentedValue = NANO.stringify(value, indentLevel + 1)
					if (typeof value === 'object' && value !== null) {
						if (Array.isArray(value)) {
							if (value.length === 0) {
								lines.push(NANO.TAB.repeat(indentLevel) + key + ": " + NANO.EMPTY_ARRAY)
							} else {
								lines.push(NANO.TAB.repeat(indentLevel) + key + ":")
								lines.push(indentedValue)
							}
						} else {
							lines.push(NANO.TAB.repeat(indentLevel) + key + ":")
							lines.push(indentedValue)
						}
					} else {
						lines.push(NANO.TAB.repeat(indentLevel) + key + ": " + NANO.formatValue(value))
					}
				}
				return lines.join(NANO.NEW_LINE)
			}
		} else {
			return NANO.TAB.repeat(indentLevel) + NANO.formatValue(input)
		}
	}

	/**
	 * Formats a single value into appropriate NANO format
	 * @param {*} value - Value to format
	 * @returns {string} - NANO formatted string
	 */
	static formatValue(value) {
		if (value === null) return 'null'
		if (value === true) return 'true'
		if (value === false) return 'false'
		if (Array.isArray(value)) {
			if (value.length === 0) {
				return NANO.EMPTY_ARRAY
			} else {
				return NANO.stringify(value)
			}
		} else if (typeof value === 'object' && value !== null) {
			return NANO.stringify(value)
		} else if (typeof value === 'number') {
			// Format numbers with thousand separators
			return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "_")
		} else if (typeof value === 'string' && value.includes('\n')) {
			// Handle multiline strings
			const lines = [NANO.MULTILINE_START]
			const valueLines = value.split('\n')
			for (const line of valueLines) {
				lines.push(NANO.TAB + line)
			}
			return lines.join(NANO.NEW_LINE)
		} else {
			return String(value)
		}
	}
}

export default NANO
