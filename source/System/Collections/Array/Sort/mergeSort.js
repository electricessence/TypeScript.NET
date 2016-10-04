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
    function mergeSort(target, low, high) {
        if (low === void 0) { low = 0; }
        if (high === void 0) { high = target && (target.length - 1) || 0; }
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException("target");
        if (low < high) {
            var middle = Math.floor((low + high) / 2);
            var i = low, j = middle + 1, k = low;
            mergeSort(target, low, middle);
            mergeSort(target, j, high);
            var temp = target.slice();
            while (i <= middle && j <= high) {
                target[k++]
                    = temp[i] > temp[j]
                        ? temp[j++]
                        : temp[i++];
            }
            while (i <= middle) {
                target[k++] = temp[i++];
            }
        }
        return target;
    }
    exports.mergeSort = mergeSort;
});
//# sourceMappingURL=mergeSort.js.map