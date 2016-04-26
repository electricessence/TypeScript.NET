/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../FunctionTypes.d.ts"/>
///<reference path="../ILinkedListNode.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import {areEqual} from "../../Compare";
import Type from "../../Types";
import Functions from "../../Functions";
import DictionaryBase from "./DictionaryBase";
import EnumeratorBase from "../Enumeration/EnumeratorBase";
import LinkedNodeList from "../LinkedNodeList";

const VOID0:any = void 0;

// LinkedList for Dictionary
class HashEntry<TKey, TValue>
implements ILinkedNode<HashEntry<TKey, TValue>>, IKeyValuePair<TKey,TValue>
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

function getHashString(obj:any):string
{
	if(obj===null) return "null";
	if(obj===VOID0) return "undefined";

	// See IHashable.
	if(Type.hasMemberOfType(obj,"getHashCode",Type.FUNCTION))
	{
		return obj.getHashCode();
	}

	return (typeof obj.toString==Type.FUNCTION)
		? obj.toString()
		: Object.prototype.toString.call(obj);
}


export default
class Dictionary<TKey, TValue> extends DictionaryBase<TKey, TValue>
{
	// Retains the order...
	private _entries:LinkedNodeList<HashEntry<TKey, TValue>>;
	private _buckets:IMap<LinkedNodeList<HashEntry<TKey, HashEntry<TKey, TValue>>>>;

	constructor(
		private _keyComparer:Selector<TKey,any> = Functions.Identity)
	{
		super();
		this._entries = new LinkedNodeList<HashEntry<TKey, TValue>>();
		this._buckets = {};
	}

	private _count:number = 0;

	protected getCount():number
	{
		return this._count;
	}


	private _getBucket(
		hash:string,
		createIfMissing?:boolean):LinkedNodeList<HashEntry<TKey,HashEntry<TKey,TValue>>>
	{
		if(hash===null || hash===VOID0 || !createIfMissing && !this._count)
			return null;

		var buckets = this._buckets;
		var bucket = callHasOwnProperty(buckets, hash) ? buckets[hash] : VOID0;

		if(createIfMissing && !bucket)
			buckets[hash]
				= bucket
				= new LinkedNodeList<HashEntry<TKey,HashEntry<TKey,TValue>>>();

		return bucket;
	}

	private _getBucketEntry(
		key:TKey,
		hash?:string,
		bucket?:LinkedNodeList<HashEntry<TKey,HashEntry<TKey,TValue>>>):HashEntry<TKey,HashEntry<TKey,TValue>>
	{
		if(key===null || key===VOID0 || !this._count)
			return null;

		var _          = this,
		    comparer   = _._keyComparer,
		    compareKey = comparer(key);

		if(!bucket) bucket = _._getBucket(hash || getHashString(compareKey));

		return bucket && bucket
				.find(e=>comparer(e.key)===compareKey);
	}

	protected _getEntry(key:TKey):HashEntry<TKey,TValue>
	{
		var e = this._getBucketEntry(key);
		return e && e.value;
	}

	getValue(key:TKey):TValue
	{
		var e = this._getEntry(key);
		return e ? e.value : VOID0;
	}

	protected _setValueInternal(key:TKey, value:TValue):boolean
	{
		var _           = this,
		    buckets = _._buckets,
		    entries     = _._entries,
		    comparer    = _._keyComparer,
		    compareKey  = comparer(key),
		    hash        = getHashString(compareKey),
		    bucket      = _._getBucket(hash),
		    bucketEntry = bucket && _._getBucketEntry(key, hash, bucket);

		// Entry exits? Delete or update
		if(bucketEntry)
		{
			if(value===VOID0)
			{
				let x = bucket.removeNode(bucketEntry),
				    y = entries.removeNode(bucketEntry.value);

				if(y) _._count--;
				if(x && !bucket.count) delete buckets[hash];

				if(x!==y) throw "Entries and buckets are out of sync.";

				if(x) return true;
			}
			else
			{
				// We don't expose the internal hash entries so replacing the value is ok.
				var old = bucketEntry.value.value;
				bucketEntry.value.value = value;
				return !areEqual(value,old);
			}

		}
		else if(value!==VOID0) {
			if(!bucket) bucket = _._getBucket(hash,true);
			let entry = new HashEntry(key,value);
			entries.addNode(entry);
			bucket.addNode(new HashEntry(key,entry));
			_._count++;
			return true;
		}

		return false;
	}

	protected _clearInternal():number
	{
		var _ = this, buckets = _._buckets;

		// Ensure reset and clean...
		_._count = 0;
		for(let key in buckets)
		{
			if(buckets.hasOwnProperty(key))
			{
				let bucket = buckets[key];
				delete buckets[key];
				bucket.clear();
			}
		}

		return _._entries.clear();
	}

	/*
	 * Note: super.getEnumerator() works perfectly well,
	 * but enumerating the internal linked node list is much more efficient.
	 */
	getEnumerator():IEnumerator<IKeyValuePair<TKey, TValue>>
	{
		var _ = this, ver:number, currentEntry:HashEntry<TKey, TValue>;

		return new EnumeratorBase<IKeyValuePair<TKey, TValue>>(
			() =>
			{
				ver = _._version;
				currentEntry = _._entries.first;
			},
			(yielder) =>
			{
				if(currentEntry!=null)
				{
					_.assertVersion(ver);
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
