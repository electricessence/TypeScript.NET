/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import escapeRegExp from "./escapeRegExp";
const EMPTY:string = '';

/**
 * Can trim any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
export default function trim(source:string, chars?:string | string[], ignoreCase?:boolean):string
{
	if(chars===EMPTY) return source;
	if(chars instanceof Array) return trim(source, chars.join(EMPTY), ignoreCase);
	if(!chars) return source.replace(/^\s+|\s+$/g, EMPTY);

	const escaped = escapeRegExp(chars);
	return source.replace(new RegExp(
		`^[${escaped}]+|[${escaped}]+$`,
		`g${ignoreCase ? 'i' : EMPTY}`),
		EMPTY);
}
