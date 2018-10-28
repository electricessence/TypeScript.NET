/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Integer from "./Integer";
import initialize from "./Collections/Array/initialize";
import {shuffle as arrayShuffle} from "./Collections/Array/shuffle";
import ArrayLikeWritable from "./Collections/Array/ArrayLikeWritable";
import assert = Integer.assert;

/**
 * This module only acts as a utility API for getting random numbers from Math.random().
 * If you need repeatable seeded random numbers then you'll need a separate utility.
 * Highly recommended: https://github.com/ckknight/random-js which has typings under @types/random-js.
 */
module Random
{

	function r(maxExclusive:number = 1):number
	{
		return Math.floor(Math.random()*maxExclusive);
	}

	function nr(
		boundary:number,
		inclusive?:boolean):number
	{
		const a = Math.abs(boundary);
		if(a===0 || a===1 && !inclusive) return 0;
		if(inclusive) boundary += boundary/a;
		return r(boundary);
	}

	function arrayCopy<T>(source:ArrayLike<T>):T[]
	{
		const len = source.length;
		const result = initialize<T>(len);
		for(let i = 0; i<len; i++)
		{
			result[i] = source[i];
		}
		return result;
	}

	/**
	 * Returns a random integer from 0 to the maxExclusive.
	 * Negative numbers are allowed.
	 *
	 * @param maxExclusive
	 * @returns {number}
	 */
	export function integer(maxExclusive:number):number
	{
		return next(maxExclusive);
	}

	/**
	 * Returns a function that generates random floating point numbers up to the maxExclusive value.
	 * Useful for generating a random and memoizable set for use with other enumerables.
	 * @param maxExclusive
	 * @returns {()=>number}
	 */
	export function generate(maxExclusive:number = 1):()=>number
	{
		return ()=> r(maxExclusive);
	}

	export module generate
	{
		/**
		 * Returns a function that generates random integers up to the boundary.
		 * Useful for generating a random and memoizable set for use with other enumerables.
		 * @param boundary
		 * @param inclusive
		 * @returns {()=>number}
		 */
		export function integers(
			boundary:number,
			inclusive?:boolean):()=>number
		{
			return ()=> nr(boundary,inclusive);
		}
	}

	/**
	 * Returns a random integer from 0 to the boundary.
	 * Return value will be less than the boundary unless inclusive is set to true.
	 * Negative numbers are allowed.
	 *
	 * @param boundary
	 * @param inclusive
	 * @returns {number}
	 */
	export function next(
		boundary:number,
		inclusive?:boolean):number
	{
		assert(boundary, 'boundary');
		return nr(boundary, inclusive);
	}

	export module next
	{
		export function integer(
			boundary:number,
			inclusive?:boolean):number
		{
			return Random.next(boundary, inclusive);
		}

		export function float(boundary:number = Number.MAX_VALUE):number
		{
			if(isNaN(boundary))
				throw "'boundary' is not a number.";
			return Math.random()*boundary;
		}

		export function inRange(
			min:number,
			max:number,
			inclusive?:boolean):number
		{
			assert(min, 'min');
			assert(max, 'max');
			let range = max - min;
			if(range===0) return min;
			if(inclusive) range += range/Math.abs(range);
			return min + r(range);
		}
	}


	/**
	 * Returns an array of random integers.
	 * @param count
	 * @param boundary
	 * @param inclusive
	 * @returns {number[]}
	 */
	export function integers(
		count:number,
		boundary:number,
		inclusive?:boolean):number[]
	{
		assert(count);
		const s:number[] = [];
		s.length = count;
		for(let i = 0; i<count; i++)
		{
			s[i] = nr(boundary, inclusive);
		}
		return s;
	}

	/**
	 * Shuffles an array.
	 * @param target
	 * @returns {T}
	 */
	export function shuffle<T extends ArrayLikeWritable<any>>(target:T):T
	{
		return arrayShuffle(target);
	}

	/**
	 * Creates a copy of an array-like  and returns it shuffled.
	 * @param source
	 * @returns {T[]}
	 */
	export function copy<T>(source:ArrayLike<T>):T[]
	{
		return arrayShuffle(arrayCopy(source));
	}

	/**
	 * Returns a distinct random set from the source array up to the maxCount or the full length of the array.
	 * @param source
	 * @param maxCount
	 * @returns {any}
	 */
	export function select<T>(source:ArrayLike<T>, maxCount:number):T[]
	{
		if(maxCount!==Infinity) Integer.assertZeroOrGreater(maxCount);
		switch (maxCount) {
			case 0:
				return [];
			case 1:
				return [select.one(source, true)];
			default:
				let result = arrayShuffle(arrayCopy(source));
				if(maxCount<result.length)
					result.length = maxCount;
				return result;

		}

	}

	export module select
	{
		/**
		 * Returns random value from an array.
		 * @param source
		 * @param throwIfEmpty
		 */
		export function one<T>(source:ArrayLike<T>, throwIfEmpty:true):T
		export function one<T>(source:ArrayLike<T>, throwIfEmpty?:boolean):T|undefined
		export function one<T>(source:ArrayLike<T>, throwIfEmpty?:boolean):T|undefined
		{
			if(source && source.length)
				return source[r(source.length)];

			if(throwIfEmpty)
				throw "Cannot select from an empty set.";
		}
	}
}

export default Random;