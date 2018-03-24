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
     * Takes the first number and divides it by all following.
     * @param source
     * @param ignoreNaN Will cause this skip any NaN values.
     * @returns {number}
     */
    function quotient(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        var len = source ? source.length : 0;
        if (len < 2)
            return NaN;
        var result = source[0];
        var found = false;
        for (var i = 1; i < len; i++) {
            var n = source[i];
            if (n === 0) {
                return NaN;
            }
            if (isNaN(n)) {
                if (!ignoreNaN) {
                    return NaN;
                }
            }
            else {
                result /= n;
                if (!found)
                    found = true;
            }
        }
        return found ? result : NaN;
    }
    exports.quotient = quotient;
});
//# sourceMappingURL=quotient.js.map