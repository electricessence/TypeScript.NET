/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
/**
 * Takes a target object and ensures values exist.
 * @param target
 * @param defaults
 * @returns {any}
 */
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */ export default function mergeValues(target, defaults) {
    const result = target || {};
    for (const key in defaults) {
        if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
            result[key] = defaults[key];
        }
    }
    return result;
}
//# sourceMappingURL=mergeValues.js.map