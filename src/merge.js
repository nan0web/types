import clone from './clone.js'

/**
 * Merges two objects deeply.
 * Control options inside the object:
 *  - $clear - clear the target on the save level
 * @param {Object} target - The target object to merge into.
 * @param {Object} source - The source object to merge from.
 * @param {Object} [options] - Options for merging.
 * @param {boolean} [options.unique=true] - Whether to merge arrays uniquely, this way
 *                  objects are simplified throught the JSON.stringify > JSON.parse.
 * @returns {Object} - The deeply merged object in the form of target, so if the
 *                     target is object returns object, if target is array returns array.
 */
function merge(target, source, { unique = true, deep = true } = {}) {
	if (typeof target !== 'object' || target === null) {
		return source
	}
	if (typeof source !== 'object' || source === null) {
		return target
	}

	let output
	let src = clone(source)
	if (Array.isArray(source)) {
		output = src[0]?.$clear ? [] : clone(target)
		if (src[0]?.$clear) {
			if (1 === Object.keys(src[0]).length) {
				src.shift()
			} else {
				delete src[0].$clear
			}
		}
	} else if ('object' === typeof src && null !== src && src?.$clear) {
		output = {}
		if (1 === Object.keys(src).length) {
			src = {}
		} else {
			delete src.$clear
		}
	} else {
		output = clone(target)
	}


	for (const key in src) {
		if (src?.constructor?.hasOwn && !src.constructor.hasOwn(src, key)) {
			continue
		}
		if (!Object.hasOwn(src, key)) {
			continue
		}
		if (Array.isArray(src[key]) && Array.isArray(output[key])) {
			if (src[key]?.[0]?.$clear) {
				if (1 === Object.keys(src[key][0]).length) {
					src[key].shift()
				} else {
					delete src[key][0].$clear
				}
				output[key] = src[key]
				continue
			}
			if (unique) {
				const mergedArray = [...output[key], ...src[key]].map(item => {
					if (typeof item === 'object' && item !== null) {
						return JSON.stringify(item)
					}
					return item
				})
				// Convert complex objects in the arrays to strings
				// before adding them to the Set to ensure uniqueness.
				output[key] = [...new Set(mergedArray)].map(item => {
					try {
						return JSON.parse(item)
					} catch {
						return item
					}
				})
			} else {
				output[key] = [...output[key], ...src[key]]
			}
		} else if (typeof src[key] === 'object' && src[key] !== null) {
			output[key] = merge(output[key], src[key])
		} else {
			output[key] = src[key]
		}
	}

	return output
}

export default merge
