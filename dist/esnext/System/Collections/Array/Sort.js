import { createComparer } from "./Sorting/createComparer";
import { quickSort } from "./Sorting/quickSort";
import { Order } from "../Sorting/Order";
export { quickSort, createComparer, createComparer as default, // Allow for default import.
createComparer as by // Alias for Sort.by(...) instead of Sort.createComparer
 };
export var ArraySort;
(function (ArraySort) {
    ArraySort.quick = quickSort;
    function using(target, selector, order, equivalentToNaN) {
        if (order === void 0) { order = Order.Ascending; }
        if (equivalentToNaN === void 0) { equivalentToNaN = NaN; }
        return target.sort(createComparer(selector, order, equivalentToNaN));
    }
    ArraySort.using = using;
})(ArraySort || (ArraySort = {}));
//# sourceMappingURL=Sort.js.map