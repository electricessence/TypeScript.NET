/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Type from '../Types';

export const EMPTY:string = '';

export function escapeRegExp(source:string):string {
	return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Can trim any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
export function trim(source:string, chars?:string|string[],ignoreCase?:boolean):string
{
	if(chars) {
		if(chars===EMPTY) return source;
		var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : <string>chars);
		return source.replace(new RegExp('^['+escaped+']+|['+escaped+']+$','g'+(ignoreCase?'i':'')),EMPTY);
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
	var oIsArray = Array.isArray(params);
	return source.replace(/\{([^{}]*)\}/g,
		(a:string, b:string):any=>
		{
			var n:any = b;
			if(oIsArray)
			{
				let i = parseInt(b);
				if(!isNaN(i)) n = i;
			}

			var r = (<any>params)[n];
			switch(typeof r)
			{
				case Type.STRING:
				case Type.NUMBER:
				case Type.BOOLEAN:
					return r;
				default:
					return a;
			}
		}
	);
}
