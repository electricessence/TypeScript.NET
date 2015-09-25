/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports"], function (require, exports) {
    var Procedure;
    (function (Procedure) {
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
        Procedure.sum = sum;
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
        Procedure.average = average;
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
        Procedure.product = product;
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
        Procedure.min = min;
        function max(source, ignoreNaN) {
            if (ignoreNaN === void 0) { ignoreNaN = false; }
            return ifSet(source, -Infinity, ignoreNaN, function (n, result) { return n > result; });
        }
        Procedure.max = max;
    })(Procedure || (Procedure = {}));
    return Procedure;
});
//# sourceMappingURL=Procedure.js.map