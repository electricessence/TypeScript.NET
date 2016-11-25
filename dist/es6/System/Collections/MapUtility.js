/**
 * Takes a target object and applies all source values to it.
 * @param target
 * @param source
 * @returns {any}
 */
export function apply(target, source) {
    const result = target || {};
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            result[key] = source[key];
        }
    }
    return result;
}
/**
 * Takes a target object and ensures values exist.
 * @param target
 * @param defaults
 * @returns {any}
 */
export function ensure(target, defaults) {
    const result = target || {};
    for (const key in defaults) {
        if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
            result[key] = defaults[key];
        }
    }
    return result;
}
/**
 * Make a copy of the source object.
 * @param source
 * @returns {Object}
 */
export function copy(source) {
    return apply({}, source);
}
/**
 * Takes two objects and creates another with the values of both.
 * B overwrites A.
 * @param a
 * @param b
 */
export function merge(a, b) {
    return apply(copy(a), b);
}
//# sourceMappingURL=MapUtility.js.map