/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Reflection/isObject", "./areEqual"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isObject_1 = require("../Reflection/isObject");
    var areEqual_1 = require("./areEqual");
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
        // Take a step by step approach to ensureEntries efficiency.
        if (areEqual_1.default(a, b, true))
            return true;
        if (a == null || b == null) {
            if (!nullEquivalency)
                return false;
            if (isObject_1.default(a)) {
                return !Object.keys(a).length;
            }
            if (isObject_1.default(b)) {
                return !Object.keys(b).length;
            }
            return a == null && b == null;
        }
        if (isObject_1.default(a) && isObject_1.default(b)) {
            var aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
            if (len != bKeys.length)
                return false;
            aKeys.sort();
            bKeys.sort();
            for (var i = 0; i < len; i++) {
                var key = aKeys[i];
                if (key !== bKeys[i] || !areEqual_1.default(a[key], b[key], true))
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
});
//# sourceMappingURL=areEquivalent.js.map