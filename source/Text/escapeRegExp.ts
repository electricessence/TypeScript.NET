/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

const PATTERN = /[-[\]\/{}()*+?.\\^$|]/g;
const REPLACEMENT = "\\$&";

/**
 * Escapes a RegExp sequence.
 * @param source
 * @returns {string}
 */
export default function escapeRegExp(source:string):string
{
	return source.replace(PATTERN, REPLACEMENT);
}