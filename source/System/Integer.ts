/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Type from "./Types";
import ArgumentException from "./Exceptions/ArgumentException";
import ArgumentOutOfRangeException from "./Exceptions/ArgumentOutOfRangeException";

function Integer(n:number):number
{
	return n | 0;
}

module Integer
{

	function r(maxExclusive:number):number
	{
		return (Math.random()*maxExclusive) | 0;
	}


	/**
	 * Returns a random integer from minInclusive to the maxExclusive.
	 * Negative numbers are allowed.
	 *
	 * @param maxExclusive
	 * @returns {number}
	 */
	export function random(maxExclusive:number):number
	{
		assert(maxExclusive, 'maxExclusive');
		return r(maxExclusive);
	}

	export module random
	{
		export function next(
			boundary:number,
			inclusive?:boolean):number
		{
			assert(boundary, 'max');
			if(boundary===0) return 0;
			if(inclusive) boundary += boundary/Math.abs(boundary);
			return r(boundary);
		}

		export function nextInRange(
			min:number,
			max:number,
			inclusive?:boolean):number
		{
			assert(min, 'min');
			assert(max, 'max');
			var range = max - min;
			if(range===0) return min;
			if(inclusive) range += range/Math.abs(range);
			return min + next(range);
		}

		export function select<T>(source:T[]):T
		{
			return source && source.length
				? source[r(source.length)]
				: void(0);
		}

	}

	export function is(n:number):boolean
	{
		return Type.isNumber(n, false) && isFinite(n) && n==(n | 0);
	}

	export function assert(n:number, argumentName?:string):boolean
	{
		var i = is(n);
		if(!i)
			throw new ArgumentException(argumentName || 'n', "Must be a integer.");
		return i;
	}

	export function assertZeroOrGreater(n:number, argumentName?:string):boolean
	{
		var i = assert(n, argumentName) && n>=0;
		if(!i)
			throw new ArgumentOutOfRangeException(argumentName || 'n', n, "Cannot be less than zero.");
		return i;
	}

	export function assertPositive(n:number, argumentName?:string):boolean
	{
		var i = assert(n, argumentName) && n>0;
		if(!i)
			throw new ArgumentOutOfRangeException(argumentName || 'n', n, "Must be greater than zero.");
		return i;
	}

}

export default Integer;
