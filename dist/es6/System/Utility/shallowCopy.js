/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export function shallowCopy(source, target = {}) {
    if (target) {
        for (let k in source) {
            target[k] = source[k];
        }
    }
    return target;
}
export default shallowCopy;
//# sourceMappingURL=shallowCopy.js.map