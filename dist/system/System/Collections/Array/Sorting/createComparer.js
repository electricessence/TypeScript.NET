System.register(["../../../Types", "../../../Compare"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function ensureArray(value) {
        return Array.isArray(value)
            ? value
            : [value];
    }
    /**
     * A factory function that creates a comparer to be used in multi-dimensional sorting.
     *
     * <h4>Example</h4>
     * ```typescript
     * var myArray = [{a:1:b:2},{a:3,b:4},{a:1,b:3}];
     *
     * // First sort by a, then by b.
     * myArray.sort(
     *   createComparer(
     *     (e)=> [e.a, e.b],
     *     [Order.Ascending, Order.Descending]
     *   )
     * );
     *
     * // result: [{a:1,b:3},{a:1:b:2},{a:3,b:4}]
     * ```
     *
     * @param selector
     * @param order
     * @param equivalentToNaN
     * @returns {function((TSource|TSource[]), (TSource|TSource[])): CompareResult}
     */
    function createComparer(selector, order, equivalentToNaN) {
        if (order === void 0) { order = 1 /* Ascending */; }
        if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
        var nanHasEquivalent = !Types_1.Type.isTrueNaN(equivalentToNaN);
        return function (a, b) {
            // Use an array always to ensure a single code path.
            var aValue = ensureArray(selector(a));
            var bValue = ensureArray(selector(b));
            var len = Math.min(aValue.length, bValue.length);
            var oArray = Array.isArray(order) ? order : null;
            for (var i = 0; i < len; i++) {
                var vA = aValue[i], vB = bValue[i];
                var o = oArray
                    ? (i < oArray.length ? oArray[i] : 1 /* Ascending */)
                    : order;
                if (nanHasEquivalent) {
                    if (Types_1.Type.isTrueNaN(vA))
                        vA = equivalentToNaN;
                    if (Types_1.Type.isTrueNaN(vB))
                        vB = equivalentToNaN;
                }
                var r = Compare_1.compare(vA, vB);
                if (r !== 0 /* Equal */)
                    return o * r;
            }
            return 0;
        };
    }
    exports_1("createComparer", createComparer);
    var Types_1, Compare_1;
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=createComparer.js.map