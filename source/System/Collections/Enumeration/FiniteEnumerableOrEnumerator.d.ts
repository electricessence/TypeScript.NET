/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {FiniteEnumerator} from "./IEnumerator";
import FiniteEnumerableOrArrayLike from "../FiniteEnumerableOrArrayLike";

export type FiniteEnumerableOrEnumerator<T> = FiniteEnumerableOrArrayLike<T> | FiniteEnumerator<T>;

export default FiniteEnumerableOrEnumerator;