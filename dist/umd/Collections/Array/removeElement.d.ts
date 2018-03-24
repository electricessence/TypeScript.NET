/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { EqualityComparison } from "../../FunctionTypes";
/**
 * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
 * @param array
 * @param value
 * @param maxCount
 * @param {function?} equalityComparer
 * @returns {number} The number of times the value was found and removed.
 */
export default function removeElement<T>(array: T[], value: T, maxCount?: number, equalityComparer?: EqualityComparison<T>): number;
