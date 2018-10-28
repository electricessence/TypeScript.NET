/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {FiniteIEnumerator} from "./IEnumerator";
import FiniteEnumerableOrArrayLike from "../FiniteEnumerableOrArrayLike";

export type FiniteEnumerableOrEnumerator<T> = FiniteEnumerableOrArrayLike<T> | FiniteIEnumerator<T>;

export default FiniteEnumerableOrEnumerator;