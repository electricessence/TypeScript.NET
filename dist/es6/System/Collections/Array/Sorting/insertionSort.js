/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArgumentNullException } from "../../../Exceptions/ArgumentNullException";
/**
 * https://en.wikipedia.org/wiki/Insertion_sort
 * @param target
 * @returns {T[]}
 */
export function insertionSort(target) {
    if (!target)
        throw new ArgumentNullException("target");
    const len = target.length;
    for (let i = 1; i < len; i++) {
        let j = i, j1;
        while (j > 0 && target[(j1 = j - 1)] > target[j]) {
            let swap = target[j];
            target[j] = target[j1];
            target[j1] = swap;
            j--;
        }
    }
    return target;
}
//# sourceMappingURL=insertionSort.js.map