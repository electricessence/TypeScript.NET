/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * https://en.wikipedia.org/wiki/Merge_sort
 */
System.register(["../../../Exceptions/ArgumentNullException", "../Utility"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentNullException_1, Utility_1;
    function mergeSort(target) {
        if (!target)
            throw new ArgumentNullException_1.ArgumentNullException("target");
        var len = target.length;
        return len < 2 ? target : sort(target, 0, len, Utility_1.initialize(len));
    }
    exports_1("mergeSort", mergeSort);
    function sort(target, start, end, temp) {
        if (end - start > 1) {
            var middle = Math.floor((start + end) / 2);
            sort(target, start, middle, temp);
            sort(target, middle, end, temp);
            for (var i_1 = 0, len = target.length; i_1 < len; i_1++) {
                temp[i_1] = target[i_1];
            }
            var k = start, i = start, j = middle;
            while (i < middle && j < end) {
                target[k++]
                    = temp[i] > temp[j]
                        ? temp[j++]
                        : temp[i++];
            }
            while (i < middle) {
                target[k++] = temp[i++];
            }
        }
        return target;
    }
    return {
        setters:[
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=mergeSort.js.map