System.register(["./Sorting/createComparer", "./Sorting/quickSort"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var createComparer_1, quickSort_1, ArraySort;
    return {
        setters: [
            function (createComparer_1_1) {
                createComparer_1 = createComparer_1_1;
            },
            function (quickSort_1_1) {
                quickSort_1 = quickSort_1_1;
            }
        ],
        execute: function () {
            exports_1("createComparer", createComparer_1.createComparer);
            exports_1("default", createComparer_1.createComparer);
            exports_1("by", createComparer_1.createComparer);
            exports_1("quickSort", quickSort_1.quickSort);
            (function (ArraySort) {
                ArraySort.quick = quickSort_1.quickSort;
                function using(target, selector, order, equivalentToNaN) {
                    if (order === void 0) { order = 1 /* Ascending */; }
                    if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
                    return target.sort(createComparer_1.createComparer(selector, order, equivalentToNaN));
                }
                ArraySort.using = using;
            })(ArraySort || (ArraySort = {}));
            exports_1("ArraySort", ArraySort);
        }
    };
});
//# sourceMappingURL=Sort.js.map