/**
 * @file validateAll — universal validation for Model-as-Schema classes.
 *
 * Scans static properties of a class for `validate` functions and applies them
 * to the target object. Collects all errors and throws them joined by a divider
 * if any validations fail.
 *
 * Pattern:
 *   class Config {
 *     static port = { validate: (val) => val > 0 || 'Port must be positive' }
 *   }
 *
 *   class MyConfig extends Config {
 *     constructor(input) {
 *       Object.assign(this, input)
 *       validateAll(MyConfig, this)
 *     }
 *   }
 */

import ModelError from './ModelError.js'

/**
 * Validate values of a target object against static metadata rules.
 *
 * @param {Function} Class - The class constructor with static metadata fields.
 * @param {object} target - The object whose properties should be validated.
 * @returns {boolean} - Returns true if validation passes.
 * @throws {ModelError} - Throws a ModelError with all validation failures.
 */
export default function validateAll(Class, target) {
	const fields = {}

	for (const [key, meta] of Object.entries(Class)) {
		if (meta && typeof meta === 'object' && typeof meta.validate === 'function') {
			const result = meta.validate(target[key])

			if (result === false) {
				fields[key] = `Validation failed for property '${key}'`
			} else if (typeof result === 'string' && result.length > 0) {
				fields[key] = result
			}
		}
	}

	if (Object.keys(fields).length > 0) {
		throw new ModelError(fields)
	}

	return true
}
