/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Allows for using "false" to cause forEach to break.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param source
 * @param action
 */
export default function forEachElement(source, action) {
    if (source && action) {
        // Don't cache the length since it is possible that the underlying array changed.
        for (var i = 0; i < source.length; i++) {
            if (action(source[i], i) === false)
                break;
        }
    }
}
//# sourceMappingURL=forEachElement.js.map