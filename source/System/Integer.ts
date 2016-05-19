/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ArgumentException} from "./Exceptions/ArgumentException";
import {ArgumentOutOfRangeException} from "./Exceptions/ArgumentOutOfRangeException";
import {IArray} from "./Collections/Array/IArray";

export function Integer(n:number):number
{
	return Math.floor(n);
}

export module Integer
{
	export const MAX_32_BIT:number = 2147483647;

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

		export function select<T>(source:IArray<T>):T
		{
			return source && source.length
				? source[r(source.length)]
				: void(0);
		}

		export module select
		{
			export function one<T>(source:IArray<T>):T
			{
				return random.select(source);
			}
		}

	}

	export function as32Bit(n:number):number
	{
		var result = n | 0;
		return (n=== -1 || result!== -1) ? result : null;
	}

	const NUMBER:string = "number";

	export function is(n:number):boolean
	{
		return typeof n===NUMBER && isFinite(n) && n===Math.floor(n);
	}

	export function is32Bit(n:number):boolean
	{
		return n===(n | 0);
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
			throw new ArgumentOutOfRangeException(argumentName || 'n', n, "Must be a valid integer greater than or equal to zero.");
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
