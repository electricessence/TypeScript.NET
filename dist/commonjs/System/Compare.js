"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./Types");
var isTrueNaN = Types_1.Type.isTrueNaN;
var VOID0 = void 0;
/**
 * Used for special comparison including NaN.
 * @param a
 * @param b
 * @param strict
 * @returns {boolean|any}
 */
function areEqual(a, b, strict) {
    if (strict === void 0) { strict = true; }
    return a === b
        || !strict && a == b
        || isTrueNaN(a) && isTrueNaN(b);
}
exports.areEqual = areEqual;
var COMPARE_TO = "compareTo";
function compare(a, b, strict) {
    if (strict === void 0) { strict = true; }
    if (areEqual(a, b, strict))
        return 0 /* Equal */;
    if (a && Types_1.Type.hasMember(a, COMPARE_TO))
        return a.compareTo(b); // If a has compareTo, use it.
    else if (b && Types_1.Type.hasMember(b, COMPARE_TO))
        return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.
    // Allow for special inequality..
    if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
        return 1 /* Greater */;
    if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
        return -1 /* Less */;
    return NaN;
}
exports.compare = compare;
/**
 * Determines if two primitives are equal or if two objects have the same key/value combinations.
 * @param a
 * @param b
 * @param nullEquivalency If true, null/undefined will be equivalent to an empty object {}.
 * @param extraDepth
 * @returns {boolean}
 */
function areEquivalent(a, b, nullEquivalency, extraDepth) {
    if (nullEquivalency === void 0) { nullEquivalency = true; }
    if (extraDepth === void 0) { extraDepth = 0; }
    // Take a step by step approach to ensure efficiency.
    if (areEqual(a, b, true))
        return true;
    if (a == null || b == null) {
        if (!nullEquivalency)
            return false;
        if (Types_1.Type.isObject(a)) {
            return !Object.keys(a).length;
        }
        if (Types_1.Type.isObject(b)) {
            return !Object.keys(b).length;
        }
        return a == null && b == null;
    }
    if (Types_1.Type.isObject(a) && Types_1.Type.isObject(b)) {
        var aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
        if (len != bKeys.length)
            return false;
        aKeys.sort();
        bKeys.sort();
        for (var i = 0; i < len; i++) {
            var key = aKeys[i];
            if (key !== bKeys[i] || !areEqual(a[key], b[key], true))
                return false;
        }
        // Doesn't track circular references but allows for controlling the amount of recursion.
        if (extraDepth > 0) {
            for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
                var key = aKeys_1[_i];
                if (!areEquivalent(a[key], b[key], nullEquivalency, extraDepth - 1))
                    return false;
            }
        }
        return true;
    }
    return false;
}
exports.areEquivalent = areEquivalent;
//# sourceMappingURL=Compare.js.map