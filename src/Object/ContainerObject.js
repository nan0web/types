/**
 * Represents a generic hierarchical container.
 *
 * @class ContainerObject
 */
class ContainerObject {
	/** @type {Array} */
	children
	/** @type {number} */
	level

	/**
	 * @param {object} props
	 * @param {Array} [props.children=[]]
	 * @param {number} [props.level=0]
	 */
	constructor(props = {}) {
		const {
			children = [],
			level = 0
		} = props
		this.children = children
		this.level = level
	}

	/**
	 * Returns the most recent (deepest) container.
	 *
	 * @returns {ContainerObject}
	 */
	get recent() {
		const arr = this.flat()
		if (1 === arr.length) return this
		return arr[arr.length - 1].recent
	}

	/**
	 * Adds element to the container.
	 * @param {*} element
	 * @returns {this}
	 */
	add(element) {
		this.children.push(element)
		return this
	}

	/**
	 * Removes the element from the container.
	 * @param {*} element
	 * @returns {this}
	 */
	remove(element) {
		this.children = this.children.filter(e => e !== element)
		return this
	}

	clear() {
		this.children = []
		return this
	}

	/**
	 * Finds an element by filter.
	 *
	 * @param {(v:any)=>boolean} filter
	 * @param {boolean} [recursively=false]
	 * @returns {*}
	 */
	find(filter = () => true, recursively = false) {
		const elements = this.children
		if (recursively) {
			for (const element of elements) {
				if (element instanceof ContainerObject) {
					const found = element.find(filter, true)
					if (found) {
						return found
					}
				}
			}
		}
		return elements.find(filter)
	}

	/**
	 * Flattens the tree into an array.
	 *
	 * @returns {ContainerObject[]}
	 */
	flat() {
		const result = [this]
		const elements = this.children
		for (const element of elements) {
			if (element instanceof ContainerObject) {
				// @ts-ignore
				result.push(...element.flat())
			}
		}
		return result
	}

	toArray() {
		return this.flat()
	}

	/**
	 * Filters children.
	 *
	 * @param {(v:any)=>boolean} [filter=()=>true]
	 * @param {boolean} [recursively=false]
	 * @returns {Array}
	 */
	filter(filter = () => true, recursively = false) {
		if (recursively) {
			return this.flat().filter(filter)
		}
		return this.children.filter(filter)
	}

	/**
	 * Maps over children.
	 *
	 * @param {Function} callback
	 * @param {boolean} [recursively=false]
	 * @returns {Array}
	 */
	map(callback, recursively = false) {
		if (recursively) {
			// @ts-ignore
			return this.flat().map(callback)
		}
			// @ts-ignore
		return this.children.map(callback)
	}

	/**
	 * Factory method that returns an existing instance or creates a new one.
	 *
	 * @param {object|ContainerObject} [props={}]
	 * @returns {ContainerObject}
	 */
	static from(props) {
		if (props instanceof ContainerObject) return props
		return new this(props)
	}
}

export default ContainerObject
