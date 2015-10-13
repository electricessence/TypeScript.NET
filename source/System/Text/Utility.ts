/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Types = require('../Types');

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
	var oIsArray = params instanceof Array;
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
				case Types.STRING:
					return true;
				case Types.NUMBER:
				case Types.BOOLEAN:
					return r;
				default:
					return a;
			}
		}
	);
}
