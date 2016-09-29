/*!
 * @author electricessence / https://github.com/electricessence/
 * Special thanks to: Sebastian Belmar
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../../Exceptions/ArgumentNullException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentNullException_1;
    function quickSort(target, low, high) {
        if (low === void 0) { low = 0; }
        if (high === void 0) { high = target && (target.length - 1); }
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
    exports_1("quickSort", quickSort);
    return {
        setters:[
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=quickSort.js.map