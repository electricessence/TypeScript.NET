/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import areEqual from "../../Comparison/areEqual";
import areArraysEqual from "./areArraysEqual";
export function areAllEqual(arrays, strict, equalityComparer) {
    if (strict === void 0) { strict = true; }
    if (equalityComparer === void 0) { equalityComparer = areEqual; }
    if (!arrays)
        throw new Error("ArgumentNullException: 'arrays' cannot be null.");
    if (arrays.length < 2)
        throw new Error("Cannot compare a set of arrays less than 2.");
    if (typeof strict == 'function') {
        equalityComparer = strict;
        strict = true;
    }
    var first = arrays[0];
    for (var i = 1, l = arrays.length; i < l; i++) {
        if (!areArraysEqual(first, arrays[i], strict, equalityComparer))
            return false;
    }
    return true;
}
//# sourceMappingURL=areArraysAllEqual.js.map