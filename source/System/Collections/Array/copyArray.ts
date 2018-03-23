/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import init from "./initializeArray";
import copyArrayTo from "./copyArrayTo";

/**
 *
 * @param source
 * @param sourceIndex
 * @param length
 * @returns {any}
 */
export default function copyArray<T>(
	source:ArrayLike<T>,
	sourceIndex:number = 0,
	length:number = Infinity):T[]
{
	if(!source) return <any>source; // may have passed zero? undefined? or null?
	return copyArrayTo(
		source,
		init<T>(Math.min(length, Math.max(source.length - sourceIndex, 0))),
		sourceIndex, 0, length);
}