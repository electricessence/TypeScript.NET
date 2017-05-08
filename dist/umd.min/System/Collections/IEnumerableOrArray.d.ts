/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerable} from "./Enumeration/IEnumerable";

export declare type IEnumerableOrArray<T> =  ArrayLike<T> | IEnumerable<T>;

export default IEnumerableOrArray;