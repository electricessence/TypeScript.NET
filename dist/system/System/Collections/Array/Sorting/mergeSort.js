/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * https://en.wikipedia.org/wiki/Merge_sort
 */
System.register(["../../../Exceptions/ArgumentNullException", "../Utility"], function (exports_1, context_1) {
    "use strict";
    var ArgumentNullException_1, Utility_1;
    var __moduleName = context_1 && context_1.id;
    /**
     * Merge internalSort O(n log (n))
     * Warning: Uses recursion.
     * @param target
     * @returns {number[]}
     */
    function mergeSort(target) {
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException("target");
        var len = target.length;
        return len < 2 ? target : sort(target, 0, len, Utility_1.initialize(len));
    }
    exports_1("mergeSort", mergeSort);
    function sort(target, start, end, temp) {
        if (end - start > 1) {
            // Step 1: Sort the left and right parts.
            var middle = Math.floor((start + end) / 2);
            sort(target, start, middle, temp);
            sort(target, middle, end, temp);
            // Step 2: Copy the original array
            for (var i_1 = 0, len = target.length; i_1 < len; i_1++) {
                temp[i_1] = target[i_1];
            }
            // Step 3: Create variables to traverse
            var k = start, i = start, j = middle;
            // Step 4: Merge: Move from the temp to target integers in order
            while (i < middle && j < end) {
                target[k++]
                    = temp[i] > temp[j]
                        ? temp[j++]
                        : temp[i++];
            }
            // Step 5: Finalize merging in case right side of the array is bigger.
            while (i < middle) {
                target[k++] = temp[i++];
            }
        }
        return target;
    }
    return {
        setters: [
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }
        ],
        execute: function () {/*!
             * @author Sebastian Belmar / https://github.com/sebabelmar/
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * https://en.wikipedia.org/wiki/Merge_sort
             */
        }
    };
});
//# sourceMappingURL=mergeSort.js.map