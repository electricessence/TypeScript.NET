/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ArgumentException} from "./Exceptions/ArgumentException";
import {ArgumentNullException} from "./Exceptions/ArgumentNullException";
import {KeyValuePair, IKeyValuePair} from "./KeyValuePair";
import {IArray} from "./Collections/Array/IArray";

const
	VOID0:any                  = void 0,
	DOT:string                 = '.',
	KEY:string                 = 'key',
	VALUE:string               = 'value',
	ITEM:string                = 'item',
	ITEM_1:string              = ITEM + '[1]',
	ITEM_KEY:string            = ITEM + DOT + KEY,
	ITEM_VALUE:string          = ITEM + DOT + VALUE,
	INVALID_KVP_MESSAGE:string = 'Invalid type.  Must be a KeyValuePair or Tuple of length 2.',
	CANNOT_BE_UNDEFINED:string = 'Cannot equal undefined.';

export function isKeyValuePair<TKey,TValue>(kvp:any):kvp is IKeyValuePair<TKey,TValue>
{
	return kvp && kvp.hasOwnProperty(KEY) && kvp.hasOwnProperty(VALUE);
}

export function assertKey<TKey>(key:TKey, name:string = ITEM):TKey
{
	assertNotUndefined(key, name + DOT + KEY);
	if(key===null)
		throw new ArgumentNullException(name + DOT + KEY);

	return key;
}


export function assertTuple(tuple:IArray<any>, name:string = ITEM):void
{
	if(tuple.length!=2)
		throw new ArgumentException(name, 'KeyValuePair tuples must be of length 2.');

	assertKey(tuple[0], name);
}


export function assertNotUndefined<T>(value:T, name:string):T
{
	if(value===VOID0)
		throw new ArgumentException(name, CANNOT_BE_UNDEFINED);

	return value;
}


export function extractKeyValue<TKey, TValue, TResult>(
	item:KeyValuePair<TKey, TValue>,
	to:(key:TKey, value:TValue)=>TResult):TResult
{

	var _ = this, key:TKey, value:TValue;
	if(item instanceof Array)
	{
		assertTuple(item);
		key = item[0];
		value = assertNotUndefined(item[1], ITEM_1);
	}
	else if(isKeyValuePair<TKey,TValue>(item))
	{
		key = assertKey(item.key);
		value = assertNotUndefined(item.value, ITEM_VALUE);
	}
	else
	{
		throw new ArgumentException(ITEM, INVALID_KVP_MESSAGE);
	}

	return to(key, value);
}

export default extractKeyValue;