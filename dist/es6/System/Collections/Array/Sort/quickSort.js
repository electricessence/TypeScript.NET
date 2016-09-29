/*!
 * @author electricessence / https://github.com/electricessence/
 * Special thanks to: Sebastian Belmar
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArgumentNullException } from "../../../Exceptions/ArgumentNullException";
export function quickSort(target, low = 0, high = target && (target.length - 1)) {
    if (!target)
        throw new ArgumentNullException("target");
    if (low < high) {
        var swap, pivotIndex = Math.floor((low + high) / 2);
        swap = target[pivotIndex];
        target[pivotIndex] = target[high];
        target[high] = swap;
        var i = low;
        for (let j = low; j < high; j++) {
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
//# sourceMappingURL=quickSort.js.map