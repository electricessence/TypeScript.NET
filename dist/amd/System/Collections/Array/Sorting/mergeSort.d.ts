import { Primitive } from "../../../Primitive";
import { ArrayLikeWritable } from "../ArrayLikeWritable";
/**
 * Merge internalSort O(n log (n))
 * Warning: Uses recursion.
 * @param target
 * @returns {number[]}
 */
export declare function mergeSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray;
