/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { PredicateWithIndex } from "../../FunctionTypes";
/**
 * Returns the first index of which the provided predicate returns true.
 * Returns -1 if always false.
 * @param array
 * @param predicate
 * @returns {number}
 */
export declare function findIndex<T>(array: ArrayLike<T>, predicate: PredicateWithIndex<T>): number;
