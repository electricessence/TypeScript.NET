/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArgumentNullException_1 = require("../../../Exceptions/ArgumentNullException");
    function quickSort(target, low, high) {
        if (low === void 0) { low = 0; }
        if (high === void 0) { high = target && (target.length - 1) || 0; }
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException("target");
        if (low < high) {
            var swap, pivotIndex = Math.floor((low + high) / 2);
            swap = target[pivotIndex];
            target[pivotIndex] = target[high];
            target[high] = swap;
            var i = low;
            for (var j = low; j < high; j++) {
                if (target[j] < target[high]) {
                    swap = target[i];
                    target[i] = target[j];
                    target[j] = swap;
                    i++;
                }
            }
            swap = target[i];
            target[i] = target[high];
            target[high] = swap;
            quickSort(target, low, i - 1);
            quickSort(target, i + 1, high);
        }
        return target;
    }
    exports.quickSort = quickSort;
});
//# sourceMappingURL=quickSort.js.map