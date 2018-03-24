/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import AverageResult from "./AverageResult";
export function average(source, ignoreNaN) {
    if (ignoreNaN === void 0) { ignoreNaN = false; }
    return new AverageResult(source, ignoreNaN).average;
}
//# sourceMappingURL=average.js.map