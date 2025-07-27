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
	 * @param {string | ByteArray} input - Input in NANO format
	 * @returns {any} - Parsed JavaScript object
	 */
	static parse(input) {
		const rows = String(input).split("\n")
		const result = []
		const contextStack = [] // Stack to track nested contexts
		let currentIndent = 0

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i].trim()
			if (!row || row.startsWith(NANO.COMMENT_START)) continue

			const indentLevel = (rows[i].length - row.length) / NANO.TAB.length
			const isItem = row.startsWith("- ")

			// Handle indentation changes
			if (indentLevel < currentIndent) {
				// Pop contexts when going back to parent level
				currentIndent = indentLevel
				while (contextStack.length > indentLevel) {
					contextStack.pop()
				}
			}

			if (isItem) {
				const value = row.slice(2).trim()
				if (contextStack.length > 0 && contextStack[contextStack.length - 1].type === "array") {
					contextStack[contextStack.length - 1].data.push(value)
				} else {
					// Start a new array context if not already in one
					const newArray = { type: "array", data: [value] }
					contextStack.push(newArray)
					currentIndent = indentLevel
					result.push(newArray.data)
				}
			} else if (row === NANO.EMPTY_ARRAY) {
				const newArray = { type: "array", data: [] }
				contextStack.push(newArray)
				currentIndent = indentLevel
				result.push(newArray.data)
			} else if (row === NANO.EMPTY_OBJECT) {
				const newObject = { type: "object", data: {} }
				contextStack.push(newObject)
				currentIndent = indentLevel
				result.push(newObject.data)
			} else if (row.includes(":")) {
				const [key, value] = row.split(/:\s*/, 2)
				if (contextStack.length > 0 && contextStack[contextStack.length - 1].type === "object") {
					contextStack[contextStack.length - 1].data[key] = value
				} else {
					// Start a new object context if not already in one
					const newObject = { type: "object", data: { [key]: value } }
					contextStack.push(newObject)
					currentIndent = indentLevel
					result.push(newObject.data)
				}
			}
		}

		return result.length > 1 ? result : result[0]
	}

	/**
	 * Stringifies any input object into .nano format
	 * @param {*} input - Input object to stringify
	 * @returns {string} - NANO formatted string
	 */
	static stringify(input) {
		const lines = []
		const recurse = (value, indent = 0) => {
			if (Array.isArray(value)) {
				lines.push(NANO.EMPTY_ARRAY)
				value.forEach(item => {
					lines.push(NANO.TAB.repeat(indent) + "- " + item)
				})
			} else if (typeof value === "object" && value !== null) {
				lines.push(NANO.EMPTY_OBJECT)
				Object.entries(value).forEach(([key, val]) => {
					lines.push(NANO.TAB.repeat(indent) + `${key}: ${val}`)
				})
			} else {
				lines.push(value)
			}
		}

		recurse(input)
		return lines.join(NANO.NEW_LINE)
	}
}

export default NANO;