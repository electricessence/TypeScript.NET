/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IReadOnlyCollection} from "./IReadOnlyCollection";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import {IEnumerator} from "./Enumeration/IEnumerator";

export interface ICollection<T> extends IReadOnlyCollection<T>
{
	add(entry:T):this;
	remove(entry:T, max?:number):number;  // Number of times removed.
	clear():number;

	importEntries(entries:IEnumerableOrArray<T>|IEnumerator<T>):number;
	toArray():T[];
}

export default ICollection;