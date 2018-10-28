/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {FiniteIEnumerable} from "./Enumeration/IEnumerable";

declare type FiniteEnumerableOrArrayLike<T> = FiniteIEnumerable<T> | ArrayLike<T>;

export default FiniteEnumerableOrArrayLike;