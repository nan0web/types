/**
 * Validate values of a target object against static metadata rules.
 *
 * @param {Function} Class - The class constructor with static metadata fields.
 * @param {object} target - The object whose properties should be validated.
 * @returns {boolean} - Returns true if validation passes.
 * @throws {Error} - Throws an Error with all validation failures joined by `\n---\n`.
 */
export default function validateAll(Class: Function, target: object): boolean;
