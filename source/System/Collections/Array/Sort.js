/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../../Types', '../../Compare'], function (require, exports, Types_1, Compare_1) {
    function ensureArray(value) {
        return value instanceof Array
            ? value
            : [value];
    }
    function createComparer(selector, order, equivalentToNaN) {
        if (order === void 0) { order = 1; }
        if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
        var nanHasEquivalent = !Types_1.default.isTrueNaN(equivalentToNaN);
        return function (a, b) {
            var aValue = ensureArray(selector(a));
            var bValue = ensureArray(selector(b));
            var len = Math.min(aValue.length, bValue.length);
            var oArray = order instanceof Array ? order : null;
            for (var i = 0; i < len; i++) {
                var vA = aValue[i], vB = bValue[i], o = oArray
                    ? (i < oArray.length ? oArray[i] : 1)
                    : order;
                if (nanHasEquivalent) {
                    if (Types_1.default.isTrueNaN(vA))
                        vA = equivalentToNaN;
                    if (Types_1.default.isTrueNaN(vB))
                        vB = equivalentToNaN;
                }
                var r = Compare_1.compare(vA, vB);
                if (r !== 0)
                    return o * r;
            }
            return 0;
        };
    }
    exports.createComparer = createComparer;
    exports.default = createComparer;
    exports.by = createComparer;
});
//# sourceMappingURL=Sort.js.map