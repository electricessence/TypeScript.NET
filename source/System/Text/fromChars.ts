/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import repeatText from "./repeatText";
const EMPTY:string = '';

export default function fromChars(ch:number, count:number):string
export default function fromChars(chars:number[]):string
export default function fromChars(chOrChars:any, count:number = 1):string
{
	if((chOrChars) instanceof (Array))
	{
		let result = EMPTY;
		for(let char of chOrChars)
		{
			result += String.fromCharCode(char);
		}
		return result;
	}
	else
	{
		return repeatText(String.fromCharCode(chOrChars), count);
	}
}