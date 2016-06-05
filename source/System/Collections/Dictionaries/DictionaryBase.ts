/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {areEqual} from "../../Compare";
import {forEach} from "../Enumeration/Enumerator";
import {CollectionBase} from "../CollectionBase";
import {EnumeratorBase} from "../Enumeration/EnumeratorBase";
import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {InvalidOperationException} from "../../Exceptions/InvalidOperationException";
import {extractKeyValue} from "../../KeyValueExtract";
import {IKeyValuePair, KeyValuePair} from "../../KeyValuePair";
import {IDictionary} from "./IDictionary";
import {IEnumerator} from "../Enumeration/IEnumerator";
import {IEnumerableOrArray} from "../IEnumerableOrArray";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;

const VOID0:any = void(0);

// Design Note: Should DictionaryAbstractBase be IDisposable?
export abstract class DictionaryBase<TKey, TValue>
extends CollectionBase<IKeyValuePair<TKey,TValue>> implements IDictionary<TKey, TValue>
{
	constructor(source?:IEnumerableOrArray<IKeyValuePair<TKey,TValue>>)
	{
		super(source);
	}


	protected _onValueModified(key:TKey, value:TValue, old:TValue):void
	{
	}

	protected _addInternal(item:KeyValuePair<TKey, TValue>):boolean
	{
		if(!item)
			throw new ArgumentNullException(
				'item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.'
			);

		return extractKeyValue(item,
			(key, value)=>this.addByKeyValue(key, value));
	}

	protected _clearInternal():number
	{
		var _ = this, count = 0;

		for(let key of _.keys)
		{
			if(_.removeByKey(key)) count++;
		}

		return count;
	}

	contains(item:KeyValuePair<TKey, TValue>):boolean
	{
		// Should never have a null object in the collection.
		if(!item || !this.getCount()) return false;

		return extractKeyValue(item,
			(key, value)=>
			{
				// Leave as variable for debugging...
				let v = this.getValue(key);
				return areEqual(value, v);
			});

	}

	protected _removeInternal(item:IKeyValuePair<TKey, TValue>|[TKey,TValue]):number
	{
		if(!item) return 0;

		return extractKeyValue(item,
			(key, value)=>
			{
				// Leave as variable for debugging...
				let v = this.getValue(key);
				return (areEqual(value, v) && this.removeByKey(key))
					? 1 : 0;
			});
	}

	/////////////////////////////////////////
	// IDictionary<TKey,TValue>
	/////////////////////////////////////////

	protected abstract getKeys():TKey[];

	get keys():TKey[] { return this.getKeys(); }

	protected abstract getValues():TValue[];

	get values():TValue[] { return this.getValues(); }


	addByKeyValue(key:TKey, value:TValue):boolean
	{
		if(value===VOID0)
			throw new InvalidOperationException("Cannot add 'undefined' as a value.");

		var _ = this;
		if(_.containsKey(key))
		{
			var ex = new InvalidOperationException("Adding a key/value when the key already exists.");
			ex.data['key'] = key;
			ex.data['value'] = value;
			throw ex;
		}

		return _.setValue(key, value);
	}

	protected abstract _getEntry(key:TKey):IKeyValuePair<TKey,TValue>;

	abstract getValue(key:TKey):TValue;

	protected abstract _setValueInternal(key:TKey, value:TValue):boolean;

	setValue(key:TKey, value:TValue):boolean
	{
		// setValue shouldn't need to worry about recursion...
		var _ = this;
		_.assertModifiable();

		var changed = false, old = _.getValue(key); // get the old value here and pass to internal.
		if(!areEqual(value, old) && _._setValueInternal(key, value))
		{
			changed = true;
			_._onValueModified(key, value, old)
		}

		_._signalModification(changed);
		return changed;
	}

	containsKey(key:TKey):boolean
	{
		return !!this._getEntry(key);
	}

	containsValue(value:TValue):boolean
	{
		var e = this.getEnumerator(), equal:(a:any, b:any, strict?:boolean) => boolean = areEqual;

		while(e.moveNext())
		{
			if(equal(e.current, value, true))
			{
				e.dispose();
				return true;
			}
		}
		return false;
	}

	removeByKey(key:TKey):boolean
	{
		return this.setValue(key, VOID0);
	}

	removeByValue(value:TValue):number
	{
		var _ = this, count = 0, equal:(a:any, b:any, strict?:boolean) => boolean = areEqual;
		for(let key of _.getKeys())
		{
			if(equal(_.getValue(key), value, true))
			{
				_.removeByKey(key);
				count++;
			}
		}
		return count;
	}

	importEntries(pairs:IEnumerableOrArray<KeyValuePair<TKey, TValue>>):number
	{
		// Allow piping through to trigger onModified properly.
		return super.importEntries(<any>pairs);
	}

	protected _importEntries(pairs:IEnumerableOrArray<KeyValuePair<TKey, TValue>>):number
	{
		var _ = this;
		if(!pairs) return 0;
		let changed:number = 0;
		forEach(pairs,
			pair=>extractKeyValue(pair, (key, value)=>
			{
				if(_._setValueInternal(key, value))
					changed++;
			})
		);
		return changed;
	}

	getEnumerator():IEnumerator<IKeyValuePair<TKey, TValue>>
	{
		var _ = this;
		var ver:number, keys:TKey[], len:number, i = 0;
		return new EnumeratorBase<IKeyValuePair<TKey, TValue>>(
			() =>
			{
				ver = _._version; // Track the version since getKeys is a copy.
				keys = _.getKeys();
				len = keys.length;
			},

			(yielder)=>
			{
				_.assertVersion(ver);

				while(i<len)
				{
					var key = keys[i++], value = _.getValue(key);
					if(value!==VOID0) // Still valid?
						return yielder.yieldReturn({key: key, value: value});
				}

				return yielder.yieldBreak();
			}
		);
	}


}


export default DictionaryBase;