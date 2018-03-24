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
        define(["require", "exports", "./initializeArray", "../../Exceptions/ArgumentOutOfRangeException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var initializeArray_1 = require("./initializeArray");
    var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
    /**
     * Returns a range of numbers based upon the first value and the step value.
     * @param first
     * @param count
     * @param step
     * @returns {number[]}
     */
    function rangeOfNumbers(first, count, step) {
        if (step === void 0) { step = 1; }
        if (!isFinite(first))
            throw new ArgumentOutOfRangeException_1.default('first', first);
        if (!isFinite(count))
            throw new ArgumentOutOfRangeException_1.default('count', count);
        if (!isFinite(step))
            throw new ArgumentOutOfRangeException_1.default('step', step);
        var result = initializeArray_1.default(count >= 0 ? count : 0);
        for (var i = 0; i < count; i++) {
            result[i] = first;
            first += step;
        }
        return result;
    }
    exports.default = rangeOfNumbers;
});
//# sourceMappingURL=rangeOfNumbers.js.map