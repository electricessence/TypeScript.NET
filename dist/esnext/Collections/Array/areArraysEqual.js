/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import areEqual from "../../Comparison/areEqual";
import validateSize from "./validateSize";
export default function areArraysEqual(a, b, strict, equalityComparer) {
    if (strict === void 0) { strict = true; }
    if (equalityComparer === void 0) { equalityComparer = areEqual; }
    var len = validateSize(a, b);
    if (typeof len == 'boolean')
        return len;
    if (typeof strict == 'function') {
        equalityComparer = strict;
        strict = true;
    }
    for (var i = 0; i < len; i++)
        if (!equalityComparer(a[i], b[i], strict))
            return false;
    return true;
}
//# sourceMappingURL=areArraysEqual.js.map