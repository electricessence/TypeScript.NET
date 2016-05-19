/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "./Types";
var isTrueNaN = Type.isTrueNaN;
const VOID0 = void 0;
export function areEqual(a, b, strict = true) {
    return a === b
        || !strict && a == b
        || isTrueNaN(a) && isTrueNaN(b);
}
const COMPARE_TO = "compareTo";
export function compare(a, b, strict = true) {
    if (areEqual(a, b, strict))
        return 0;
    if (a && Type.hasMember(a, COMPARE_TO))
        return a.compareTo(b);
    else if (b && Type.hasMember(b, COMPARE_TO))
        return -b.compareTo(a);
    if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
        return 1;
    if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
        return -1;
    return NaN;
}
export function areEquivalent(a, b, nullEquivalency = true, extraDepth = 0) {
    if (areEqual(a, b, true))
        return true;
    if (a === null || a === VOID0 || b == null || b === VOID0) {
        if (!nullEquivalency)
            return false;
        if (Type.isObject(a)) {
            return !Object.keys(a).length;
        }
        if (Type.isObject(b)) {
            return !Object.keys(b).length;
        }
        return (a === null || a === VOID0) && (b == null || b === VOID0);
    }
    if (Type.isObject(a) && Type.isObject(b)) {
        var aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
        if (len != bKeys.length)
            return false;
        aKeys.sort();
        bKeys.sort();
        for (let i = 0; i < len; i++) {
            let key = aKeys[i];
            if (key !== bKeys[i] || !areEqual(a[key], b[key], true))
                return false;
        }
        if (extraDepth > 0) {
            for (let key of aKeys) {
                if (!areEquivalent(a[key], b[key], nullEquivalency, extraDepth - 1))
                    return false;
            }
        }
        return true;
    }
    return false;
}
//# sourceMappingURL=Compare.js.map