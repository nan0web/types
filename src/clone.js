/**
 * Creates a deep clone of an object, array, or complex structure, handling circular references and custom classes.
 * @param {any} obj - The object, array, or structure to clone.
 * @param {WeakMap} [seen=new WeakMap()] - Tracks already cloned objects to handle circular references.
 * @returns {any} - The deep clone of the input object or structure.
 */
function clone(obj, seen = new WeakMap()) {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	// Handle circular references
	if (seen.has(obj)) {
		return seen.get(obj)
	}

	let cloned
	if (Array.isArray(obj)) {
		// Handle arrays
		cloned = []
		seen.set(obj, cloned)
		obj.forEach(item => cloned.push(clone(item, seen)))
		Object.keys(obj).forEach(key => {
			if (!isNaN(key)) return // Skip numeric indices
			cloned[key] = clone(obj[key], seen)
		})
	} else if (typeof obj.clone === 'function') {
		// Handle objects with .clone() method
		cloned = obj.clone()
	} else if (obj.constructor && obj.constructor !== Object) {
		// Handle custom classes
		cloned = new obj.constructor();
		seen.set(obj, cloned);
		Object.keys(obj).forEach(key => cloned[key] = clone(obj[key], seen));
	} else {
		// Handle plain objects
		cloned = {}
		seen.set(obj, cloned)
		Object.keys(obj).forEach(key => cloned[key] = clone(obj[key], seen))
	}

	return cloned
}

export default clone
