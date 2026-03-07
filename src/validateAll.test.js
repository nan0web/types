import test from 'node:test'
import * as assert from 'node:assert/strict'
import validateAll from './validateAll.js'
import ModelError from './ModelError.js'

test('validateAll should pass when all validations return true', () => {
	class Model {
		static name = { validate: (val) => val !== undefined }
		static age = { validate: (val) => val >= 18 }
	}

	const obj = { name: 'Test', age: 20 }

	// Should not throw
	const result = validateAll(Model, obj)
	assert.equal(result, true)
})

test('validateAll should throw a ModelError containing validation strings', () => {
	class Model {
		static name = { validate: (val) => (val ? true : 'Name is required') }
		static age = { validate: (val) => (val >= 18 ? true : 'Must be 18 or older') }
	}

	const obj = { age: 10 }

	let caughtError = null
	try {
		validateAll(Model, obj)
	} catch (err) {
		caughtError = err
	}

	assert.ok(caughtError instanceof ModelError)
	assert.equal(caughtError.fields.name, 'Name is required')
	assert.equal(caughtError.fields.age, 'Must be 18 or older')
	assert.equal(caughtError.message.includes('\n---\n'), true)
})

test('validateAll should handle false return value as generic error', () => {
	class Model {
		static token = { validate: (val) => val === 'MAGIC' }
	}

	const obj = { token: 'WRONG' }

	let caughtError = null
	try {
		validateAll(Model, obj)
	} catch (err) {
		caughtError = err
	}

	assert.ok(caughtError instanceof ModelError)
	assert.equal(caughtError.fields.token, "Validation failed for property 'token'")
})
