/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { EqualityComparison } from "../../FunctionTypes";
export default function areArraysAllEqual(arrays: ArrayLike<ArrayLike<any>>, equalityComparer?: EqualityComparison<any>): boolean;
export default function areArraysAllEqual(arrays: ArrayLike<ArrayLike<any>>, strict: boolean, equalityComparer?: EqualityComparison<any>): boolean;
