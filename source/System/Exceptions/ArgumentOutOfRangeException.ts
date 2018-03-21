/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

import {ArgumentException, Error} from "./ArgumentException";
import {Primitive} from "../Primitive";

const NAME:string = 'ArgumentOutOfRangeException';

export {Error};

export class ArgumentOutOfRangeException extends ArgumentException
{
	actualValue:Primitive | null | undefined;

	constructor(
		paramName:string,
		actualValue:Primitive | null | undefined,
		message:string = ' ',
		innerException?:Error)
	{
		super(paramName, `(${actualValue}) ` + message, innerException, (_)=>
		{
			_.actualValue = actualValue;
		});
	}


	protected getName():string
	{
		return NAME;
	}

}

export default ArgumentOutOfRangeException;