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

export default function resolveAliases(Class, input) {
	const data = { ...input }

	for (const [key, meta] of Object.entries(Class)) {
		if (meta && typeof meta === 'object' && meta.alias) {
			const aliases = Array.isArray(meta.alias) ? meta.alias : [meta.alias]
			for (const alias of aliases) {
				if (alias in data && !(key in data)) {
					data[key] = data[alias]
					delete data[alias]
					// Found a valid alias, move to the next key
					break
				}
			}
		}
	}

	return data
}
