/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

function ifSet(
	source:ArrayLike<number>,
	start:number,
	ignoreNaN:boolean,
	predicate:(n:number, result:number) => boolean):number
{
	if(!source || !source.length)
		return NaN;

	let result = start;
	if(ignoreNaN)
	{
		let found = false;
		for(let n of <number[]>source)
		{
			if(!isNaN(n))
			{
				if(predicate(n, result))
					result = n;
				if(!found) found = true;
			}
		}
		if(!found)
			return NaN;
	}
	else
	{
		for(let n of <number[]>source)
		{
			if(isNaN(n))
				return NaN;

			if(predicate(n, result))
				result = n;
		}
	}
	return result;

}

export function min(source:ArrayLike<number>, ignoreNaN:boolean = false):number
{
	return ifSet(source, +Infinity, ignoreNaN, (n, result) => n<result);
}

export function max(source:ArrayLike<number>, ignoreNaN:boolean = false):number
{
	return ifSet(source, -Infinity, ignoreNaN, (n, result) => n>result);
}
