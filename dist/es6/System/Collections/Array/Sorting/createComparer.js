import { Type } from "../../../Types";
import { compare } from "../../../Compare";
function ensureArray(value) {
    return Array.isArray(value)
        ? value
        : [value];
}
export function createComparer(selector, order = 1, equivalentToNaN = NaN) {
    const nanHasEquivalent = !Type.isTrueNaN(equivalentToNaN);
    return (a, b) => {
        const aValue = ensureArray(selector(a));
        const bValue = ensureArray(selector(b));
        const len = Math.min(aValue.length, bValue.length);
        const oArray = Array.isArray(order) ? order : null;
        for (let i = 0; i < len; i++) {
            let vA = aValue[i], vB = bValue[i];
            const o = oArray
                ? (i < oArray.length ? oArray[i] : 1)
                : order;
            if (nanHasEquivalent) {
                if (Type.isTrueNaN(vA))
                    vA = equivalentToNaN;
                if (Type.isTrueNaN(vB))
                    vB = equivalentToNaN;
            }
            const r = compare(vA, vB);
            if (r !== 0)
                return o * r;
        }
        return 0;
    };
}
//# sourceMappingURL=createComparer.js.map