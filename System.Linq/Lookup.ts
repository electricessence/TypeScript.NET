/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="ILookup"/>
import DisposeUtility = require('../System/Disposable/Utility');
import Dictionary = require('../System/Collections/Dictionaries/Dictionary');
import EnumeratorBase = require('../System/Collections/Enumeration/EnumeratorBase');
import Grouping= require('./Grouping');


class Lookup<TKey, TElement> implements ILookup<TKey, TElement>
{

	constructor(private _dictionary:Dictionary<TKey, TElement[]>) { }

	get count():number
	{
		return this._dictionary.count;
	}

	get(key:TKey):TElement[]
	{
		return this._dictionary.get(key);
	}

	contains(key:TKey):boolean
	{
		return this._dictionary.containsKey(key);
	}

	getEnumerator():IEnumerator<Grouping<TKey, TElement>>
	{

		var _ = this;
		var enumerator:IEnumerator<IKeyValuePair<TKey, TElement[]>>;

		return new EnumeratorBase<Grouping<TKey, TElement>>(
			() => { enumerator = _._dictionary.getEnumerator(); },
				yielder =>
			{

				if(!enumerator.moveNext())
					return false;

				var current = enumerator.current;

				return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
			},
			() => { DisposeUtility.dispose(enumerator); }
		);
	}

}


export = Lookup;