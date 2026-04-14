import resolveDefaults from './utils/resolveDefaults.js'
import resolveAliases from './utils/resolveAliases.js'
import resolveValidation from './utils/resolveValidation.js'

/**
 * @typedef {Object} ModelOptions
 * @property {import('@nan0web/db').default} [db] Database instance or access provider
 * @property {Record<string, any>} plugins Optional plugins/extensions
 * @property {import('./utils/TFunction.js').TFunction} t Translation function
 */

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
	/** @type {ModelOptions} */
	#options = {
		t: (key) => key,
		plugins: {}
	}
	/**
	 * @param {object} data Data from YAML or Markdown frontmatter
	 * @param {Partial<ModelOptions>} [options] Extended options `db`, `t`, `plugins`.
	 */
	constructor(data = {}, options = {}) {
		const Model = this.constructor
		const input = typeof data === 'string' ? { UI: data } : data
		Object.assign(this, resolveDefaults(Model, resolveAliases(Model, input)))
		Object.assign(this.#options, options)
	}

	/**
	 * Environment options dependencies
	 * @returns {ModelOptions}
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

	/**
	 * Update instance data with alias resolution support.
	 * @param {object} data
	 * @returns {this}
	 */
	setData(data) {
		const Model = this.constructor
		Object.assign(this, resolveAliases(Model, data))
		return this
	}
}
