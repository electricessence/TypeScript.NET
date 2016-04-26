/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../ICollection.d.ts"/>
///<reference path="../../KeyValuePair.d.ts"/>

/**
 * JavaScript hashing can only truly be done with strings.
 * This provides a mechanism to enforce hashable
 */
interface IHashable {
	getHashCode():string;
}

interface IMap<TValue>
{
	[key: string]: TValue
}

interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>>
{
	keys: TKey[];
	values: TValue[];

	addByKeyValue(key:TKey, value:TValue): boolean;
	getValue(key:TKey): TValue;
	setValue(key:TKey, value:TValue): boolean;
	containsKey(key:TKey): boolean;
	containsValue(value:TValue): boolean;
	removeByKey(key:TKey): boolean;
	removeByValue(value:TValue): number;
	
	// See ICollection<T> for the rest.
}


interface IStringKeyDictionary<TValue> extends IDictionary<string, TValue>, ICollection<IStringKeyValuePair<TValue>>
{
	importMap(map:IMap<TValue>):boolean;
}

interface IOrderedDictionary<TKey, TValue> extends IDictionary<TKey, TValue>
{
	indexOfKey(key:TKey): number;
	getValueByIndex(index:number): TValue;
}
