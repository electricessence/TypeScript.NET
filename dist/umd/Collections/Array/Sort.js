(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Sorting/createComparer", "./Sorting/quickSort"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var createComparer_1 = require("./Sorting/createComparer");
    exports.createComparer = createComparer_1.default;
    exports.default = createComparer_1.default;
    exports.by = createComparer_1.default;
    var quickSort_1 = require("./Sorting/quickSort");
    exports.quickSort = quickSort_1.default;
    var ArraySort;
    (function (ArraySort) {
        ArraySort.quick = quickSort_1.default;
        function using(target, selector, order, equivalentToNaN) {
            if (order === void 0) { order = 1 /* Ascending */; }
            if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
            return target.sort(createComparer_1.default(selector, order, equivalentToNaN));
        }
        ArraySort.using = using;
    })(ArraySort = exports.ArraySort || (exports.ArraySort = {}));
});
//# sourceMappingURL=Sort.js.map