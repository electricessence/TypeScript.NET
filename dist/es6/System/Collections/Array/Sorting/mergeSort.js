import { ArgumentNullException } from "../../../Exceptions/ArgumentNullException";
import { initialize } from "../Utility";
export function mergeSort(target) {
    if (!target)
        throw new ArgumentNullException("target");
    const len = target.length;
    return len < 2 ? target : sort(target, 0, len, initialize(len));
}
function sort(target, start, end, temp) {
    if (end - start > 1) {
        const middle = Math.floor((start + end) / 2);
        sort(target, start, middle, temp);
        sort(target, middle, end, temp);
        for (let i = 0, len = target.length; i < len; i++) {
            temp[i] = target[i];
        }
        let k = start, i = start, j = middle;
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