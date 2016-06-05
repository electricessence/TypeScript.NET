/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {areEqual} from "../../Compare";
import {IStringKeyDictionary, IMap} from "./IDictionary";
import {IKeyValuePair} from "../../KeyValuePair";
import {DictionaryBase} from "./DictionaryBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;

const VOID0:any = void 0;

export class StringKeyDictionary<TValue>
extends DictionaryBase<string, TValue> implements IStringKeyDictionary<TValue>
{

	private _count:number = 0;
	private _map:IMap<TValue> = {};

	protected _getEntry(key:string):IKeyValuePair<string,TValue>
	{
		return !this.containsKey(key)
			? null : {
			key: key,
			value: this.getValue(key)
		}
	}

	containsKey(key:string):boolean
	{
		if(key===null || key===VOID0 || !this._count) return false;
		return (key) in (this._map);
	}

	containsValue(value:TValue):boolean
	{
		if(!this._count) return false;
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
		if(key===null || key===VOID0 || !this._count) return VOID0;
		return this._map[key];
	}

	protected _setValueInternal(key:string, value:TValue):boolean
	{
		var _ = this, map = _._map, old = map[key];
		if(old!==value)
		{

			if(value===VOID0)
			{
				if((key) in (map))
				{
					delete map[key];
					_._count--;
				}
			}
			else
			{
				if(!map.hasOwnProperty(key))
					_._count++;
				map[key] = value;
			}

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
		if(_._count) for(let key in _._map)
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
		return Object.keys(this._map);
	}

	protected getValues():TValue[]
	{
		if(!this._count) return [];
		var result:any[] = Object.keys(this._map);
		for(let i = 0, len = result.length; i<len; i++)
		{
			result[i] = this._map[result[i]];
		}

		return result;
	}

	protected getCount():number
	{
		return this._count;
	}


}

export default StringKeyDictionary;
