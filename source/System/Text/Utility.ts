/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";

export const EMPTY:string = '';



/**
 * Returns a numerical (integer) hash code of the string.  Can be used for identifying inequality of contents, but two different strings in rare cases will have the same hash code.
 * @param source
 * @returns {number}
 */
export function getHashCode(source:string):number
{
	let hash = 0 | 0;
	if(source.length==0) return hash;
	for(let i = 0, l = source.length; i<l; i++)
	{
		let ch = source.charCodeAt(i);
		hash = ((hash<<5) - hash) + ch;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

export function repeat(source:string, count:number):string
{
	let result = EMPTY;
	if(!isNaN(count))
	{
		for(let i = 0; i<count; i++)
		{
			result += source;
		}
	}
	return result;
}

export function fromChars(ch:number, count:number):string
export function fromChars(chars:number[]):string
export function fromChars(chOrChars:any, count:number = 1):string
{
	if((chOrChars)instanceof(Array))
	{
		let result = EMPTY;
		for(let char of chOrChars)
		{
			result += String.fromCharCode(char);
		}
		return result;
	}
	else
	{
		return repeat(String.fromCharCode(chOrChars), count);
	}
}

/**
 * Escapes a RegExp sequence.
 * @param source
 * @returns {string}
 */
export function escapeRegExp(source:string):string
{
	return source.replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&");
}

/**
 * Can trim any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
export function trim(source:string, chars?:string|string[], ignoreCase?:boolean):string
{
	if(chars===EMPTY) return source;
	if(chars)
	{
		const escaped = escapeRegExp((chars)instanceof(Array) ? chars.join() : <string>chars);
		return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase
				? 'i'
				: '')), EMPTY);
	}

	return source.replace(/^\s+|\s+$/g, EMPTY);
}

/**
 * Takes any arg
 * @param source
 * @param args
 * @returns {string}
 */
export function format(source:string, ...args:any[])
{
	return supplant(source, args);
}

//

/**
 * This takes a string and replaces '{string}' with the respected parameter.
 * Also allows for passing an array in order to use '{n}' notation.
 * Not limited to an array's indexes.  For example, {length} is allowed.
 * Based upon Crockford's supplant function.
 * @param source
 * @param params
 * @returns {string}
 */
export function supplant(source:string, params:{[key:string]:any}|any[]):string
{
	const oIsArray = (params)instanceof(Array);
	return source.replace(/{([^{}]*)}/g,
		(a:string, b:string):any=>
		{
			let n:any = b;
			if(oIsArray)
			{
				let i = parseInt(b);
				if(!isNaN(i)) n = i;
			}

			let r = (<any>params)[n];
			switch(typeof r)
			{
				case Type.STRING:
				case Type.NUMBER:
				case Type.BOOLEAN:
					return r;
				default:
					return (r && Type.hasMemberOfType(r, "toString", Type.FUNCTION))
						? r.toString()
						: a;
			}
		}
	);
}


function canMatch(source:string, match:string):boolean|null|void
{
	if(!Type.isString(source) || !match) return false;
	if(source===match) return true;
	if(match.length<source.length) return null;
}

/**
 * Returns true if the pattern matches the beginning of the source.
 * @param source
 * @param pattern
 * @returns {boolean}
 */
export function startsWith(source:string, pattern:string):boolean
{
	const m = canMatch(source, pattern);
	return Type.isBoolean(m) ? m : source.indexOf(pattern)==0;
}

/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @returns {boolean}
 */
export function endsWith(source:string, pattern:string):boolean
{
	const m = canMatch(source, pattern);
	return Type.isBoolean(m) ? m : source.lastIndexOf(pattern)==(source.length - pattern.length);
}

