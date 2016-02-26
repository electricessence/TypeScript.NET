/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IUriComponentFormattable.d.ts"/>
///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="../Primitive.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import Type from '../Types';
import * as Serialization from '../Serialization/Utility';
import extractKeyValue from '../KeyValueExtract';
import {isEnumerable,forEach} from '../Collections/Enumeration/Enumerator';

/*
 * This module is provided as a lighter weight utility for acquiring query params.
 * If more detailed operations are necessary, consider importing QueryBuilder.
 */

const
	ENTRY_SEPARATOR = "&",
	KEY_VALUE_SEPARATOR = "=";


/**
 * Returns the encoded URI string
 * @param values
 * @param prefixIfNotEmpty
 * @returns {string}
 */
export function encode(
	values:IUriComponentMap|QueryParamArray|QueryParamEnumerable,
	prefixIfNotEmpty?:boolean):string
{
	if(!values) return '';
	var entries:string[] = [];

	if(Array.isArray(values) || isEnumerable(values))
	{
		forEach(values, entry=>
			extractKeyValue(entry,
				(key, value)=> appendKeyValue(entries, key, value))
		);
	}
	else
	{
		Object.keys(values).forEach(
			key=> appendKeyValue(entries, key, values[key])
		);
	}

	return (entries.length && prefixIfNotEmpty ? '?' : '')
		+ entries.join(ENTRY_SEPARATOR);
}

function appendKeyValueSingle(
	entries:string[],
	key:string,
	value:UriComponentValue):void
{
	entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}

// According to spec, if there is an array of values with the same key, then each value is replicated with that key.
function appendKeyValue(
	entries:string[],
	key:string,
	value:UriComponentValue|UriComponentValue[]|IEnumerable<UriComponentValue>):void
{
	if(Array.isArray(value) || isEnumerable(value))
	{
		forEach(value, v=> appendKeyValueSingle(entries, key, v));
	}
	else
	{
		appendKeyValueSingle(entries, key, value)
	}
}

/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
export function encodeValue(value:UriComponentValue):string
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
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
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
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
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
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IKeyValuePair<string, Primitive>[]}
 */
export function parseToArray(
	query:string,
	deserialize:boolean = true,
	decodeValues:boolean = true):IStringKeyValuePair<Primitive>[]
{
	var result:IStringKeyValuePair<Primitive>[] = [];
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

