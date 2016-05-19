/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ArgumentException_1 = require("./Exceptions/ArgumentException");
var ArgumentOutOfRangeException_1 = require("./Exceptions/ArgumentOutOfRangeException");
function Integer(n) {
    return Math.floor(n);
}
exports.Integer = Integer;
var Integer;
(function (Integer) {
    Integer.MAX_32_BIT = 2147483647;
    function r(maxExclusive) {
        return Math.random() * maxExclusive | 0;
    }
    function random(maxExclusive) {
        assert(maxExclusive, 'maxExclusive');
        return r(maxExclusive);
    }
    Integer.random = random;
    var random;
    (function (random) {
        function next(boundary, inclusive) {
            assert(boundary, 'max');
            if (boundary === 0) return 0;
            if (inclusive) boundary += boundary / Math.abs(boundary);
            return r(boundary);
        }
        random.next = next;
        function nextInRange(min, max, inclusive) {
            assert(min, 'min');
            assert(max, 'max');
            var range = max - min;
            if (range === 0) return min;
            if (inclusive) range += range / Math.abs(range);
            return min + next(range);
        }
        random.nextInRange = nextInRange;
        function select(source) {
            return source && source.length ? source[r(source.length)] : void 0;
        }
        random.select = select;
        var select;
        (function (select) {
            function one(source) {
                return random.select(source);
            }
            select.one = one;
        })(select = random.select || (random.select = {}));
    })(random = Integer.random || (Integer.random = {}));
    function as32Bit(n) {
        var result = n | 0;
        return n === -1 || result !== -1 ? result : null;
    }
    Integer.as32Bit = as32Bit;
    var NUMBER = "number";
    function is(n) {
        return (typeof n === "undefined" ? "undefined" : _typeof(n)) === NUMBER && isFinite(n) && n === Math.floor(n);
    }
    Integer.is = is;
    function is32Bit(n) {
        return n === (n | 0);
    }
    Integer.is32Bit = is32Bit;
    function assert(n, argumentName) {
        var i = is(n);
        if (!i) throw new ArgumentException_1.ArgumentException(argumentName || 'n', "Must be a integer.");
        return i;
    }
    Integer.assert = assert;
    function assertZeroOrGreater(n, argumentName) {
        var i = assert(n, argumentName) && n >= 0;
        if (!i) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(argumentName || 'n', n, "Must be a valid integer greater than or equal to zero.");
        return i;
    }
    Integer.assertZeroOrGreater = assertZeroOrGreater;
    function assertPositive(n, argumentName) {
        var i = assert(n, argumentName) && n > 0;
        if (!i) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(argumentName || 'n', n, "Must be greater than zero.");
        return i;
    }
    Integer.assertPositive = assertPositive;
})(Integer = exports.Integer || (exports.Integer = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Integer;
//# sourceMappingURL=Integer.js.map
