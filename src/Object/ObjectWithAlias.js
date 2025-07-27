class ObjectWithAlias {
	static ALIAS = {}
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
