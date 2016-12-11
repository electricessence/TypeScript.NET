/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function sum(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        if (!source || !source.length)
            return 0;
        var result = 0;
        if (ignoreNaN) {
            for (var _i = 0, _a = source; _i < _a.length; _i++) {
                var n = _a[_i];
                if (!isNaN(n))
                    result += n;
            }
        }
        else {
            for (var _b = 0, _c = source; _b < _c.length; _b++) {
                var n = _c[_b];
                if (isNaN(n))
                    return NaN;
                result += n;
            }
        }
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
            for (var _i = 0, _a = source; _i < _a.length; _i++) {
                var n = _a[_i];
                if (!isNaN(n)) {
                    result += n;
                    count++;
                }
            }
        }
        else {
            count = source.length;
            for (var _b = 0, _c = source; _b < _c.length; _b++) {
                var n = _c[_b];
                if (isNaN(n))
                    return NaN;
                result += n;
            }
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
            for (var _i = 0, _a = source; _i < _a.length; _i++) {
                var n = _a[_i];
                if (!isNaN(n))
                    result *= n;
            }
        }
        else {
            for (var _b = 0, _c = source; _b < _c.length; _b++) {
                var n = _c[_b];
                if (isNaN(n))
                    return NaN;
                result *= n;
            }
        }
        return result;
    }
    exports_1("product", product);
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
            if (!n) {
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
    exports_1("quotient", quotient);
    function ifSet(source, start, ignoreNaN, predicate) {
        if (!source || !source.length)
            return NaN;
        var result = start;
        if (ignoreNaN) {
            var found = false;
            for (var _i = 0, _a = source; _i < _a.length; _i++) {
                var n = _a[_i];
                if (!isNaN(n)) {
                    if (predicate(n, result))
                        result = n;
                    if (!found)
                        found = true;
                }
            }
            if (!found)
                return NaN;
        }
        else {
            for (var _b = 0, _c = source; _b < _c.length; _b++) {
                var n = _c[_b];
                if (isNaN(n))
                    return NaN;
                if (predicate(n, result))
                    result = n;
            }
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
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
        }
    };
});
//# sourceMappingURL=Procedure.js.map