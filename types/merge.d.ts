export default merge;
/**
 * Merges two objects deeply.
 * Control options inside the object:
 *  - $clear - clear the target on the save level
 * @param {Object} target - The target object to merge into.
 * @param {Object} source - The source object to merge from.
 * @param {Object} [options] - Options for merging.
 * @param {boolean} [options.unique=true] - Whether to merge arrays uniquely, this way
 *                  objects are simplified throught the JSON.stringify > JSON.parse.
 * @returns {Object} - The deeply merged object in the form of target, so if the
 *                     target is object returns object, if target is array returns array.
 */
declare function merge(target: any, source: any, { unique }?: {
    unique?: boolean | undefined;
} | undefined): any;
