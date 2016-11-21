System.register(["../../../Exceptions/ArgumentNullException"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Quick sort O(n log (n))
     * Warning: Uses recursion.
     * @param target
     * @returns {T[]}
     */
    function quickSort(target) {
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException("target");
        var len = target.length;
        return target.length < 2 ? target : sort(target, 0, len - 1);
    }
    exports_1("quickSort", quickSort);
    function sort(target, low, high) {
        if (low < high) {
            // Partition first...
            var swap = void 0;
            var pivotIndex = Math.floor((low + high) / 2);
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
            sort(target, low, i - 1);
            sort(target, i + 1, high);
        }
        return target;
    }
    var ArgumentNullException_1;
    return {
        setters: [
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=quickSort.js.map