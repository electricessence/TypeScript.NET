/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("sum", sum);
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
    exports_1("average", average);
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
    exports_1("product", product);
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
    exports_1("quotient", quotient);
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
    exports_1("min", min);
    function max(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        return ifSet(source, -Infinity, ignoreNaN, function (n, result) { return n > result; });
    }
    exports_1("max", max);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=Procedure.js.map