/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Utility for quick validation/invalidation of array equality.
     * Why this way?  Why not pass a closure for the last return?
     * Reason: Performance and avoiding the creation of new functions/closures.
     * @param {ArrayLike<any>} a
     * @param {ArrayLike<any>} b
     * @returns {boolean | number}
     */
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
    exports.default = validateSize;
});
//# sourceMappingURL=validateSize.js.map