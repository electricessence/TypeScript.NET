/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IFiniteEnumerable} from "./Enumeration/IEnumerable";

export declare type IFiniteEnumerableOrArray<T> = ArrayLike<T> | IFiniteEnumerable<T>;

export default IFiniteEnumerableOrArray;