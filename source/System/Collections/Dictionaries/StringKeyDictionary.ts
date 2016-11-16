/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import {areEqual} from "../../Compare";
import {IStringKeyDictionary, IMap} from "./IDictionary";
import {IKeyValuePair} from "../../KeyValuePair";
import {DictionaryBase} from "./DictionaryBase";
import __extendsImport from "../../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:undefined = void 0;

export class StringKeyDictionary<TValue>
extends DictionaryBase<string, TValue> implements IStringKeyDictionary<TValue>
{

	protected _onDispose() {
		super._onDispose();
		(<any>this)._map = null;
	}

	private _count:number = 0;
	private readonly _map:IMap<TValue> = {};

	protected _getEntry(key:string):IKeyValuePair<string,TValue>|null
	{
		return !this.containsKey(key)
			? null : {
			key: key,
			value: this.getAssuredValue(key)
		}
	}

	containsKey(key:string):boolean
	{
		return key!==null
			&& key!==VOID0
			&& this._count!=0
			&& this._map[key]!==VOID0;
	}

	containsValue(value:TValue):boolean
	{
		if(!this._count) return false;
		const map = this._map;
		for(let key in map)
		{
			if(map.hasOwnProperty(key) && areEqual(map[key], value))
				return true;
		}
		return false;
	}


	getValue(key:string):TValue|undefined
	{
		return key===null || key===VOID0 || !this._count
			? VOID0
			: this._map[key];
	}


	protected _setValueInternal(key:string, value:TValue|undefined):boolean
	{
		const _ = this;
		const map = _._map, old = map[key];
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
		const _ = this;
		return _.handleUpdate(
			() =>
			{
				let changed:boolean = false;
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
		const _ = this;
		const result:IMap<TValue> = {};
		if(_._count) for(let key in _._map)
		{
			if(_._map.hasOwnProperty(key)) // This simply satisfies inspection.
			{
				let value = _._map[key];
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
		const result:any[] = Object.keys(this._map);
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
