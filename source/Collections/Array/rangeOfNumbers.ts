/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import initArray from "./initializeArray";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";

/**
 * Returns a range of numbers based upon the first value and the step value.
 * @param first
 * @param count
 * @param step
 * @returns {number[]}
 */
export default function rangeOfNumbers(
	first:number,
	count:number,
	step:number = 1):number[]
{
	if(!isFinite(first))
		throw new ArgumentOutOfRangeException('first',first);
	if(!isFinite(count) || count<0)
		throw new ArgumentOutOfRangeException('count',count);
	if(!isFinite(step))
		throw new ArgumentOutOfRangeException('step',step);

	const result = initArray<number>(count>=0?count:0);
	for(let i = 0; i<count; i++)
	{
		result[i] = first;
		first += step;
	}

	return result;
}
