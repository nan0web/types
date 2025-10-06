import NANO from './NANO.js'
import { describe, it } from 'node:test'
import assert from 'node:assert'

describe.skip('NANO parse and stringify', () => {
	it('Should parse empty array', () => {
		const input = NANO.EMPTY_ARRAY
		const result = NANO.parse(input)
		assert.deepEqual(result, [])
	})

	it('Should parse empty object', () => {
		const input = NANO.EMPTY_OBJECT
		const result = NANO.parse(input)
		assert.deepEqual(result, {})
	})

	it('Should parse simple object', () => {
		const input = `name: John
age: 30`
		const result = NANO.parse(input)
		assert.deepEqual(result, { name: 'John', age: 30 })
	})

	it('Should parse array', () => {
		const input = `- Item 1
- Item 2`
		const result = NANO.parse(input)
		assert.deepEqual(result, ['Item 1', 'Item 2'])
	})

	it('Should stringify array', () => {
		const input = ['Item 1', 'Item 2']
		const output = NANO.stringify(input)
		assert.strictEqual(output, `- Item 1
- Item 2`)
	})

	it('Should stringify object', () => {
		const input = { name: 'John', age: 30 }
		const output = NANO.stringify(input)
		const expected = `name: John
age: 30`
		assert.strictEqual(output, expected)
	})

	it("should parse a document", () => {
		const text = `- href: //nan0.dev/
  title: NaN0 for developers
  desc: Join our community and develop new world with us`
		const expected = [
			{ href: "//nan0.dev/", title: "NaN0 for developers", desc: "Join our community and develop new world with us" }
		]
		const result = NANO.parse(text)
		assert.deepEqual(result, expected)
	})

	it("should parse a larger document", () => {
		const text = `document:
  array when empty: []
  array when have values: []
    - name: Some values
    - 160_000_500.345
    - |
      multiple line
      string
      only with the | no other symbols are available
  object when empty: {}
  object when have values:
    name as a one line string: One line, possible with "
    name as a one line with quotes: "Only double quotes are possible \\" escaped quotes"
    string as a multiline: |
      only with the | char,
      no other symbols
    numeric value: 160_000_500
    float value: 160_000_500.345
    negative number: -160_000_500.345
    boolean true: true
    boolean false: false
    null value: null`

		const expected = {
			document: {
				"array when empty": [],
				"array when have values": [
					{
						name: "Some values"
					},
					160000500.345,
					"multiple line\nstring\nonly with the | no other symbols are available"
				],
				"object when empty": {},
				"object when have values": {
					"name as a one line string": 'One line, possible with "',
					"name as a one line with quotes": '"Only double quotes are possible " escaped quotes"',
					"string as a multiline": "only with the | char,\nno other symbols",
					"numeric value": 160000500,
					"float value": 160000500.345,
					"negative number": -160000500.345,
					"boolean true": true,
					"boolean false": false,
					"null value": null
				}
			}
		}

		const result = NANO.parse(text)
		assert.deepEqual(result, expected)
	})

	it('Should stringify complex object', () => {
		const input = {
			document: {
				"array when empty": [],
				"array when have values": [
					{
						name: "Some values"
					},
					160000500.345,
					"multiple line\nstring\nonly with the | no other symbols are available"
				],
				"object when empty": {},
				"object when have values": {
					"name as a one line string": 'One line, possible with "',
					"name as a one line with quotes": '"Only double quotes are possible " escaped quotes"',
					"string as a multiline": "only with the | char,\nno other symbols",
					"numeric value": 160000500,
					"float value": 160000500.345,
					"negative number": -160000500.345,
					"boolean true": true,
					"boolean false": false,
					"null value": null
				}
			}
		}

		const expected = `document:
  array when empty: []
  array when have values:
    - name: Some values
    - 160000500.345
    - |
      multiple line
      string
      only with the | no other symbols are available
  object when empty: {}
  object when have values:
    name as a one line string: One line, possible with "
    name as a one line with quotes: "Only double quotes are possible \\" escaped quotes"
    string as a multiline: |
      only with the | char,
      no other symbols
    numeric value: 160000500
    float value: 160000500.345
    negative number: -160000500.345
    boolean true: true
    boolean false: false
    null value: null`

		const result = NANO.stringify(input)
		assert.strictEqual(result, expected)
	})
})
