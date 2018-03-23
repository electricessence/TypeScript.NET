/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

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
