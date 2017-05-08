/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {IIterator} from "./IIterator";
import {IEnumerator} from "./IEnumerator";
import {IEnumerableOrArray} from "../IEnumerableOrArray";

export type ForEachEnumerable<T> = IEnumerableOrArray<T>|IEnumerator<T>|IIterator<T>;

export default ForEachEnumerable;