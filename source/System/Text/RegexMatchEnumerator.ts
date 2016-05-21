/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Regex, Match} from "./RegularExpressions";
import {EmptyEnumerator} from "../Collections/Enumeration/EmptyEnumerator";
import {EnumeratorBase} from "../Collections/Enumeration/EnumeratorBase";
import {IEnumerator} from "../Collections/Enumeration/IEnumerator";

export class RegexMatchEnumerator
{
	private _pattern:Regex;

	constructor(pattern:string|RegExp|Regex)
	{
		if(pattern instanceof Regex)
		{
			this._pattern = pattern;
		}
		else
		{
			this._pattern = new Regex(pattern);
		}
	}

	matches(input:string):IEnumerator<Match>
	{
		var p:number; // pointer
		return new EnumeratorBase<Match>(
			()=>
			{
				p = 0;
			},
			yielder=>
			{
				let match:Match = this._pattern.match(input, p);
				if(match.success)
				{
					p = match.index + match.length;
					return yielder.yieldReturn(match);
				}

				return yielder.yieldBreak();
			});
	}

	static matches(input:string, pattern:string|RegExp|Regex):IEnumerator<Match>
	{
		return input && pattern
			? (new RegexMatchEnumerator(pattern)).matches(input)
			: EmptyEnumerator;
	}

}

export default RegexMatchEnumerator.matches;