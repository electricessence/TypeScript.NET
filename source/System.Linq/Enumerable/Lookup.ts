/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {EnumeratorBase} from "../../System/Collections/Enumeration/EnumeratorBase";
import {Grouping, GroupingConstructor} from "../Interfaces/Grouping";
import IDictionary from "../../System/Collections/Dictionaries/IDictionary";
import IEnumerator from "../../System/Collections/Enumeration/IEnumerator";
import KeyValuePair from "../../System/KeyValuePair";

export class Lookup<TKey, TElement>
{
	constructor(
		private _groupingConstructor:GroupingConstructor<TKey,TElement>,
		private _dictionary:IDictionary<TKey, TElement[]>)
	{
	}

	get count():number
	{
		return this._dictionary.count;
	}

	get(key:TKey):TElement[] | null
	{
		return this._dictionary.getValue(key) || null;
	}

	contains(key:TKey):boolean
	{
		return this._dictionary.containsKey(key);
	}

	getEnumerator():IEnumerator<Grouping<TKey, TElement>>
	{

		const _ = this;
		let enumerator:IEnumerator<KeyValuePair<TKey, TElement[]>>;

		return new EnumeratorBase<Grouping<TKey, TElement>>(
			() => {
				enumerator = _._dictionary.getEnumerator();
			},
			(yielder) => {

				if(!enumerator.moveNext())
					return false;

				let current = <KeyValuePair<TKey, TElement[]>>enumerator.current;
				return yielder.yieldReturn(new this._groupingConstructor(current.key, current.value));
			},
			() => {
				if(enumerator) enumerator.dispose();
				enumerator = <any>null;
			}
		);
	}

}
