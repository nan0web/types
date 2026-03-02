/**
 * @file resolveAliases — universal alias resolution for Model-as-Schema classes.
 *
 * Scans static properties of a class for `alias` keys and remaps
 * input data accordingly before constructing the instance.
 *
 * Pattern:
 *   class Config {
 *     static appName = { alias: 'name', help: '...', default: '' }
 *     static dsn    = { help: '...', default: 'data/' }
 *   }
 *
 *   resolveAliases(Config, { name: 'my-app' })
 *   // → { appName: 'my-app' }
 *
 * This replaces the need to copy/paste alias resolution into every `static from()`.
 */
/**
 * Resolve aliased keys in input data based on static metadata of the class.
 *
 * @param {Function} Class - The class constructor with static metadata fields.
 * @param {object} input - Raw input data (e.g. from YAML config or API).
 * @returns {object} - Shallow copy of input with aliases resolved.
 */
export default function resolveAliases(Class: Function, input: object): object;
