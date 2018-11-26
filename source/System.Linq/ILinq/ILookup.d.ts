/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IGrouping from "./IGrouping";
import IEnumerator from "../../System/Collections/Enumeration/IEnumerator";

export default interface ILookup<TKey, TElement>
{
	readonly count:number;

	get(key:TKey):TElement[] | null

	contains(key:TKey):boolean
	getEnumerator():IEnumerator<IGrouping<TKey, TElement>>
}