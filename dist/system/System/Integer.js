/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./Types", "./Exceptions/ArgumentException", "./Exceptions/ArgumentOutOfRangeException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, ArgumentException_1, ArgumentOutOfRangeException_1;
    var Integer;
    function Integer(n) {
        return n | 0;
    }
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            }],
        execute: function() {
            (function (Integer) {
                function r(maxExclusive) {
                    return (Math.random() * maxExclusive) | 0;
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
                        if (boundary === 0)
                            return 0;
                        if (inclusive)
                            boundary += boundary / Math.abs(boundary);
                        return r(boundary);
                    }
                    random.next = next;
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
                    var select;
                    (function (select) {
                        function one(source) {
                            return random.select(source);
                        }
                        select.one = one;
                    })(select = random.select || (random.select = {}));
                })(random = Integer.random || (Integer.random = {}));
                function is(n) {
                    return Types_1.default.isNumber(n, false) && isFinite(n) && n == (n | 0);
                }
                Integer.is = is;
                function assert(n, argumentName) {
                    var i = is(n);
                    if (!i)
                        throw new ArgumentException_1.default(argumentName || 'n', "Must be a integer.");
                    return i;
                }
                Integer.assert = assert;
                function assertZeroOrGreater(n, argumentName) {
                    var i = assert(n, argumentName) && n >= 0;
                    if (!i)
                        throw new ArgumentOutOfRangeException_1.default(argumentName || 'n', n, "Must be a valid integer greater than or equal to zero.");
                    return i;
                }
                Integer.assertZeroOrGreater = assertZeroOrGreater;
                function assertPositive(n, argumentName) {
                    var i = assert(n, argumentName) && n > 0;
                    if (!i)
                        throw new ArgumentOutOfRangeException_1.default(argumentName || 'n', n, "Must be greater than zero.");
                    return i;
                }
                Integer.assertPositive = assertPositive;
            })(Integer || (Integer = {}));
            exports_1("default",Integer);
        }
    }
});
//# sourceMappingURL=Integer.js.map