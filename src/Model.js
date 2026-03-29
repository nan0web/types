import resolveDefaults from './utils/resolveDefaults.js'
import resolveAliases from './utils/resolveAliases.js'
import resolveValidation from './utils/resolveValidation.js'

/**
 * Domain Data Model
 * Implements Model-as-Schema (Project-as-Data)
 *
 * Базова модель, що забезпечує підтримку resolveDefaults, resolveAliases та resolveValidation.
 *
 * @example
 * import { Model } from '@nan0web/types'
 * const model = new Model({ description: 'My App', tags: ['ui'] })
 */
export class Model {
	#options = {}
	/**
	 * @param {object} data Data from YAML or Markdown frontmatter
	 * @param {object} [options] Extended options (db, etc.)
	 */
	constructor(data = {}, options = {}) {
		const Model = this.constructor
		Object.assign(this, resolveDefaults(Model, resolveAliases(Model, data)))
		this.#options = options
	}

	/** @returns {any} */
	get db() {
		return this.#options.db
	}

	/** 
	 * Environment options dependencies
	 * @returns {object}
	 */
	get _() {
		return this.#options
	}

	/**
	 * Validate instance against static schema metadata.
	 * @returns {boolean} True if validation passes
	 * @throws {import('./domain/ModelError.js').ModelError}
	 */
	validate() {
		return resolveValidation(this.constructor, this)
	}
}
