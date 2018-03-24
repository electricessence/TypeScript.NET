/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
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
export function min(source, ignoreNaN) {
    if (ignoreNaN === void 0) { ignoreNaN = false; }
    return ifSet(source, +Infinity, ignoreNaN, function (n, result) { return n < result; });
}
export function max(source, ignoreNaN) {
    if (ignoreNaN === void 0) { ignoreNaN = false; }
    return ifSet(source, -Infinity, ignoreNaN, function (n, result) { return n > result; });
}
//# sourceMappingURL=minmax.js.map