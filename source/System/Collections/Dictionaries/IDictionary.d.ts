/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ICollection} from "../ICollection";
import {IKeyValuePair, IStringKeyValuePair} from "../../KeyValuePair";

/**
 * JavaScript hashing can only truly be done with strings.
 * This provides a mechanism to enforce hashable
 */
export interface IHashable
{
	getHashCode():string;
}

export interface IMap<TValue>
{
	[key:string]:TValue
}

export interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>>
{
	keys:TKey[];
	values:TValue[];

	addByKeyValue(key:TKey, value:TValue):boolean;
	getValue(key:TKey):TValue;
	setValue(key:TKey, value:TValue):boolean;
	containsKey(key:TKey):boolean;
	containsValue(value:TValue):boolean;
	removeByKey(key:TKey):boolean;
	removeByValue(value:TValue):number;

	// See ICollection<T> for the rest.
}


export interface IStringKeyDictionary<TValue> extends IDictionary<string, TValue>, ICollection<IStringKeyValuePair<TValue>>
{
	importMap(map:IMap<TValue>):boolean;
}

export interface IOrderedDictionary<TKey, TValue> extends IDictionary<TKey, TValue>
{
	indexOfKey(key:TKey):number;
	getValueByIndex(index:number):TValue;
}

export default IDictionary;
