/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IUriComponentFormattable.d.ts"/>
///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="../Primitive.d.ts"/>
import Type from '../Types';
import * as Serialization from '../Serialization/Utility';

/*
 * This module is provided as a lighter weight utility for acquiring query params.
 * If more detailed operations are necessary, consider importing QueryBuilder.
 */

const
	ENTRY_SEPARATOR = "&",
	KEY_VALUE_SEPARATOR = "=";

/**
 * Returns the encoded URI string
 */
export function encode(
	values:IUriComponentMap|IKeyValuePair<string,Primitive>[],
	prefixIfNotEmpty?:boolean):string
{
	if(!values) return '';
	var entries:string[] = [];

	if(Array.isArray(values))
	{
		for(let kvp of values)
		{
			if(kvp) entries.push(kvp.key + KEY_VALUE_SEPARATOR + encodeValue(kvp.value));
		}
	}
	else
	{
		var keys = Object.keys(values);
		for(let k of keys)
		{
			entries.push(k + KEY_VALUE_SEPARATOR + encodeValue((<any>values)[k]));
		}
	}

	return (entries.length && prefixIfNotEmpty ? '?' : '')
		+ entries.join(ENTRY_SEPARATOR);
}

/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
export function encodeValue(value:Primitive|ISerializable|IUriComponentFormattable):string
{
	var v:string = null;
	if(isUriComponentFormattable(value))
	{
		v = value.toUriComponent();
		if(v && v.indexOf('&')!=1)
			throw '.toUriComponent() did not encode the value.';
	}
	else
	{
		v = encodeURIComponent(Serialization.toString(v));
	}
	return v;
}

/**
 * A shortcut for identifying an IUriComponentFormattable object.
 * @param instance
 * @returns {boolean}
 */
export function isUriComponentFormattable(instance:any):instance is IUriComponentFormattable
{
	return Type.hasMemberOfType<IUriComponentFormattable>(instance, "toUriComponent", Type.FUNCTION);
}

/**
 * Parses a string for valid query param entries and pipes them through a handler.
 * @param query
 * @param entryHandler
 * @param deserialize
 * @param decodeValues
 */
export function parse(
	query:string,
	entryHandler:(key:string, value:Primitive)=>void,
	deserialize:boolean = true,
	decodeValues:boolean = true):void
{
	if(query && (query = query.replace(/^\s*\?+/, '')))
	{
		var entries = query.split(ENTRY_SEPARATOR);
		for(let entry of entries)
		{
			/*
			 * Since it is technically possible to have multiple '=' we need to identify the first one.
			 * And if there is no '=' then the entry is ignored.
			 */
			var si = entry.indexOf(KEY_VALUE_SEPARATOR);
			if(si!= -1)
			{
				var key = entry.substring(0, si);
				var value = <any>entry.substring(si + 1);
				if(decodeValues) value = decodeURIComponent(value);
				if(deserialize) value = Serialization.toPrimitive(value);
				entryHandler(key, value);
			}
		}
	}
}

/**
 * Parses a string for valid query params and returns a key-value map of the entries.
 * @param query
 * @param deserialize
 * @param decodeValues
 * @returns {IMap<Primitive>}
 */
export function parseToMap(
	query:string,
	deserialize:boolean = true,
	decodeValues:boolean = true):IMap<Primitive|Primitive[]>
{
	var result:IMap<Primitive|Primitive[]> = {};
	parse(query,
		(key, value)=>
		{
			if((key)in(result))
			{
				var prev:any = result[key];
				if(!(Array.isArray(prev)))
					result[key] = prev = [prev];
				prev.push(value);
			}
			else
				result[key] = value;
		},
		deserialize,
		decodeValues);
	return result;
}

/**
 * Parses a string for valid query params and returns a key-value pair array of the entries.
 * @param query
 * @param deserialize
 * @param decodeValues
 * @returns {IKeyValuePair<string, Primitive>[]}
 */
export function parseToArray(
	query:string,
	deserialize:boolean = true,
	decodeValues:boolean = true):IKeyValuePair<string,Primitive>[]
{
	var result:IKeyValuePair<string,Primitive>[] = [];
	parse(query,
		(key, value)=> {result.push({key: key, value: value});},
		deserialize,
		decodeValues
	);
	return result;
}

export module Separator
{
	export const Entry:string = ENTRY_SEPARATOR;
	export const KeyValue:string = KEY_VALUE_SEPARATOR;
}
Object.freeze(Separator);

