/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import System = require('../../System');
import DictionaryAbstractBase = require('DictionaryAbstractBase');

class StringKeyDictionary<TValue>
extends DictionaryAbstractBase<string, TValue> implements IStringKeyDictionary<TValue>
{
	private _count:number = 0;
	private _map:IMap<TValue> = {};


	containsKey(key:string):boolean {
		return key in this._map;
	}

	containsValue(value:TValue):boolean {
		var map = this._map, equal:(a:any, b:any, strict?:boolean) => boolean = System.areEqual;
		for(var key in map) {
			if(map.hasOwnProperty(key) && equal(map[key], value))
				return true;
		}
		return false;
	}


	get(key:string):TValue {
		return this._map[key];
	}

	set(key:string, value:TValue):boolean {
		var _ = this, map = _._map, old = map[key];
		if(old!==value) {

			if(value===undefined) {
				if(key in map) {
					delete map[key];
					--_._count;
				}
			}
			else {
				if(!(key in map))
					++_._count;
				map[key] = value;
			}

			_._onValueUpdate(key, value, old);
			return true;
		}
		return false;
	}

	// Returns true if any value is updated...
	importMap(values:IMap<TValue>):boolean {
		var _ = this;
		return _.handleUpdate(
			() => {
				var changed:boolean = false;
				for(var key in values) {
					if(values.hasOwnProperty(key) && _.set(key, values[key]))
						changed = true;
				}
				return changed;
			}
		);
	}

	toMap(selector?:(key:string, value:TValue) => TValue):IMap<TValue> {
		var _ = this, result:IMap<TValue> = {};
		for(var key in _._map) {
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
			{
				var value = _._map[key];
				if(selector)
					value = selector(key, value);
				if(value!==undefined)
					result[key] = value;
			}
		}
		return result;
	}

	get keys():string[] {

		var _ = this, result:string[] = [];
		for(var key in _._map) {
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
				result.push(key);
		}

		return result;

	}

	get values():TValue[] {

		var _ = this, result:TValue[] = [];
		for(var key in _._map) {
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
				result.push(_._map[key]);
		}

		return result;
	}

	get count():number {
		return this._count;
	}

}

export = StringKeyDictionary;