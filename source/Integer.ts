/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import TypeOf from "./Reflection/TypeOf";
import ArgumentException from "./Exceptions/ArgumentException";
import ArgumentLessThanMinimumException from "./Exceptions/ArgumentLessThanMinimumException";

function Integer(n:number):number
{
	return Math.floor(n);
}

module Integer
{
	export const MAX_32_BIT:number = 2147483647;
	export const MAX_VALUE:number = 9007199254740991;
	const NUMBER = TypeOf.Number;

	/**
	 * Converts any number to its 32bit counterpart.
	 * Throws if conversion is not possible.
	 * @param n
	 * @returns {number}
	 */
	export function as32Bit(n:number):number
	{
		const result = n | 0;
		if(isNaN(n))
			throw "'n' is not a number.";
		if (n!== -1 && result=== -1)
			throw "'n' is too large to be a 32 bit integer.";
		return result;
	}


	/**
	 * Returns true if the value is an integer.
	 * @param n
	 * @returns {boolean}
	 */
	export function is(n:number):boolean
	{
		return typeof n===NUMBER && isFinite(n) && n===Math.floor(n);
	}

	/**
	 * Returns true if the value is within a 32 bit range.
	 * @param n
	 * @returns {boolean}
	 */
	export function is32Bit(n:number):boolean
	{
		return n===(n | 0);
	}


	/**
	 * Throws if not an integer.
	 * @param n
	 * @param argumentName
	 * @returns {boolean}
	 */
	export function assert(n:number, argumentName?:string):true|never
	{
		let i = is(n);
		if(!i)
			throw new ArgumentException(argumentName || 'n', "Must be a integer.");
		return i;
	}

	/**
	 * Throws if less than zero.
	 * @param n
	 * @param argumentName
	 * @returns {boolean}
	 */
	export function assertZeroOrGreater(n:number, argumentName?:string):true|never
	{
		let i = assert(n, argumentName) && n>=0;
		if(!i)
			throw new ArgumentLessThanMinimumException(argumentName || 'n', n, 0);
		return i;
	}

	/**
	 * Throws if not greater than zero.
	 * @param n
	 * @param argumentName
	 * @returns {boolean}
	 */
	export function assertPositive(n:number, argumentName?:string):true|never
	{
		let i = assert(n, argumentName) && n>0;
		if(!i)
			throw new ArgumentLessThanMinimumException(argumentName || 'n', n, 1);
		return i;
	}

}

export default Integer;
