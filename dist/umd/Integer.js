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
        define(["require", "exports", "./Exceptions/ArgumentException", "./Exceptions/ArgumentLessThanMinimumException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArgumentException_1 = require("./Exceptions/ArgumentException");
    var ArgumentLessThanMinimumException_1 = require("./Exceptions/ArgumentLessThanMinimumException");
    function Integer(n) {
        return Math.floor(n);
    }
    (function (Integer) {
        Integer.MAX_32_BIT = 2147483647;
        Integer.MAX_VALUE = 9007199254740991;
        var NUMBER = "number" /* Number */;
        /**
         * Converts any number to its 32bit counterpart.
         * Throws if conversion is not possible.
         * @param n
         * @returns {number}
         */
        function as32Bit(n) {
            var result = n | 0;
            if (isNaN(n))
                throw "'n' is not a number.";
            if (n !== -1 && result === -1)
                throw "'n' is too large to be a 32 bit integer.";
            return result;
        }
        Integer.as32Bit = as32Bit;
        /**
         * Returns true if the value is an integer.
         * @param n
         * @returns {boolean}
         */
        function is(n) {
            return typeof n === NUMBER && isFinite(n) && n === Math.floor(n);
        }
        Integer.is = is;
        /**
         * Returns true if the value is within a 32 bit range.
         * @param n
         * @returns {boolean}
         */
        function is32Bit(n) {
            return n === (n | 0);
        }
        Integer.is32Bit = is32Bit;
        /**
         * Throws if not an integer.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        function assert(n, argumentName) {
            var i = is(n);
            if (!i)
                throw new ArgumentException_1.default(argumentName || 'n', "Must be a integer.");
            return i;
        }
        Integer.assert = assert;
        /**
         * Throws if less than zero.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        function assertZeroOrGreater(n, argumentName) {
            var i = assert(n, argumentName) && n >= 0;
            if (!i)
                throw new ArgumentLessThanMinimumException_1.default(argumentName || 'n', n, 0);
            return i;
        }
        Integer.assertZeroOrGreater = assertZeroOrGreater;
        /**
         * Throws if not greater than zero.
         * @param n
         * @param argumentName
         * @returns {boolean}
         */
        function assertPositive(n, argumentName) {
            var i = assert(n, argumentName) && n > 0;
            if (!i)
                throw new ArgumentLessThanMinimumException_1.default(argumentName || 'n', n, 1);
            return i;
        }
        Integer.assertPositive = assertPositive;
    })(Integer || (Integer = {}));
    exports.default = Integer;
});
//# sourceMappingURL=Integer.js.map