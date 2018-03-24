/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
export function product(source, ignoreNaN) {
    if (ignoreNaN === void 0) { ignoreNaN = false; }
    if (!source || !source.length)
        return NaN;
    var result = 1;
    if (ignoreNaN) {
        var found = false;
        for (var _i = 0, _a = source; _i < _a.length; _i++) {
            var n = _a[_i];
            if (!isNaN(n)) {
                result *= n;
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
            result *= n;
        }
    }
    return result;
}
//# sourceMappingURL=product.js.map