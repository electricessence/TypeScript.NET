/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="../Serialization/ISerializable.d.ts"/>
///<reference path="IUriComponentFormattable.d.ts"/>
///<reference path="../Primitive.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import Type from '../Types';
import * as Serialization from '../Serialization/Utility';
import * as QueryParams from './QueryParams';
import OrderedStringKeyDictionary from '../Collections/Dictionaries/OrderedStringKeyDictionary';
import {isEnumerable} from '../Collections/Enumeration/Enumerator';


/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
export default
class QueryBuilder extends OrderedStringKeyDictionary<UriComponentValue|UriComponentValue[]>
{

	constructor(
		query:QueryParamsConvertible,
		decodeValues:boolean = true)
	{
		super();

		this.importQuery(query,decodeValues);
	}


	static init(
		query:QueryParamsConvertible,
		decodeValues:boolean = true):QueryBuilder
	{
		return new QueryBuilder(query, decodeValues);
	}

	importQuery(
		query:QueryParamsConvertible,
		decodeValues:boolean = true):QueryBuilder {

		if(Type.isString(query))
		{
			this.importFromString(<string>query, decodeValues);
		}
		else if(Array.isArray(query) || isEnumerable(query))
		{
			this.importPairs(query);
		}
		else
		{
			this.importMap(<IUriComponentMap>query);
		}

		return this;
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
					if(Array.isArray(prev))
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



	/**
	 * Returns the encoded URI string
	 */
	encode(prefixIfNotEmpty?:boolean):string
	{
		return QueryParams.encode(this, prefixIfNotEmpty);
	}

	toString():string
	{
		return this.encode();
	}
}
