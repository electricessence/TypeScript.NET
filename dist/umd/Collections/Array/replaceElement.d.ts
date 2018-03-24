/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArrayLikeWritable from "./ArrayLikeWritable";
/**
 * Finds and replaces a value from an array.
 * Replaces all instances unless a max count is specified.
 * @param array
 * @param old
 * @param newValue
 * @param maxCount
 * @returns {number} The number of times replaced.
 */
export default function replaceElement<T>(array: ArrayLikeWritable<T>, old: T, newValue: T, maxCount?: number): number;
