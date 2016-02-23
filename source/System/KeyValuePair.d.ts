/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

interface IKeyValuePair<TKey, TValue>
{
	key: TKey;
	value: TValue;
}

declare type KeyValuePair<TKey,TValue> = IKeyValuePair<TKey,TValue> | [TKey,TValue];

interface IStringKeyValuePair<TValue> extends IKeyValuePair<string, TValue>
{ }

declare type StringKeyValuePair<TValue> = IStringKeyValuePair<TValue> | [string,TValue];
