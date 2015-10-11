/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="..\Serialization\ISerializable.d.ts"/>
///<reference path="IUriComponentFormattable.d.ts"/>
import Types = require('../Types');
import Serialization = require('../Serialization/Utility');
import OrderedStringKeyDictionary = require('../Collections/Dictionaries/OrderedStringKeyDictionary');
import QueryParams = require('./QueryParams');

const
ENTRY_SEPARATOR     = "&",
KEY_VALUE_SEPARATOR = "=";

type Primitive = string|boolean|number;

/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
class QueryBuilder extends OrderedStringKeyDictionary<Primitive|ISerializable|IUriComponentFormattable>
{

	constructor(
		query:string|IUriComponentMap,
		decodeValues:boolean = true)
	{
		super();

		if(Types.isString(query))
		{
			this.importFromString(<string>query, decodeValues);
		}
		else
		{
			this.importMap(<IUriComponentMap>query)
		}
	}

	importFromString(
		values:string,
		deserialize:boolean = true,
		decodeValues:boolean = true,
		preserveOrder:boolean = true):QueryBuilder
	{
		QueryParams.parse(values,
			(key, value)=> {this.setValue(key, value, preserveOrder);},
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
		for(var k of keys)
		{
			entries.push(
				k + KEY_VALUE_SEPARATOR
				+ QueryParams.encodeValue(<any>this.getValue(k)));
		}

		return (entries.length && prefixIfNotEmpty ? '?' : '')
			+ entries.join(ENTRY_SEPARATOR);
	}
}


export = QueryBuilder;
