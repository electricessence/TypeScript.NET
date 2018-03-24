/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import SumResult from "./SumResult";
/**
 * Sums the values of a set of numbers.
 * @param {ArrayLike<number>} source
 * @param {boolean} ignoreNaN
 * @returns {number}
 */
export function sum(source, ignoreNaN) {
    if (ignoreNaN === void 0) { ignoreNaN = false; }
    return new SumResult(source, ignoreNaN).sum;
}
//# sourceMappingURL=sum.js.map