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
        define(["require", "exports", "./SumResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SumResult_1 = require("./SumResult");
    /**
     * Sums the values of a set of numbers.
     * @param {ArrayLike<number>} source
     * @param {boolean} ignoreNaN
     * @returns {number}
     */
    function sum(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        return new SumResult_1.default(source, ignoreNaN).sum;
    }
    exports.sum = sum;
});
//# sourceMappingURL=sum.js.map