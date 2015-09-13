///<reference path="ICollection.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Collections {

	export interface IMap<TValue> {
		[key: string]: TValue
	}

	export interface IKeyValuePair<TKey, TValue> {
		key: TKey;
		value: TValue;
	}

	export interface IStringKeyValuePair<TValue> extends IKeyValuePair<string, TValue> { }


	export interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>> {
		keys: TKey[];
		values: TValue[];

		addByKeyValue(key:TKey, value:TValue): void;
		get(key:TKey): TValue;
		set(key:TKey, value:TValue): boolean;
		containsKey(key:TKey): boolean;
		containsValue(value:TValue): boolean;
		removeByKey(key:TKey): boolean;
		removeByValue(value:TValue): number;

		importPairs(pairs:IKeyValuePair<TKey, TValue>[]): boolean;

		// See ICollection<T> for the rest.
	}


	export interface IStringKeyDictionary<TValue> extends IDictionary<string, TValue>, ICollection<IStringKeyValuePair<TValue>> {
		importMap(map:IMap<TValue>):boolean;
	}

	export interface IOrderedDictionary<TKey, TValue> extends IDictionary<TKey, TValue> {
		indexOfKey(key:TKey): number;
		getValueByIndex(index:number): TValue;
	}
}