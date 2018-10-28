/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import IReadOnlyCollection from "./IReadOnlyCollection";
import {FiniteEnumerator} from "./Enumeration/IEnumerator";
import {FiniteEnumerable} from "./Enumeration/IEnumerable";

export interface ICollection<T>
	extends IReadOnlyCollection<T>
{
	add(entry:T):this;

	remove(entry:T, max?:number):number;  // Number of times removed.
	clear():number;

	importEntries(entries:FiniteEnumerable<T> | ArrayLike<T> | FiniteEnumerator<T>):number;

	toArray():T[];
}

export default ICollection;