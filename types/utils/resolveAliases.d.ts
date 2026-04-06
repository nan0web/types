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
export default function resolveAliases(Class: any, input: any): any;
