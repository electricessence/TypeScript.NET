/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export const EMPTY:string = '';

/**
 * Returns true if the pattern matches the beginning of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export function startsWith(source:string|number, pattern:string|number, ignoreCase:boolean = false):boolean
{
	return canMatchThen(source, pattern, ignoreCase, startsWithInternal);
}

/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export function endsWith(source:string|number, pattern:string|number, ignoreCase:boolean = false):boolean
{
	return canMatchThen(source, pattern, ignoreCase, endsWithInternal);
}


/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export function contains(source:string|number, pattern:string|number, ignoreCase:boolean = false):boolean
{
	return canMatchThen(source, pattern, ignoreCase, containsInternal);
}

function canMatchThen(source:string|number, pattern:string|number, ignoreCase:boolean, test:(source:string,pattern:string)=>boolean):boolean
{
	if(source==null || pattern==null) return false; // just in case.
	source = source + EMPTY;
	pattern = pattern + EMPTY;
	if(ignoreCase)
	{
		source = source.toLowerCase();
		pattern = pattern.toLowerCase();
	}
	if(!source.length || !pattern.length) return false;
	if(source===pattern) return true;
	return test(source, pattern);

}

function startsWithInternal(source:string,pattern:string):boolean
{
	// Since we don't care about searching the entire string.
	const len = pattern.length;
	for(let i=0;i<len;i++) if(source[i]!=pattern[i]) return false;
	return true;
}

function endsWithInternal(source:string, pattern:string):boolean
{
	// Since we don't care about searching the entire string.
	const patternLen = pattern.length;
	const sourceStart = source.length - patternLen;
	for(let i=0;i<patternLen;i++) if(source[sourceStart+i]!=pattern[i]) return false;
	return true;
}

function containsInternal(source:string, pattern:string):boolean
{
	return source.indexOf(pattern)!=-1;
}
