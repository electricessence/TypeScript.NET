/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * https://en.wikipedia.org/wiki/Merge_sort
 */
import { Primitive } from "../../../Primitive";
import { ArrayLikeWritable } from "../ArrayLikeWritable";
/**
 * Merge internalSort O(n log (n))
 * Warning: Uses recursion.
 * @param target
 * @returns {number[]}
 */
export declare function mergeSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray;
