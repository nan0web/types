/**
 * Class that supports property aliasing via static ALIAS map.
 * This is just a template that you can use for extension of your classes.
 * If you extend this class you need to overwrite `static from` anyway.
 *
 * @class ObjectWithAlias
 */
class ObjectWithAlias {
	static ALIAS = {}

	constructor(input = {}) {}

	/**
	 * Factory method that maps aliased keys to their target names.
	 *
	 * @param {object} [props={}] - Source properties
	 * @returns {ObjectWithAlias} Instance with aliases resolved
	 */
	static from(props = {}) {
		if (props instanceof ObjectWithAlias) return props
		for (const [key, value] of Object.entries(this.ALIAS)) {
			if (undefined !== props[key]) {
				props[value] = props[key]
			}
		}
		return new this(props)
	}
}

export default ObjectWithAlias
