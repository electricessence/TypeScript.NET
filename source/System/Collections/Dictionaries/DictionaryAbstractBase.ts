/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IDictionary"/>
import Values = require('../../Compare');
import EnumeratorBase = require('../Enumeration/EnumeratorBase');
import NotImplementedException = require('../../Exceptions/NotImplementedException');

'use strict';


// Design Note: Should DictionaryAbstractBase be IDisposable?
class DictionaryAbstractBase<TKey, TValue> implements IDictionary<TKey, TValue>
{
	// This allows for batch updates in order to improve the efficiency of responsive systems.
	private _updateRecursion:number = 0;

	get isUpdating():boolean { return this._updateRecursion!=0; }

	// Could implement an event dispatcher pattern here easily...
	public onValueChanged:(key:TKey, value:TValue, old:TValue) => void;

	// Pseudo-protected.
	public _onValueUpdate(key:TKey, value:TValue, old:TValue):void
	{
		if(!Values.areEqual(value, old, true))
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
	public onUpdated:() => void;

	private _onUpdated():void
	{
		var _ = this;
		if(_.onUpdated)
			_.onUpdated();
	}

	// Takes a closure that if returning true will propagate an update signal.
	public handleUpdate(closure?:() => boolean):boolean
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

	get count():number {
		return notImplementedException("count");
	}

	add(item:IKeyValuePair<TKey, TValue>):void
	{
		this.addByKeyValue(item.key, item.value);
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

	contains(item:IKeyValuePair<TKey, TValue>):boolean
	{
		var value = this.getValue(item.key);
		return Values.areEqual(value, item.value);
	}

	copyTo(array:IKeyValuePair<TKey, TValue>[], index:number = 0):void
	{
		var e = this.getEnumerator();
		while(e.moveNext()) // Disposes when finished.
		{
			array[index++] = e.current;
		}
	}

	remove(item:IKeyValuePair<TKey, TValue>):number
	{
		var key = item.key, value = this.getValue(key);
		return (Values.areEqual(value, item.value) && this.removeByKey(key))
			? 1 : 0;
	}

	/////////////////////////////////////////
	// IDictionary<TKey,TValue>
	/////////////////////////////////////////
	get keys():TKey[] { return notImplementedException("keys"); }

	get values():TValue[] { return notImplementedException("values"); }


	addByKeyValue(key:TKey, value:TValue):void
	{
		var _ = this;
		if(_.containsKey(key))
			throw new Error("Adding key/value when one already exists.");

		_.setValue(key, value);
	}

	getValue(key:TKey):TValue
	{
		return notImplementedException(
			"getValue(key: TKey): TValue", "When calling for key: " + key
		);
	}

	setValue(key:TKey, value:TValue):boolean
	{
		return notImplementedException(
			"setValue(key: TKey, value: TValue): boolean", "When setting " + key + ":" + value + "."
		);
	}

	containsKey(key:TKey):boolean
	{
		var value = this.getValue(key);
		return value!==undefined;
	}

	containsValue(value:TValue):boolean
	{
		var e = this.getEnumerator(), equal:(a:any, b:any, strict?:boolean) => boolean = Values.areEqual;

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
		var _ = this, count = 0, equal:(a:any, b:any, strict?:boolean) => boolean = Values.areEqual;
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

	importPairs(pairs:IKeyValuePair<TKey, TValue>[]):boolean
	{
		var _ = this;
		return _.handleUpdate(
			() =>
			{
				var changed:boolean = false;
				pairs.forEach(
						pair=>
					{
						_.setValue(pair.key, pair.value);
						changed = true;
					}
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
					if(value!==undefined) // Still valid?
						return yielder.yieldReturn({key: key, value: value});
				}

				return yielder.yieldBreak();
			}
		);
	}


}

function notImplementedException<T>(name:string, log:string = ""):any
{
	console.log("DictionaryAbstractBase sub-class has not overridden " + name + ". " + log);
	throw new NotImplementedException("DictionaryAbstractBase." + name + ": Not implemented.");
}

export = DictionaryAbstractBase;
