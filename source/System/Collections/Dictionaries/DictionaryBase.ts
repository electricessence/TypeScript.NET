/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IDictionary.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import {areEqual} from '../../Compare';
import EnumeratorBase from '../Enumeration/EnumeratorBase';
import ArgumentException from '../../Exceptions/ArgumentException';
import ArgumentNullException from '../../Exceptions/ArgumentNullException';
import InvalidOperationException from '../../Exceptions/InvalidOperationException';
import extractKeyValue from '../../KeyValueExtract';
import {forEach} from '../Enumeration/Enumerator';

const VOID0:any = void(0);

// Design Note: Should DictionaryAbstractBase be IDisposable?
abstract class DictionaryBase<TKey, TValue>
implements IDictionary<TKey, TValue>
{
	// This allows for batch updates in order to improve the efficiency of responsive systems.
	private _updateRecursion:number;

	constructor()
	{
		this._updateRecursion = 0;
	}

	get isUpdating():boolean { return this._updateRecursion!=0; }

	// Could implement an event dispatcher pattern here easily...
	onValueChanged:(key:TKey, value:TValue, old:TValue) => void;

	protected _onValueUpdate(key:TKey, value:TValue, old:TValue):void
	{
		if(!areEqual(value, old, true))
		{

			var _ = this;
			if(_.onValueChanged)
				_.onValueChanged(key, value, old);

			// If the update recursion is zero, then we are finished with updates.
			if(_._updateRecursion==0)
				_._onUpdated();

		}
	}

	// Listening to every value update can get noisy.  Here we allow for batch update signaling.
	// The consumer of this class can also wire up their own event system.
	onUpdated:() => void;

	private _onUpdated():void
	{
		var _ = this;
		if(_.onUpdated)
			_.onUpdated();
	}

	// Takes a closure that if returning true will propagate an update signal.
	handleUpdate(closure?:() => boolean):boolean
	{
		var _ = this, result:boolean;
		if(closure)
		{
			_._updateRecursion++;

			try
			{
				result = closure();
			}
			finally
			{
				_._updateRecursion--;
			}
		}
		else
			result = _._updateRecursion==0;

		if(result && _._updateRecursion==0)
			_._onUpdated();

		return result;
	}

	/////////////////////////////////////////
	// ICollection<T>
	/////////////////////////////////////////
	get isReadOnly():boolean { return false; }

	protected abstract getCount():number;

	get count():number { return this.getCount(); }

	add(item:KeyValuePair<TKey, TValue>):void
	{
		if(!item)
			throw new ArgumentNullException(
				'item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.'
			);

		extractKeyValue(item,
			(key, value)=>this.addByKeyValue(key, value));
	}

	clear():number
	{
		var _ = this, keys = _.keys, count = keys.length;

		if(count)
			_.handleUpdate(
				() =>
				{
					keys.forEach(key=> { _.removeByKey(key); });
					return true;
				}
			);

		if(_.count!=0) // After they've all been removed, then should be zero.
			console.warn("Dictionary clear() results in mismatched count.");

		return count;
	}

	contains(item:KeyValuePair<TKey, TValue>):boolean
	{
		// Should never have a null object in the collection.
		if(!item) return false;

		return extractKeyValue(item,
			(key, value)=>
			{
				// Leave as variable for debugging...
				let v = this.getValue(key);
				return areEqual(value, v);
			});

	}

	copyTo(array:IKeyValuePair<TKey, TValue>[], index:number = 0):IKeyValuePair<TKey, TValue>[]
	{
		if(!array) throw new ArgumentNullException('array');

		// This is a generic implementation that will work for all derived classes.
		// It can be overridden and optimized.
		var e = this.getEnumerator();
		while(e.moveNext()) // Disposes when finished.
		{
			array[index++] = e.current;
		}
		return array;
	}


	toArray():IKeyValuePair<TKey,TValue>[]
	{
		return this.copyTo([], 0);
	}

	remove(item:IKeyValuePair<TKey, TValue>|[TKey,TValue]):number
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


	addByKeyValue(key:TKey, value:TValue):void
	{
		var _ = this;
		if(_.containsKey(key))
		{
			var ex = new InvalidOperationException("Adding a key/value when the key already exists.");
			ex.data['key'] = key;
			ex.data['value'] = value;
			throw ex;
		}

		_.setValue(key, value);
	}

	abstract getValue(key:TKey):TValue;

	abstract setValue(key:TKey, value:TValue):boolean;

	containsKey(key:TKey):boolean
	{
		var value = this.getValue(key);
		return value!==VOID0;
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
		return this.setValue(key, undefined);
	}

	removeByValue(value:TValue):number
	{
		var _ = this, count = 0, equal:(a:any, b:any, strict?:boolean) => boolean = areEqual;
		_.keys.forEach(key=>
		{
			if(equal(_.getValue(key), value, true))
			{
				_.removeByKey(key);
				++count;
			}
		});
		return count;
	}

	importPairs(pairs:KeyValuePair<TKey, TValue>[]|IEnumerable<KeyValuePair<TKey, TValue>>):boolean
	{
		var _ = this;
		if(!pairs) return false;
		return _.handleUpdate(
			() =>
			{
				let changed:boolean = false;
				forEach(pairs,
					pair=>extractKeyValue(pair, (key, value)=>
					{
						_.setValue(key, value);
						changed = true;
					})
				);
				return changed;
			}
		);
	}

	getEnumerator():IEnumerator<IKeyValuePair<TKey, TValue>>
	{
		var _ = this;
		var keys:TKey[], len:number, i = 0;
		return new EnumeratorBase<IKeyValuePair<TKey, TValue>>(
			() =>
			{
				keys = _.keys;
				len = keys.length
			},

			(yielder)=>
			{
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