/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArrayLikeWritable } from "./ArrayLikeWritable";
/**
 *
 * @param source
 * @param sourceIndex
 * @param length
 * @returns {any}
 */
export declare function copy<T>(source: ArrayLike<T>, sourceIndex?: number, length?: number): T[];
/**
 * Copies one array to another.
 * @param source
 * @param destination
 * @param sourceIndex
 * @param destinationIndex
 * @param length An optional limit to stop copying.
 * @returns The destination array.
 */
export declare function copyTo<T, TDestination extends ArrayLikeWritable<T>>(source: ArrayLike<T>, destination: TDestination, sourceIndex?: number, destinationIndex?: number, length?: number): TDestination;
