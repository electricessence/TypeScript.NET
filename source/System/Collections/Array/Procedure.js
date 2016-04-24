/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function sum(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        if (!source || !source.length)
            return 0;
        var result = 0;
        if (ignoreNaN)
            source.forEach(function (n) {
                if (!isNaN(n))
                    result += n;
            });
        else
            source.every(function (n) {
                result += n;
                return !isNaN(result);
            });
        return result;
    }
    exports.sum = sum;
    function average(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        if (!source || !source.length)
            return NaN;
        var result = 0, count;
        if (ignoreNaN) {
            count = 0;
            source.forEach(function (n) {
                if (!isNaN(n)) {
                    result += n;
                    count++;
                }
            });
        }
        else {
            count = source.length;
            source.every(function (n) {
                result += n;
                return !isNaN(result);
            });
        }
        return (!count || isNaN(result)) ? NaN : (result / count);
    }
    exports.average = average;
    function product(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        if (!source || !source.length)
            return NaN;
        var result = 1;
        if (ignoreNaN) {
            var found = false;
            source.forEach(function (n) {
                if (!isNaN(n)) {
                    result *= n;
                    if (!found)
                        found = true;
                }
            });
            if (!found)
                result = NaN;
        }
        else {
            source.every(function (n) {
                if (isNaN(n)) {
                    result = NaN;
                    return false;
                }
                result *= n;
                return true;
            });
        }
        return result;
    }
    exports.product = product;
    function quotient(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        if (!source || source.length < 2)
            return NaN;
        var result = source[0];
        var found = false;
        source.every(function (n, i) {
            if (i) {
                if (n === 0) {
                    result = NaN;
                    return false;
                }
                if (isNaN(n)) {
                    if (!ignoreNaN) {
                        result = NaN;
                        return false;
                    }
                }
                else {
                    result /= n;
                    if (!found)
                        found = true;
                }
            }
            return true;
        });
        if (!found)
            result = NaN;
        return result;
    }
    exports.quotient = quotient;
    function ifSet(source, start, ignoreNaN, predicate) {
        if (!source || !source.length)
            return NaN;
        var result = start;
        if (ignoreNaN) {
            var found = false;
            source.forEach(function (n) {
                if (!isNaN(n)) {
                    if (predicate(n, result))
                        result = n;
                    if (!found)
                        found = true;
                }
            });
            if (!found)
                result = NaN;
        }
        else {
            source.every(function (n) {
                if (isNaN(n)) {
                    result = NaN;
                    return false;
                }
                if (predicate(n, result))
                    result = n;
                return true;
            });
        }
        return result;
    }
    function min(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        return ifSet(source, +Infinity, ignoreNaN, function (n, result) { return n < result; });
    }
    exports.min = min;
    function max(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        return ifSet(source, -Infinity, ignoreNaN, function (n, result) { return n > result; });
    }
    exports.max = max;
});
//# sourceMappingURL=Procedure.js.map