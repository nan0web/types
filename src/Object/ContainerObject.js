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
	 * Returns the latest of latest.
	 * So for:
	 * a
	 * |- d
	 * |- e
	 * b
	 * Must return b
	 * For
	 * a
	 * |- d
	 * |- e
	 *    |- f
	 * Must return f
	 */
	get recent() {
		const arr = this.flat()
		if (1 === arr.length) return this
		return arr[arr.length - 1].recent
	}

	add(element) {
		this.children.push(element)
		return this
	}

	remove(element) {
		this.children = this.children.filter(e => e !== element)
		return this
	}

	clear() {
		this.children = []
		return this
	}

	find(filter = v => 1, recursively = false) {
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

	flat() {
		const result = [
			this
		]
		const elements = this.children
		for (const element of elements) {
			if (element instanceof ContainerObject) {
				result.push(...element.flat())
			}
		}
		return result
	}

	toArray() {
		return this.flat()
	}

	filter(filter = () => 1, recursively = false) {
		if (recursively) {
			return this.flat().filter(filter)
		}
		return this.children.filter(filter)
	}

	map(callback, recursively = false) {
		if (recursively) {
			return this.flat().map(callback)
		}
		return this.children.map(callback)
	}

	static from(props) {
		if (props instanceof ContainerObject) return props
		return new this(props)
	}
}

export default ContainerObject
