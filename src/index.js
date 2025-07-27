/**
 * Checks if a value is strictly one of the provided arguments.
 * @param {...any} args - Accepted values.
 * @returns {(value: any) => any|undefined}
 */
export function oneOf(...args) {
	return (value) => (args.includes(value) ? value : undefined)
}

/**
 * Applies a function if the value is not undefined.
 * @param {(value: any) => any} Fn - Function to apply.
 * @returns {(value: any) => any|undefined}
 */
export function undefinedOr(Fn) {
	return (value) => (undefined === value ? undefined : Fn(value))
}

/**
 * Applies a function if the value is not undefined, returns null otherwise.
 * @param {(value: any) => any} Fn - Function to apply.
 * @returns {(value: any) => any|null}
 */
export function nullOr(Fn) {
	return (value) => (undefined === value ? null : Fn(value))
}

/**
 * Applies a function (or .from) to all elements of the array.
 * @param {Function|{from: Function}} Fn - Function to apply or object with .from.
 * @returns {(value: any[]) => any[]}
 */
export function arrayOf(Fn) {
	return (values = []) => values.map(value => Fn?.from?.(value) ?? Fn(value))
}

/**
 * Checks if value is of the given type.
 * Handles primitives like String, Number, Boolean.
 * @param {Function} Fn - Type constructor.
 * @returns {(value: any) => boolean}
 */
export function typeOf(Fn) {
	return (value) => {
		if (Fn === String) return typeof value === "string" || value instanceof String
		if (Fn === Number) return typeof value === "number" || value instanceof Number
		if (Fn === Boolean) return typeof value === "boolean" || value instanceof Boolean
		if (Fn === Function) return typeof value === "function"
		if (Fn === Object) return typeof value === "object" && value !== null
		return value instanceof Fn
	}
}

/**
 * Attempts to return the constructor for a given value.
 * @param {any} value - Input value.
 * @returns {Function|undefined}
 */
export function functionOf(value) {
	if ("boolean" === typeof value) return Boolean
	if ("number" === typeof value) return Number
	if ("string" === typeof value) return String
	if (Array.isArray(value)) return (...args) => new Array(...args)
	if (value?.constructor) return (...args) => new value.constructor(...args)
	return undefined
}

export function empty(...values) {
	for (const value of values) {
		if ([undefined, null, "", {}].includes(value)) {
			return true
		}
		if (Array.isArray(value) && !value.length) {
			return true
		}
		if ("object" === typeof value) {
			if (typeof value.empty === "function") {
				const e = value.empty()
				if (e) {
					return true
				}
			}
			if (value.empty) return true

			let e = true
			for (const _ in value) {
				e = false
			}
			if (e) {
				return true
			}
		}
	}
	return false
}

export function notEmpty(value) {
	return !empty(value)
}

export function firstOf(Fn) {
	return (...args) => {
		for (const arg of args) {
			const x = Fn(arg)
			if (notEmpty(x)) {
				return x
			}
		}
	}
}

export function equal(...args) {
	if (0 === args.length || args.length % 2 === 1) {
		throw new TypeError([
			"Only paird arguments are allowed",
			"equal(x, true, y, false, z, 0) => x === true && y === false && z === 0"
		].join("\n"))
	}
	for (let i = 0; i < args.length - 1; i += 2) {
		const [actual, expected] = args.slice(i, i + 2)
		if (Array.isArray(actual) && Array.isArray(expected)) {
			if (actual.length !== expected.length) return false
			for (let j = 0; j < actual.length; j++) {
				if (Array.isArray(actual[j]) && Array.isArray(expected[j]) ||
					"object" === typeof actual[j] && "object" === typeof expected[j]) {
					if (!equal(actual[j], expected[j])) return false
				}
				else if (actual[j] !== expected[j]) return false
			}
		}
		else if ("object" === typeof actual && "object" === typeof expected) {
			if (null === actual || null === expected) return actual === expected
			if (Object.keys(actual).length !== Object.keys(expected).length) return false
			for (const key in actual) {
				if (Array.isArray(actual[key]) && Array.isArray(expected[key]) ||
					"object" === typeof actual[key] && "object" === typeof expected[key]) {
					if (!equal(actual[key], expected[key])) return false
				}
				else if (actual[key] !== expected[key]) return false
			}
		}
		else if (actual !== expected) return false
	}
	return true
}

/**
 * Converts a value to the given type.
 * Nested for objects, arrays, maps, sets, etc.
 * @param {Function|Object} type - Type constructor or instance.
 * @returns {(value: any) => any}
 */
