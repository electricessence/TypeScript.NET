/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { ActionWithIndex, PredicateWithIndex } from "../../FunctionTypes";
/**
 * Allows for using "false" to cause forEach to break.
 * Can also be applied to a structure that indexes like an array, but may not be.
 * @param source
 * @param action
 */
export default function forEachElement<T>(source: ArrayLike<T>, action: ActionWithIndex<T> | PredicateWithIndex<T>): void;
