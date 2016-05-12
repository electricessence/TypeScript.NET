/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Collections/Enumeration/IEnumerator.d.ts"/>
import {Regex, Match} from "./RegularExpressions";
import EnumeratorBase from "../Collections/Enumeration/EnumeratorBase";
export class RegexMatchEnumerator
{
	private _pattern:Regex;

	constructor(pattern:string|RegExp|Regex)
	{
		if(pattern instanceof Regex) {
			this._pattern = pattern;
		} else {
			this._pattern = new Regex(pattern);
		}
	}

	matches(input:string):IEnumerator<Match>
	{
		var tempInput:string = null;
		return new EnumeratorBase<Match>(
			()=>
			{
				tempInput = input;
			},
			yielder=>
			{
				let match:Match = this._pattern.match(tempInput);
				if(match.success) {
					tempInput = tempInput.substring(match.index+match.length);
					return yielder.yieldReturn(match);
				}

				return yielder.yieldBreak();
			});
	}

}