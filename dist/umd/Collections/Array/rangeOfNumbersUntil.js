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
        define(["require", "exports", "../../Exceptions/ArgumentOutOfRangeException", "./rangeOfNumbers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
    var rangeOfNumbers_1 = require("./rangeOfNumbers");
    /**
     * Returns a range of numbers based upon the first value and the step value excluding any numbers at or beyond the until value.
     * @param first
     * @param until
     * @param step
     * @returns {number[]}
     */
    function rangeOfNumbersUntil(first, until, step) {
        if (step === void 0) { step = 1; }
        if (step == 0)
            throw new ArgumentOutOfRangeException_1.default('step', step, "Must be a non-zero number.");
        return rangeOfNumbers_1.default(first, (until - first) / step, step);
    }
    exports.default = rangeOfNumbersUntil;
});
//# sourceMappingURL=rangeOfNumbersUntil.js.map