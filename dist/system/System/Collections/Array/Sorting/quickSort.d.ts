import { Primitive } from "../../../Primitive";
import { ArrayLikeWritable } from "../ArrayLikeWritable";
/**
 * Quick internalSort O(n log (n))
 * Warning: Uses recursion.
 * @param target
 * @returns {T[]}
 */
export declare function quickSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray;
