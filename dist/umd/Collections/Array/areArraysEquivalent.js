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
        define(["require", "exports", "../../Comparison/compare", "./validateSize", "./copyArray"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compare_1 = require("../../Comparison/compare");
    var validateSize_1 = require("./validateSize");
    var copyArray_1 = require("./copyArray");
    function internalSort(a, comparer) {
        if (!a || a.length < 2)
            return a;
        var b = copyArray_1.default(a);
        return b.sort(comparer);
    }
    function areArraysEquivalent(a, b, comparer) {
        if (comparer === void 0) { comparer = compare_1.default; }
        var len = validateSize_1.default(a, b);
        if (typeof len == 'boolean')
            return len;
        // There might be a better more performant way to do this, but for the moment, this
        // works quite well.
        a = internalSort(a, comparer);
        b = internalSort(b, comparer);
        for (var i = 0; i < len; i++) {
            if (comparer(a[i], b[i]) !== 0)
                return false;
        }
        return true;
    }
    exports.default = areArraysEquivalent;
});
//# sourceMappingURL=areArraysEquivalent.js.map