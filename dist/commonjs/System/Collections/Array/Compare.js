"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Values = require("../../Compare");
var Types_1 = require("../../Types");
/*  validateSize: Utility for quick validation/invalidation of array equality.
    Why this way?  Why not pass a closure for the last return?
    Reason: Performance and avoiding the creation of new functions/closures. */
function validateSize(a, b) {
    // Both valid and are same object, or both are null/undefined.
    if (a && b && a === b || !a && !b)
        return true;
    // At this point, at least one has to be non-null.
    if (!a || !b)
        return false;
    var len = a.length;
    if (len !== b.length)
        return false;
    // If both are arrays and have zero length, they are equal.
    if (len === 0)
        return true;
    // Return the length for downstream processing.
    return len;
}
function areAllEqual(arrays, strict, equalityComparer) {
    if (strict === void 0) { strict = true; }
    if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
    if (!arrays)
        throw new Error("ArgumentNullException: 'arrays' cannot be null.");
    if (arrays.length < 2)
        throw new Error("Cannot compare a set of arrays less than 2.");
    if (Types_1.Type.isFunction(strict)) {
        equalityComparer = strict;
        strict = true;
    }
    var first = arrays[0];
    for (var i = 1, l = arrays.length; i < l; i++) {
        if (!areEqual(first, arrays[i], strict, equalityComparer))
            return false;
    }
    return true;
}
exports.areAllEqual = areAllEqual;
function areEqual(a, b, strict, equalityComparer) {
    if (strict === void 0) { strict = true; }
    if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
    var len = validateSize(a, b);
    if (Types_1.Type.isBoolean(len))
        return len;
    if (Types_1.Type.isFunction(strict)) {
        equalityComparer = strict;
        strict = true;
    }
    for (var i = 0; i < len; i++) {
        if (!equalityComparer(a[i], b[i], strict))
            return false;
    }
    return true;
}
exports.areEqual = areEqual;
function internalSort(a, comparer) {
    if (!a || a.length < 2)
        return a;
    var len = a.length;
    var b;
    if (len > 65536)
        b = new Array(len);
    else {
        b = [];
        b.length = len;
    }
    for (var i = 0; i < len; i++) {
        b[i] = a[i];
    }
    b.sort(comparer);
    return b;
}
function areEquivalent(a, b, comparer) {
    if (comparer === void 0) { comparer = Values.compare; }
    var len = validateSize(a, b);
    if (Types_1.Type.isBoolean(len))
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
exports.areEquivalent = areEquivalent;
//# sourceMappingURL=Compare.js.map