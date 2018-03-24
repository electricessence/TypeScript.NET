/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import SumResult from "./SumResult";
import IAverageResult from "./IAverageResult";
export default class AverageResult extends SumResult implements IAverageResult {
    readonly average: number;
    constructor(source: ArrayLike<number>, ignoreNaN?: boolean);
}
