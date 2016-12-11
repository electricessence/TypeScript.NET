/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function sum(source: ArrayLike<number>, ignoreNaN?: boolean): number;
export declare function average(source: ArrayLike<number>, ignoreNaN?: boolean): number;
export declare function product(source: ArrayLike<number>, ignoreNaN?: boolean): number;
/**
 * Takes the first number and divides it by all following.
 * @param source
 * @param ignoreNaN Will cause this skip any NaN values.
 * @returns {number}
 */
export declare function quotient(source: ArrayLike<number>, ignoreNaN?: boolean): number;
export declare function min(source: ArrayLike<number>, ignoreNaN?: boolean): number;
export declare function max(source: ArrayLike<number>, ignoreNaN?: boolean): number;
