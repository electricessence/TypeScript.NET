import { createComparer } from "./Sorting/createComparer";
import { quickSort } from "./Sorting/quickSort";
export { quickSort, createComparer, createComparer as default, // Allow for default import.
createComparer as by // Alias for Sort.by(...) instead of Sort.createComparer
 };
export var ArraySort;
(function (ArraySort) {
    ArraySort.quick = quickSort;
    function using(target, selector, order = 1 /* Ascending */, equivalentToNaN = NaN) {
        return target.sort(createComparer(selector, order, equivalentToNaN));
    }
    ArraySort.using = using;
})(ArraySort || (ArraySort = {}));
//# sourceMappingURL=Sort.js.map