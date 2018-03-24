/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Primitive from "../Primitive";
import IMap from "../IMap";

/**
 * This takes a string and replaces '{string}' with the respected parameter.
 * Also allows for passing an array in order to use '{n}' notation.
 * Not limited to an array's indexes.  For example, {length} is allowed.
 * Based upon Crockford's supplant function.
 * @param source
 * @param params
 * @returns {string}
 */
export function supplant(
	source:string,
	params:IMap<Primitive> | ArrayLike<Primitive>):string
{
	return source.replace(/{([^{}]*)}/g,
		(a:string, b:string):string => {
			if(b in params) return (<any>params)[b]+'';
			throw `Param {${b}} value not provided.`;
		}
	);
}

/**
 * Takes any set of arguments and replaces based on index.
 * @param source
 * @param args
 * @returns {string}
 */
export function format(source:string, ...args:Primitive[])
{
	return supplant(source, args);
}

