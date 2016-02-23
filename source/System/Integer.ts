/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Type from './Types';
import ArgumentException from './Exceptions/ArgumentException';

function Integer(n:number):number
{
	return n | 0;
}

module Integer
{

	function r(max:number):number {
		return (Math.random()*max) | 0;
	}

	/**
	 * Returns a random integer from zero to the max.
	 * Negative numbers are allowed.
	 *
	 * Examples:<br/>
	 * ```Integer.random(1)``` will return 0 or 1.<br/>
	 * ```Integer.random(-2)``` will return 0, -1, or -2.<br/>
	 *
	 * @param max
	 * @returns {number}
	 */
	export function random(max:number):number
	{
		assert(max,'max');
		if(max==0) return 0;
		max += max > 0 ? 1 : -1;
		return r(max);
	}

	export module random {

		/**
		 * Returns a random integer from zero up to the boundary value.
		 * Negative and fractional numbers are allowed.
		 *
		 * Example:<br/>
		 * ```Integer.random(-2)``` will return 0, or -1.<br/>
		 * ```Integer.random(5)``` will return 0, 1, 2, 3 or 4.<br/>
		 *
		 * @param boundary
		 * @returns {number}
		 */
		export function under(boundary:number):number
		{
			return r(boundary)
		}


	}

	export function is(n:number):boolean
	{
		return Type.isNumber(n, false) && n==(n | 0);
	}

	export function assert(n:number, argumentName?:string):boolean
	{
		var i = is(n);
		if(!i)
		{
			throw new ArgumentException(argumentName || 'n', "Must be an integer.");
		}
		return i;
	}

}

export default Integer;
