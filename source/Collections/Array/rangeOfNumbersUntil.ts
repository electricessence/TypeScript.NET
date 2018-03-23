/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import rangeOfNumbers from "./rangeOfNumbers";

/**
 * Returns a range of numbers based upon the first value and the step value excluding any numbers at or beyond the until value.
 * @param first
 * @param until
 * @param step
 * @returns {number[]}
 */
export default function rangeOfNumbersUntil(
	first:number,
	until:number,
	step:number = 1):number[]
{
	if(step==0) throw new ArgumentOutOfRangeException('step', step, "Must be a non-zero number.");
	return rangeOfNumbers(first, (until - first)/step, step);
}
