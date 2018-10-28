/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface KeyValuePair<TKey, TValue>
{
	key:TKey;
	value:TValue;
}

export declare type KeyValuePairOrTuple<TKey,TValue> = KeyValuePair<TKey,TValue> | [TKey,TValue];

export interface StringKeyValuePair<TValue> extends KeyValuePair<string, TValue>
{ }

export declare type StringKeyValuePairOrTuple<TValue> = StringKeyValuePair<TValue> | [string,TValue];

export default KeyValuePair;