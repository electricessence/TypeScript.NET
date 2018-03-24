/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ISumResult from "./ISumResult";
/**
 * Represents an immutable struct of the sum of a set of values.
 */
export default class SumResult implements ISumResult {
    readonly count: number;
    readonly sum: number;
    constructor(source: ArrayLike<number>, ignoreNaN?: boolean);
}
