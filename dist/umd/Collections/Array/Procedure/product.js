/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function product(source, ignoreNaN) {
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
    exports.product = product;
});
//# sourceMappingURL=product.js.map