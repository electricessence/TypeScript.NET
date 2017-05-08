/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../../Exceptions/ArgumentNullException"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * https://en.wikipedia.org/wiki/Insertion_sort
     * @param target
     * @returns {T[]}
     */
    function insertionSort(target) {
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException("target");
        var len = target.length;
        for (var i = 1; i < len; i++) {
            var j = i, j1 = void 0;
            while (j > 0 && target[(j1 = j - 1)] > target[j]) {
                var swap = target[j];
                target[j] = target[j1];
                target[j1] = swap;
                j--;
            }
        }
        return target;
    }
    exports_1("insertionSort", insertionSort);
    var ArgumentNullException_1;
    return {
        setters: [
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
        }
    };
});
//# sourceMappingURL=insertionSort.js.map