import * as Values from "../../Compare";
import { Type } from "../../Types";
function validateSize(a, b) {
    if (a && b && a === b || !a && !b)
        return true;
    if (!a || !b)
        return false;
    const len = a.length;
    if (len !== b.length)
        return false;
    if (len === 0)
        return true;
    return len;
}
export function areAllEqual(arrays, strict = true, equalityComparer = Values.areEqual) {
    if (!arrays)
        throw new Error("ArgumentNullException: 'arrays' cannot be null.");
    if (arrays.length < 2)
        throw new Error("Cannot compare a set of arrays less than 2.");
    if (Type.isFunction(strict)) {
        equalityComparer = strict;
        strict = true;
    }
    const first = arrays[0];
    for (let i = 0, l = arrays.length; i < l; i++) {
        if (!areEqual(first, arrays[i], strict, equalityComparer))
            return false;
    }
    return true;
}
export function areEqual(a, b, strict = true, equalityComparer = Values.areEqual) {
    const len = validateSize(a, b);
    if (Type.isBoolean(len))
        return len;
    if (Type.isFunction(strict)) {
        equalityComparer = strict;
        strict = true;
    }
    for (let i = 0; i < len; i++) {
        if (!equalityComparer(a[i], b[i], strict))
            return false;
    }
    return true;
}
function sort(a, comparer) {
    if (!a || a.length < 2)
        return a;
    const len = a.length;
    let b;
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
    const len = validateSize(a, b);
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