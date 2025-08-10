import { notEmpty } from "../index.js"

/**
 * Base class providing a `toObject` method that omits empty values.
 *
 * @class NonEmptyObject
 */
class NonEmptyObject {
	/**
	 * Convert instance properties to a plain object, skipping empty values.
	 *
	 * @returns {Object} Plain object representation
	 */
	toObject() {
		const result = {}
		for (const key in this) {
			const value = this[key]
			if (notEmpty(value)) {
				// @ts-ignore
				result[key] = value?.toObject?.() ?? value
			}
		}
		return result
	}
}

export default NonEmptyObject
