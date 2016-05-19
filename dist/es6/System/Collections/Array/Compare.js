/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as Values from "../../Compare";
import { Type } from "../../Types";
function validateSize(a, b) {
    if (a && b && a === b || !a && !b)
        return true;
    if (!a || !b)
        return false;
    var len = a.length;
    if (len !== b.length)
        return false;
    if (len === 0)
        return true;
    return len;
}
export function areAllEqual(arrays, strict, equalityComparer = Values.areEqual) {
    if (!arrays)
        throw new Error("ArgumentNullException: 'arrays' cannot be null.");
    if (arrays.length < 2)
        throw new Error("Cannot compare a set of arrays less than 2.");
    var first = arrays[0];
    for (let i = 0, l = arrays.length; i < l; i++) {
        if (!areEqual(first, arrays[i], strict, equalityComparer))
            return false;
    }
    return true;
}
export function areEqual(a, b, strict, equalityComparer = Values.areEqual) {
    var len = validateSize(a, b);
    if (Type.isBoolean(len))
        return len;
    for (let i = 0; i < len; i++) {
        if (!equalityComparer(a[i], b[i], strict))
            return false;
    }
    return true;
}
function sort(a, comparer) {
    if (!a || a.length < 2)
        return a;
    var len = a.length, b;
    if (len > 65536)
        b = new Array(len);
    else {
        b = [];
        b.length = len;
    }
    for (let i = 0; i < len; i++) {
        b[i] = a[i];
    }
    b.sort(comparer);
    return b;
}
export function areEquivalent(a, b, comparer = Values.compare) {
    var len = validateSize(a, b);
    if (Type.isBoolean(len))
        return len;
    a = sort(a, comparer);
    b = sort(b, comparer);
    for (let i = 0; i < len; i++) {
        if (comparer(a[i], b[i]) !== 0)
            return false;
    }
    return true;
}
//# sourceMappingURL=Compare.js.map