/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArgumentNullException from "../../System/Exceptions/ArgumentNullException";
import {Type} from "../../System/Types";
import {FiniteEnumeratorBase} from "../../System/Collections/Enumeration/EnumeratorBase";
import FiniteLinqEnumerable from "../FiniteLinqEnumerable";

export default function(
	input:string, pattern:any,
	flags:string = ""):FiniteLinqEnumerable<RegExpExecArray>
{
	if(input==null)
		throw new ArgumentNullException("input");
	const type = typeof input;
	if(type!=Type.STRING)
		throw new Error("Cannot exec RegExp matches of type '" + type + "'.");

	if(pattern instanceof RegExp)
	{
		flags += (pattern.ignoreCase) ? "i" : "";
		flags += (pattern.multiline) ? "m" : "";
		pattern = pattern.source;
	}

	if(flags.indexOf("g")=== -1) flags += "g";

	return new FiniteLinqEnumerable<RegExpExecArray>(
		() => {
			let regex:RegExp;
			return new FiniteEnumeratorBase<RegExpExecArray>(
				() => {
					regex = new RegExp(pattern, flags);
				},

				(yielder) => {
					// Calling regex.exec consecutively on the same input uses the lastIndex to start the next match.
					let match = regex.exec(input);
					return match!=null
						? yielder.yieldReturn(match)
						: yielder.yieldBreak();
				}
			);
		}
	);
}