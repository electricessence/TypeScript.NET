/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="../Serialization/ISerializable.d.ts"/>
///<reference path="IUriComponentFormattable.d.ts"/>
///<reference path="../Primitive.d.ts"/>
import Type from '../Types';
import * as Serialization from '../Serialization/Utility';
import * as QueryParams from './QueryParams';
import OrderedStringKeyDictionary from '../Collections/Dictionaries/OrderedStringKeyDictionary';

const
ENTRY_SEPARATOR     = "&",
KEY_VALUE_SEPARATOR = "=";

/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
export default
class QueryBuilder extends OrderedStringKeyDictionary<UriComponentValue|UriComponentValue[]>
{

	constructor(
		query:string|IUriComponentMap,
		decodeValues:boolean = true)
	{
		super();

		if(Type.isString(query))
		{
			this.importFromString(<string>query, decodeValues);
		}
		else
		{
			this.importMap(<IUriComponentMap>query);
		}
	}

	/**
	 * Property parses the components of an URI into their values or array of values.
	 * @param values
	 * @param deserialize
	 * @param decodeValues
	 * @returns {QueryBuilder}
	 */
	importFromString(
		values:string,
		deserialize:boolean = true,
		decodeValues:boolean = true):QueryBuilder
	{
		var _ = this;
		QueryParams.parse(values,
			(key, value)=>
			{
				if(_.containsKey(key))
				{
					var prev = _.getValue(key);
					if(prev instanceof Array)
						prev.push(value);
					else
						_.setValue(key, [<UriComponentValue>prev, value]);
				}
				else
					_.setValue(key, value);
			},
			deserialize,
			decodeValues);

		return this;
	}

	static init(
		query:string|IUriComponentMap,
		decodeValues:boolean = true):QueryBuilder
	{
		return new QueryBuilder(query, decodeValues);
	}

	/**
	 * Returns the encoded URI string
	 */
	encode(prefixIfNotEmpty?:boolean):string
	{
		var entries:string[] = [];
		var keys = this.keys;
		for(let k of keys)
		{
			var value = this.getValue(k);
			// Since the values can either be UriComponentValues or an array of UriComponentValues..
			// This creates a single code path for both options.
			for(let v of value instanceof Array ? value : [value])
			{
				entries.push(
					k + KEY_VALUE_SEPARATOR
					+ QueryParams.encodeValue(<UriComponentValue>v));
			}
		}

		return (entries.length && prefixIfNotEmpty ? '?' : '')
			+ entries.join(ENTRY_SEPARATOR);
	}

	toString():string
	{
		return this.encode();
	}
}
