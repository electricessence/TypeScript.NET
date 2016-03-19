/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../FunctionTypes.d.ts"/>
///<reference path="../ILinkedListNode.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import {areEqual} from '../../Compare';
import Type from '../../Types';
import Functions from '../../Functions';
import DictionaryBase from './DictionaryBase';
import EnumeratorBase from '../Enumeration/EnumeratorBase';
import LinkedNodeList from '../LinkedNodeList';

const VOID0:any = void 0;

// LinkedList for Dictionary
class HashEntry<TKey, TValue>
implements ILinkedNode<HashEntry<TKey, TValue>>
{
	constructor(
		public key?:TKey,
		public value?:TValue,
		public previous?:HashEntry<TKey, TValue>,
		public next?:HashEntry<TKey, TValue>)
	{ }
}

// static utility methods
function callHasOwnProperty(target:any, key:string)
{
	return Object.prototype.hasOwnProperty.call(target, key);
}

function computeHashCode(obj:any):string
{
	if(obj===null) return "null";
	if(obj===VOID0) return "undefined";

	return (typeof obj.toString===Type.FUNCTION)
		? obj.toString()
		: Object.prototype.toString.call(obj);
}


export default
class Dictionary<TKey, TValue> extends DictionaryBase<TKey, TValue>
{
	private _count:number = 0;
	private _entries = new LinkedNodeList<HashEntry<TKey, TValue>>();
	private _buckets:IMap<HashEntry<TKey, TValue>[]> = {};

	constructor(private _compareSelector:Selector<TKey,any> = Functions.Identity)
	{
		super();
	}


	private setKV(key:TKey, value:TValue, allowOverwrite:boolean):boolean
	{
		var _           = this,
		    buckets     = _._buckets,
		    entries     = _._entries,
		    comparer    = _._compareSelector,

		    compareKey  = comparer(key),
		    hash:string = computeHashCode(compareKey), // TODO: need to find a way to guarantee hashing is a string?

		    entry:HashEntry<TKey, TValue>;

		if(callHasOwnProperty(buckets, hash))
		{
			var equal:(a:any, b:any, strict?:boolean) => boolean = areEqual;
			var array = buckets[hash];
			for(let i = 0; i<array.length; i++)
			{
				var old = array[i];
				if(comparer(old.key)===compareKey)
				{
					if(!allowOverwrite)
						throw new Error("Key already exists.");

					var changed = !equal(old.value, value);
					if(changed)
					{
						if(value===VOID0)
						{
							entries.removeNode(old);
							array.splice(i, 1);
							if(!array.length)
								delete buckets[hash];
							--_._count;
						}
						else
						{
							entry = new HashEntry<TKey, TValue>(key, value);
							entries.replace(old, entry);
							array[i] = entry;
						}

						_._onValueUpdate(key, value, old.value);
					}
					return changed;
				}
			}
			array.push(entry = entry || new HashEntry<TKey, TValue>(key, value));
		}
		else
		{
			if(value===VOID0)
			{
				if(allowOverwrite)
					return false;
				else
					throw new Error("Cannot add 'undefined' value.");
			}
			buckets[hash] = [entry = new HashEntry<TKey, TValue>(key, value)];
		}
		++_._count;
		entries.addNode(entry);
		_._onValueUpdate(key, value, undefined);
		return true;
	}

	addByKeyValue(key:TKey, value:TValue):void
	{
		this.setKV(key, value, false);
	}

	getValue(key:TKey):TValue
	{
		var buckets = this._buckets, comparer = this._compareSelector;
		var compareKey = comparer(key);
		var hash = computeHashCode(compareKey);
		if(!callHasOwnProperty(buckets, hash)) return undefined;

		var array = buckets[hash];
		for(let entry of array)
		{
			if(comparer(entry.key)===compareKey) return entry.value;
		}

		return undefined;
	}

	setValue(key:TKey, value:TValue):boolean
	{
		return this.setKV(key, value, true);
	}

	containsKey(key:TKey):boolean
	{
		var _ = this, buckets = _._buckets, comparer = _._compareSelector;
		var compareKey = comparer(key);
		var hash = computeHashCode(compareKey);
		if(!callHasOwnProperty(buckets, hash)) return false;

		var array = buckets[hash];
		for(let i = 0, len = array.length; i<len; i++)
		{
			if(comparer(array[i].key)===compareKey) return true;
		}

		return false;
	}


	clear():number
	{
		var _ = this, buckets = _._buckets, count = super.clear(); // Remove one by one to allow for signaling.

		// Ensure reset and clean...
		_._count = 0;
		for(let key in buckets)
		{
			if(buckets.hasOwnProperty(key))
				delete buckets[key];
		}

		_._entries.clear();

		return count;
	}

	protected getCount():number
	{
		return this._count;
	}

	getEnumerator():IEnumerator<IKeyValuePair<TKey, TValue>>
	{
		var _ = this, currentEntry:HashEntry<TKey, TValue>;

		return new EnumeratorBase<IKeyValuePair<TKey, TValue>>(
			() => { currentEntry = _._entries.first; },
			(yielder) =>
			{
				if(currentEntry!=null)
				{
					var result = {key: currentEntry.key, value: currentEntry.value};
					currentEntry = currentEntry.next;
					return yielder.yieldReturn(result);
				}
				return yielder.yieldBreak();
			}
		);
	}


	protected getKeys():TKey[]
	{
		var _ = this, result:TKey[] = [];
		var e = _._entries.first;
		while(e)
		{
			result.push(e.key);
			e = e.next;
		}
		return result;
	}

	protected getValues():TValue[]
	{
		var _ = this, result:TValue[] = [];
		var e = _._entries.first;
		while(e)
		{
			result.push(e.value);
			e = e.next;
		}
		return result;
	}

}
