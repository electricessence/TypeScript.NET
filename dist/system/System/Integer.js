System.register(["./Exceptions/ArgumentException", "./Exceptions/ArgumentOutOfRangeException"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function Integer(n) {
        return Math.floor(n);
    }
    var ArgumentException_1, ArgumentOutOfRangeException_1;
    exports_1("Integer", Integer);
    return {
        setters: [
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            }
        ],
        execute: function () {
            (function (Integer) {
                Integer.MAX_32_BIT = 2147483647;
                function r(maxExclusive) {
                    return (Math.random() * maxExclusive) | 0;
                }
                /**
                 * Returns a random integer from minInclusive to the maxExclusive.
                 * Negative numbers are allowed.
                 *
                 * @param maxExclusive
                 * @returns {number}
                 */
                function random(maxExclusive) {
                    assert(maxExclusive, 'maxExclusive');
                    return r(maxExclusive);
                }
                Integer.random = random;
                (function (random) {
                    function next(boundary, inclusive) {
                        assert(boundary, 'max');
                        if (boundary === 0)
                            return 0;
                        if (inclusive)
                            boundary += boundary / Math.abs(boundary);
                        return r(boundary);
                    }
                    random.next = next;
                    function set(count, boundary, inclusive) {
                        var s = [];
                        s.length = count;
                        for (var i = 0; i < count; i++) {
                            s[i] = next(boundary, inclusive);
                        }
                        return s;
                    }
                    random.set = set;
                    function nextInRange(min, max, inclusive) {
                        assert(min, 'min');
                        assert(max, 'max');
                        var range = max - min;
                        if (range === 0)
                            return min;
                        if (inclusive)
                            range += range / Math.abs(range);
                        return min + next(range);
                    }
                    random.nextInRange = nextInRange;
                    function select(source) {
                        return source && source.length
                            ? source[r(source.length)]
                            : void (0);
                    }
                    random.select = select;
                    (function (select) {
                        function one(source) {
                            return random.select(source);
                        }
                        select.one = one;
                    })(select = random.select || (random.select = {}));
                })(random = Integer.random || (Integer.random = {}));
                /**
                 * Converts any number to its 32bit counterpart.
                 * Returns null if conversion is not possible.
                 * @param n
                 * @returns {number}
                 */
                function as32Bit(n) {
                    var result = n | 0;
                    return (n === -1 || result !== -1) ? result : null;
                }
                Integer.as32Bit = as32Bit;
                var NUMBER = "number";
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
                        throw new ArgumentException_1.ArgumentException(argumentName || 'n', "Must be a integer.");
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
                        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(argumentName || 'n', n, "Must be a valid integer greater than or equal to zero.");
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
                        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(argumentName || 'n', n, "Must be greater than zero.");
                    return i;
                }
                Integer.assertPositive = assertPositive;
            })(Integer = Integer || (Integer = {}));
            exports_1("Integer", Integer);
            exports_1("default", Integer);
        }
    };
});
//# sourceMappingURL=Integer.js.map