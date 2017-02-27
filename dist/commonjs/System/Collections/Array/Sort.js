"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createComparer_1 = require("./Sorting/createComparer");
exports.createComparer = createComparer_1.createComparer;
exports.default = createComparer_1.createComparer;
exports.by = createComparer_1.createComparer;
var quickSort_1 = require("./Sorting/quickSort");
exports.quickSort = quickSort_1.quickSort;
var ArraySort;
(function (ArraySort) {
    ArraySort.quick = quickSort_1.quickSort;
    function using(target, selector, order, equivalentToNaN) {
        if (order === void 0) { order = 1 /* Ascending */; }
        if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
        return target.sort(createComparer_1.createComparer(selector, order, equivalentToNaN));
    }
    ArraySort.using = using;
})(ArraySort = exports.ArraySort || (exports.ArraySort = {}));
//# sourceMappingURL=Sort.js.map