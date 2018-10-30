/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Grouping} from "./Grouping";
import IEnumerator from "../../System/Collections/Enumeration/IEnumerator";

export default interface Lookup<TKey, TElement>
{
	readonly count:number;

	get(key:TKey):TElement[] | null

	contains(key:TKey):boolean
	getEnumerator():IEnumerator<Grouping<TKey, TElement>>
}