/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Types", "../../Compare"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, Compare_1;
    function ensureArray(value) {
        return Array.isArray(value)
            ? value
            : [value];
    }
    function createComparer(selector, order, equivalentToNaN) {
        if (order === void 0) { order = 1; }
        if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
        var nanHasEquivalent = !Types_1.Type.isTrueNaN(equivalentToNaN);
        return function (a, b) {
            var aValue = ensureArray(selector(a));
            var bValue = ensureArray(selector(b));
            var len = Math.min(aValue.length, bValue.length);
            var oArray = Array.isArray(order) ? order : null;
            for (var i = 0; i < len; i++) {
                var vA = aValue[i], vB = bValue[i], o = oArray
                    ? (i < oArray.length ? oArray[i] : 1)
                    : order;
                if (nanHasEquivalent) {
                    if (Types_1.Type.isTrueNaN(vA))
                        vA = equivalentToNaN;
                    if (Types_1.Type.isTrueNaN(vB))
                        vB = equivalentToNaN;
                }
                var r = Compare_1.compare(vA, vB);
                if (r !== 0)
                    return o * r;
            }
            return 0;
        };
    }
    exports_1("createComparer", createComparer);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            }],
        execute: function() {
            exports_1("default", createComparer);
            exports_1("by", createComparer);
        }
    }
});
//# sourceMappingURL=Sort.js.map