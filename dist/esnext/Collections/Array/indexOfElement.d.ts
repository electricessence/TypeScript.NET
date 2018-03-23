/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { EqualityComparison } from "../../FunctionTypes";
/**
 * Checks to see where the provided array contains an item/value.
 * If the array value is null, then -1 is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {number}
 */
export default function indexOfElement<T>(array: ArrayLike<T>, item: T, equalityComparer?: EqualityComparison<T>): number;
