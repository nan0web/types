/**
 * @typedef {Object} ModelOptions
 * @property {import('@nan0web/db').default} [db] Database instance or access provider
 * @property {Record<string, any>} [plugins] Optional plugins/extensions
 * @property {import('./utils/TFunction.js').TFunction} [t] Translation function
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
    /**
     * @param {object} data Data from YAML or Markdown frontmatter
     * @param {ModelOptions} [options] Extended options (db, etc.)
     */
    constructor(data?: object, options?: ModelOptions);
    /**
     * Environment options dependencies
     * @returns {ModelOptions}
     */
    get _(): ModelOptions;
    /**
     * Validate instance against static schema metadata.
     * @returns {boolean} True if validation passes
     * @throws {import('./domain/ModelError.js').ModelError}
     */
    validate(): boolean;
    /**
     * Update instance data with alias resolution support.
     * @param {object} data
     * @returns {this}
     */
    setData(data: object): this;
    #private;
}
export type ModelOptions = {
    /**
     * Database instance or access provider
     */
    db?: import("@nan0web/db").default | undefined;
    /**
     * Optional plugins/extensions
     */
    plugins?: Record<string, any> | undefined;
    /**
     * Translation function
     */
    t?: import("./utils/TFunction.js").TFunction | undefined;
};