export function to(type) {
	function convert(val, typ) {
		if ([null, undefined].includes(val)) return val

		if (UndefinedObject === typ) {
			if (typeof val !== "object" || val === null) return val
			const result = {}
			for (const [k, v] of Object.entries(val)) {
				result[k] = convert(v, typ)
			}
			return result
		}

		if (Object === typ || ("object" === typeof typ && typ !== null)) {
			if (typeof val.toObject === "function") {
				return val.toObject()
			}
			if (typeof val !== "object" || val === null) return val
			if (Array.isArray(val)) {
				return val.map((item) => convert(item, typ))
			}
			if ("function" === typeof val.entries) {
				return Object.fromEntries(
					val.entries().map(([k, v]) => [k, convert(v, typ)])
				)
			}
			const result = {}
			for (const [k, v] of Object.entries(val)) {
				if (v !== undefined) {
					result[k] = convert(v, typ)
				}
			}
			return result
		}

		if (NonEmptyObject === typ || typ instanceof NonEmptyObject) {
			if (typeof val !== "object" || val === null) return notEmpty(val) ? val : undefined
			if (Array.isArray(val)) {
				return val.map(v => to(NonEmptyObject)(v))
			}
			const result = {}
			for (const [k, v] of Object.entries(val)) {
				if (notEmpty(v)) {
					result[k] = to(NonEmptyObject)(v)
				}
			}
			return result
		}

		if (FullObject === typ) {
			if (typeof val.toObject === "function") {
				return val.toObject()
			}
			if (typeof val !== "object" || val === null) return val
			const obj = Object.fromEntries(
				Object.entries(val).map(([k, v]) => [k, convert(v, typ)])
			)
			const proto = Object.getPrototypeOf(val)
			if (proto) {
				const descriptors = Object.getOwnPropertyDescriptors(proto)
				for (const [key, desc] of Object.entries(descriptors)) {
					if (typeof desc.get === 'function') {
						try {
							obj[key] = convert(val[key], typ)
						} catch (e) {
							obj[key] = `[Getter error: ${e.message}]`
						}
					}
				}
			}
			return obj
		}

		if (Array === typ || Array.isArray(typ) /** and map-like */) {
			if (typeof val.toArray === "function") {
				return val.toArray()
			}
			if (Array.isArray(val)) {
				return val.map((item) => convert(item, typ))
			}
			/**
			 * @todo convert to object Map-like arrays
			 */
		}

		if (Map === typ || typ instanceof Map) {
			if (val instanceof Map) {
				return new Map(
					Array.from(val.entries()).map(([k, v]) => [k, convert(v, typ)])
				)
			}
			/**
			 * @todo convert to object Map
			 */
		}

		if (val instanceof Set) {
			return new Set(Array.from(val).map((item) => convert(item, typ)));
		}

		if (Number === typ) {
			if (typeof val === "number") return val
			if ("function" === typeof val.toNumber) return val.toNumber()
			return Number(val)
		}

		return val;
	}

	return (value) => convert(value, type);
}

/**
 * Checks if any of the arguments match the test.
 * @param {string|RegExp} test
 * @param {Object} options
 * @param {boolean} [options.caseInsensitive=false]
 * @param {string} [options.stringFn=""]
 * @param {"some"|"every"} [options.method="some"]
 * @returns {(...args: string[]) => boolean}
 */
export function match(test, options = {}) {
	const {
		caseInsensitive = false,
		stringFn = "",
		method = "some",
	} = options

	let matcher
	if (test instanceof RegExp) {
		// If test is a RegExp, adjust flags if needed
		let regex = test
		if (caseInsensitive && !test.flags.includes('i')) {
			const flags = test.flags + 'i'
			regex = new RegExp(test.source, flags)
		}
		matcher = (value) => regex.test(value)
	} else {
		// test is a string
		matcher = (value) => {
			if (typeof value !== "string" || typeof test !== "string") return false
			const v = caseInsensitive ? value.toLowerCase() : value
			const t = caseInsensitive ? test.toLowerCase() : test
			return stringFn ? v[stringFn](t) : v === t
		}
	}

	return (...args) => {
		for (const arg of args) {
			if (matcher(arg)) {
				if ("some" === method) {
					return true
				}
			} else {
				if ("every" === method) {
					return false
				}
			}
		}
		return "some" === method ? false : true
	}
}

import FullObject from "./Object/FullObject.js"
import ObjectWithAlias from "./Object/ObjectWithAlias.js"
import UndefinedObject from "./Object/UndefinedObject.js"
import ContainerObject from "./Object/ContainerObject.js"
import NonEmptyObject from "./Object/NonEmptyObject.js"

export { FullObject, UndefinedObject, ObjectWithAlias, ContainerObject, NonEmptyObject }
