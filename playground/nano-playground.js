#!/usr/bin/env node

import NANO from "../src/NANO.js"
import { next, pause } from "@nan0web/ui-cli"

export async function runNANOPlayground(console) {
	console.clear()
	console.success("NANO Format Playground")
	console.info("Demonstrating .nano format parsing and stringifying")

	// Example data
	const exampleData = {
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

	// Show original data
	console.info("\nOriginal data:")
	console.info(JSON.stringify(exampleData, null, 2))

	await pause(500)

	// Stringify with NANO
	console.info("\nStringified with NANO:")
	const nanoString = NANO.stringify(exampleData)
	console.info(nanoString)

	await pause(500)

	// Parse back with NANO
	console.info("\nParsed back with NANO:")
	const parsedData = NANO.parse(nanoString)
	console.info(JSON.stringify(parsedData, null, 2))

	await pause(500)

	// Test with arrays
	const arrayExample = ["Item 1", "Item 2", { nested: "object" }]
	console.info("\nArray example:")
	console.info("Original:", JSON.stringify(arrayExample))
	const arrayString = NANO.stringify(arrayExample)
	console.info("Stringified:", arrayString)
	const parsedArray = NANO.parse(arrayString)
	console.info("Parsed back:", JSON.stringify(parsedArray))

	console.success("\nNANO playground completed! 🧬")

	console.info("\n--- press any key ---")
	await next()
	console.clearLine(console.cursorUp())
}
