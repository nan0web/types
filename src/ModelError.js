export default class ModelError extends Error {
	/**
	 * @param {Record<string, string>} fields - Map of field names to their validation error messages.
	 */
	constructor(fields) {
		const message = Object.values(fields).join('\n---\n')
		super(message)
		this.name = 'ModelError'
		this.fields = fields
	}
}
