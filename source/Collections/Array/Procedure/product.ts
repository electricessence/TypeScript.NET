/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export function product(source:ArrayLike<number>, ignoreNaN:boolean = false):number
{
	if(!source || !source.length)
		return NaN;

	let result = 1;
	if(ignoreNaN)
	{
		let found = false;
		for(let n of <number[]>source)
		{
			if(!isNaN(n)){
				result *= n;
				found = true;
			}
		}
		if(!found)
			return NaN;
	}
	else
	{
		for(let n of <number[]>source)
		{
			if(isNaN(n)) return NaN;
			result *= n;
		}
	}

	return result;
}
