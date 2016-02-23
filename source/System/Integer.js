/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Types', './Exceptions/ArgumentException'], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require('./Types');
    var ArgumentException_1 = require('./Exceptions/ArgumentException');
    function Integer(n) {
        return n | 0;
    }
    var Integer;
    (function (Integer) {
        function r(max) {
            return (Math.random() * max) | 0;
        }
        /**
         * Returns a random integer from zero to the max.
         * Negative numbers are allowed.
         *
         * Examples:<br/>
         * ```Integer.random(1)``` will return 0 or 1.<br/>
         * ```Integer.random(-2)``` will return 0, -1, or -2.<br/>
         *
         * @param max
         * @returns {number}
         */
        function random(max) {
            assert(max, 'max');
            if (max == 0)
                return 0;
            max += max > 0 ? 1 : -1;
            return r(max);
        }
        Integer.random = random;
        var random;
        (function (random) {
            /**
             * Returns a random integer from zero up to the boundary value.
             * Negative and fractional numbers are allowed.
             *
             * Example:<br/>
             * ```Integer.random(-2)``` will return 0, or -1.<br/>
             * ```Integer.random(5)``` will return 0, 1, 2, 3 or 4.<br/>
             *
             * @param boundary
             * @returns {number}
             */
            function under(boundary) {
                return r(boundary);
            }
            random.under = under;
        })(random = Integer.random || (Integer.random = {}));
        function is(n) {
            return Types_1.default.isNumber(n, false) && n == (n | 0);
        }
        Integer.is = is;
        function assert(n, argumentName) {
            var i = is(n);
            if (!i) {
                throw new ArgumentException_1.default(argumentName || 'n', "Must be an integer.");
            }
            return i;
        }
        Integer.assert = assert;
    })(Integer || (Integer = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Integer;
});
//# sourceMappingURL=Integer.js.map