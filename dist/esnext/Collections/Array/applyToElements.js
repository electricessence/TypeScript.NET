/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param target
 * @param fn
 */
export default function applyToElements(target, fn) {
    if (target && fn) {
        for (var i = 0; i < target.length; i++) {
            target[i] = fn(target[i], i);
        }
    }
}
//# sourceMappingURL=applyToElements.js.map