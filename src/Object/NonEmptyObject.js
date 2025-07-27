import { notEmpty } from "../index.js"

class NonEmptyObject {
	toObject() {
		const result = {}
		for (const key in this) {
			if (notEmpty(this[key])) {
				result[key] = this[key].toObject?.() ?? this[key]
			}
		}
		return result
	}
}

export default NonEmptyObject
