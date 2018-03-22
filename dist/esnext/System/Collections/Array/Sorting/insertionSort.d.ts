/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Primitive } from "../../../Primitive";
import { ArrayLikeWritable } from "../ArrayLikeWritable";
/**
 * https://en.wikipedia.org/wiki/Insertion_sort
 * @param target
 * @returns {T[]}
 */
export declare function insertionSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray;
