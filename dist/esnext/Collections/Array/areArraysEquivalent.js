/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import compare from "../../Comparison/compare";
import validateSize from "./validateSize";
import copyArray from "./copyArray";
function internalSort(a, comparer) {
    if (!a || a.length < 2)
        return a;
    var b = copyArray(a);
    return b.sort(comparer);
}
export default function areArraysEquivalent(a, b, comparer) {
    if (comparer === void 0) { comparer = compare; }
    var len = validateSize(a, b);
    if (typeof len == 'boolean')
        return len;
    // There might be a better more performant way to do this, but for the moment, this
    // works quite well.
    a = internalSort(a, comparer);
    b = internalSort(b, comparer);
    for (var i = 0; i < len; i++) {
        if (comparer(a[i], b[i]) !== 0)
            return false;
    }
    return true;
}
//# sourceMappingURL=areArraysEquivalent.js.map