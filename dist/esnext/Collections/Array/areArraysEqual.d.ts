/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { EqualityComparison } from "../../FunctionTypes";
/**
 * Compares two arrays for equality (does not recurse).
 * @param a
 * @param b
 * @param equalityComparer
 */
export default function areArraysEqual<T>(a: ArrayLike<T>, b: ArrayLike<T>, equalityComparer?: EqualityComparison<T>): boolean;
export default function areArraysEqual<T>(a: ArrayLike<T>, b: ArrayLike<T>, strict: boolean, equalityComparer?: EqualityComparison<T>): boolean;
