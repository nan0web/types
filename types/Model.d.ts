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
    /**
     * @param {object} data Data from YAML or Markdown frontmatter
     * @param {object} [options] Extended options (db, etc.)
     */
    constructor(data?: object, options?: object);
    /** @returns {any} */
    get db(): any;
    /**
     * Environment options dependencies
     * @returns {object}
     */
    get _(): object;
    /**
     * Validate instance against static schema metadata.
     * @returns {boolean} True if validation passes
     * @throws {import('./domain/ModelError.js').ModelError}
     */
    validate(): boolean;
    #private;
}
