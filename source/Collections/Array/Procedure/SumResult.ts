/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ISumResult from "./ISumResult";

/**
 * Represents an immutable struct of the sum of a set of values.
 */
export default class SumResult
	implements ISumResult
{
	readonly count:number;
	readonly sum:number;

	constructor(source:ArrayLike<number>, ignoreNaN:boolean = false)
	{
		let count = 0;
		let sum = 0;
		const len = source && source.length || 0;

		if(len)
		{
			if(ignoreNaN)
			{
				for(let i = 0; i<len; i++)
				{
					const n = source[i];
					if(!isNaN(n))
					{
						count++;
						sum += n;
					}
				}
			}
			else
			{
				count = len;
				for(let i = 0; i<len; i++)
				{
					sum += source[i];
					if(isNaN(sum)) break;
				}
			}

		}
		this.count = count;
		this.sum = sum;
	}
}