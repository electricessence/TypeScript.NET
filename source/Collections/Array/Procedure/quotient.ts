/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

/**
 * Takes the first number and divides it by all following.
 * @param source
 * @param ignoreNaN Will cause this skip any NaN values.
 * @returns {number}
 */
export function quotient(source:ArrayLike<number>, ignoreNaN:boolean = false):number
{
	const len = source ? source.length : 0;
	if(len<2)
		return NaN;

	let result = source[0];

	let found = false;
	for(let i=1;i<len;i++)
	{
		let n = source[i];
		if(n===0)
		{
			return NaN;
		}
		if(isNaN(n))
		{
			if(!ignoreNaN)
			{
				return NaN;
			}
		}
		else
		{
			result /= n;
			if(!found) found = true;
		}
	}

	return found ? result : NaN;
}
