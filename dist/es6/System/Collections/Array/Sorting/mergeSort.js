/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * https://en.wikipedia.org/wiki/Merge_sort
 */
import { ArgumentNullException } from "../../../Exceptions/ArgumentNullException";
import { initialize } from "../Utility";
export function mergeSort(target) {
    if (!target)
        throw new ArgumentNullException("target");
    var len = target.length;
    return len < 2 ? target : sort(target, 0, len, initialize(len));
}
function sort(target, start, end, temp) {
    if (end - start > 1) {
        var middle = Math.floor((start + end) / 2);
        sort(target, start, middle, temp);
        sort(target, middle, end, temp);
        for (let i = 0, len = target.length; i < len; i++) {
            temp[i] = target[i];
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
//# sourceMappingURL=mergeSort.js.map