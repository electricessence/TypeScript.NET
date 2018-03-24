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
     * Guarantees a number value or NaN instead.
     * @param value
     * @returns {number}
     */
    function numberOrNaN(value) {
        return isNaN(value) ? NaN : value;
    }
    exports.numberOrNaN = numberOrNaN;
});
//# sourceMappingURL=numberOrNaN.js.map