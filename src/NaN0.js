import NANO from './NANO.js'

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
    datetime as one line value only: 2024-11-13T19:34:00+2
    short datetime: 2024-11-13T19:34:00
    number as integer: 160_000_500
    number as a float: 160_000_500.345
    negative number: -160_000_500.345
    boolean: true
    null: null`

class NaN0 {
	static NEW_LINE = "\n"
	static TAB = "  "
	static EMPTY_ARRAY = "[]"
	static EMPTY_DATE = "0000-00-00"
	static EMPTY_OBJECT = "{}"
	static MULTILINE_START = "|"
	static VALUE_DELIMITER = [": ", ":\n"]
	static COMMENT_START = "# "

	/**
	 * Parses the NaN0 format into an object
	 * @throws {Error} If invalid format
	 * @param {string} input - Input in NaN0 format
	 * @returns {any} - Parsed JavaScript object
	 */
	static parse(input) {
		return NANO.parse(input)
	}

	/**
	 * Stringifies any input object into .NaN0 format
	 * @param {*} input - Input object to stringify
	 * @returns {string} - NaN0 formatted string
	 */
	static stringify0(input) {
		return NANO.stringify(input)
	}

	/**
 * Stringifies any input object into .NaN0 format
 * @param {*} input - Input object to stringify
 * @param {number} indentLevel - Current indentation level
 * @returns {string} - NaN0 formatted string
 */
	static stringify(input, indentLevel = 0) {
		if (Array.isArray(input)) {
			if (input.length === 0) {
				return NaN0.TAB.repeat(indentLevel) + NaN0.EMPTY_ARRAY
			} else {
				const lines = [NaN0.TAB.repeat(indentLevel) + NaN0.EMPTY_ARRAY]
				for (const item of input) {
					const itemStr = NaN0.stringify(item, indentLevel + 1)
					lines.push(itemStr)
				}
				return lines.join(NaN0.NEW_LINE)
			}
		} else if (typeof input === 'object' && input !== null) {
			if (Object.keys(input).length === 0) {
				return NaN0.TAB.repeat(indentLevel) + NaN0.EMPTY_OBJECT
			} else {
				const lines = [NaN0.TAB.repeat(indentLevel) + NaN0.EMPTY_OBJECT]
				for (const [key, value] of Object.entries(input)) {
					const valueStr = NaN0.stringify(value, indentLevel + 1)
					lines.push(NaN0.TAB.repeat(indentLevel + 1) + key + ": " + valueStr)
				}
				return lines.join(NaN0.NEW_LINE)
			}
		} else {
			return NaN0.TAB.repeat(indentLevel) + NaN0.formatValue(input)
		}
	}

	static formatValue(input) {
		return input
	}
}

export default NaN0
