/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArrayLikeWritable from "./ArrayLikeWritable";
import { EqualityComparison } from "../../FunctionTypes";
/**
 * Ensures a value exists within an array.  If not found, adds to the end.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export default function registerElement<T>(array: ArrayLikeWritable<T>, item: T, equalityComparer?: EqualityComparison<T>): boolean;
