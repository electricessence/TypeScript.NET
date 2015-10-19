/*
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


	export function random(max:number):number
	{
		return (Math.random()*max) | 0;
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
