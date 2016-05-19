/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../../Types";
import { compare } from "../../Compare";
function ensureArray(value) {
    return Array.isArray(value)
        ? value
        : [value];
}
export function createComparer(selector, order = 1, equivalentToNaN = NaN) {
    var nanHasEquivalent = !Type.isTrueNaN(equivalentToNaN);
    return (a, b) => {
        var aValue = ensureArray(selector(a));
        var bValue = ensureArray(selector(b));
        var len = Math.min(aValue.length, bValue.length);
        var oArray = Array.isArray(order) ? order : null;
        for (let i = 0; i < len; i++) {
            var vA = aValue[i], vB = bValue[i], o = oArray
                ? (i < oArray.length ? oArray[i] : 1)
                : order;
            if (nanHasEquivalent) {
                if (Type.isTrueNaN(vA))
                    vA = equivalentToNaN;
                if (Type.isTrueNaN(vB))
                    vB = equivalentToNaN;
            }
            var r = compare(vA, vB);
            if (r !== 0)
                return o * r;
        }
        return 0;
    };
}
export { createComparer as default, createComparer as by };
//# sourceMappingURL=Sort.js.map