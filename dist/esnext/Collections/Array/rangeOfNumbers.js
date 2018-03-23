/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import initArray from "./initializeArray";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
/**
 * Returns a range of numbers based upon the first value and the step value.
 * @param first
 * @param count
 * @param step
 * @returns {number[]}
 */
export default function rangeOfNumbers(first, count, step) {
    if (step === void 0) { step = 1; }
    if (!isFinite(first))
        throw new ArgumentOutOfRangeException('first', first);
    if (!isFinite(count))
        throw new ArgumentOutOfRangeException('count', count);
    if (!isFinite(step))
        throw new ArgumentOutOfRangeException('step', step);
    var result = initArray(count >= 0 ? count : 0);
    for (var i = 0; i < count; i++) {
        result[i] = first;
        first += step;
    }
    return result;
}
//# sourceMappingURL=rangeOfNumbers.js.map