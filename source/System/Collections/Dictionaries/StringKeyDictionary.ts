/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IDictionary.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import {areEqual} from '../../Compare';
import DictionaryBase from './DictionaryBase';
import ArgumentNullException from '../../Exceptions/ArgumentNullException';

const VOID0:any = void 0;

export default
class StringKeyDictionary<TValue>
extends DictionaryBase<string, TValue> implements IStringKeyDictionary<TValue>
{
	private _count:number = 0;
	private _map:IMap<TValue> = {};


	containsKey(key:string):boolean
	{
		return (key)in(this._map);
	}

	containsValue(value:TValue):boolean
	{
		var map = this._map, equal:(a:any, b:any, strict?:boolean) => boolean = areEqual;
		for(let key in map)
		{
			if(map.hasOwnProperty(key) && equal(map[key], value))
				return true;
		}
		return false;
	}


	getValue(key:string):TValue
	{
		return this._map[key];
	}

	setValue(key:string, value:TValue):boolean
	{
		var _ = this, map = _._map, old = map[key];
		if(old!==value)
		{

			if(value===VOID0)
			{
				if((key)in(map))
				{
					delete map[key];
					--_._count;
				}
			}
			else
			{
				if(!((key)in(map)))
					++_._count;
				map[key] = value;
			}

			_._onValueUpdate(key, value, old);
			return true;
		}
		return false;
	}

	// Returns true if any value is updated...
	importMap(values:IMap<TValue>):boolean
	{
		var _ = this;
		return _.handleUpdate(
			() =>
			{
				var changed:boolean = false;
				for(let key in values)
				{
					if(values.hasOwnProperty(key) && _.setValue(key, values[key]))
						changed = true;
				}
				return changed;
			}
		);
	}

	toMap(selector?:(key:string, value:TValue) => TValue):IMap<TValue>
	{
		var _ = this, result:IMap<TValue> = {};
		for(let key in _._map)
		{
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
			{
				var value = _._map[key];
				if(selector)
					value = selector(key, value);
				if(value!==VOID0)
					result[key] = value;
			}
		}
		return result;
	}

	protected getKeys():string[]
	{

		var _ = this, result:string[] = [];
		for(let key in _._map)
		{
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
				result.push(key);
		}

		return result;

	}

	protected getValues():TValue[]
	{

		var _ = this, result:TValue[] = [];
		for(let key in _._map)
		{
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
				result.push(_._map[key]);
		}

		return result;
	}

	protected getCount():number
	{
		return this._count;
	}


}
