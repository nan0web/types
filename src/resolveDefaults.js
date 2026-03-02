/**
 * @file resolveDefaults — applies default values from static class metadata.
 *
 * Scans static properties of a class for `default` keys and applies them
 * to the target object (usually the instance being constructed).
 *
 * Pattern:
 *   class Config {
 *     static port = { default: 3000 }
 *   }
 *
 *   class MyConfig extends Config {
 *     constructor(input) {
 *       resolveDefaults(MyConfig, this)
 *       Object.assign(this, input)
 *     }
 *   }
 */

/**
 * Apply default values from static metadata fields to a target object.
 *
 * @param {Function} Class - The class constructor with static metadata.
 * @param {object} target - The object to apply defaults to (usually `this`).
 * @returns {object} - The target object with defaults applied.
 */
export default function resolveDefaults(Class, target) {
	for (const [key, meta] of Object.entries(Class)) {
		if (meta && typeof meta === 'object' && 'default' in meta) {
			// Apply default if the property is not already set or is undefined
			if (target[key] === undefined) {
				target[key] = meta.default
			}
		}
	}
	return target
}
