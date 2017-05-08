/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IMap} from "../../../IMap";
import {ICollection} from "../ICollection";
import {IKeyValuePair, IStringKeyValuePair} from "../../KeyValuePair";
import {Action} from "../../FunctionTypes";

export {IMap};

/**
 * JavaScript hashing can only truly be done with strings (and potentially symbols).
 * This provides a mechanism to enforce hashable
 */
export interface IHashable
{
	getHashCode():string|number;
}

export interface ISymbolizable
{
	getSymbol():symbol;
}

export interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>>
{
	keys:TKey[];
	values:TValue[];

	addByKeyValue(key:TKey, value:TValue):boolean;
	setValue(key:TKey, value:TValue|undefined):boolean;
	getValue(key:TKey):TValue|undefined; // It's very common in JS to allow for undefined and check against it.
	getAssuredValue(key:TKey):TValue;
	tryGetValue(key:TKey,out:Action<TValue>):boolean;
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
