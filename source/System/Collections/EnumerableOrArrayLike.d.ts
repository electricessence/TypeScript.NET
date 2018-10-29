/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IEnumerable from "./Enumeration/IEnumerable";

declare type EnumerableOrArrayLike<T> =  IEnumerable<T> | ArrayLike<T>;

export default EnumerableOrArrayLike;