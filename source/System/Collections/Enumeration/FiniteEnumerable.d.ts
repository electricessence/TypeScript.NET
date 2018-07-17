/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IFiniteEnumerator from "./IEnumerator";
import IFiniteEnumerableOrArray from "../IEnumerableOrArray";

export type FiniteEnumerable<T> = IFiniteEnumerableOrArray<T>|IFiniteEnumerator<T>;

export default FiniteEnumerable;