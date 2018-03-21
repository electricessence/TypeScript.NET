/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

import {ArgumentException, Error} from "./ArgumentException";

const NAME:string = 'ArgumentNullException';

export {Error};

export class ArgumentNullException extends ArgumentException
{
	constructor(
		paramName:string,
		message:string = `'${paramName}' is null (or undefined).`,
		innerException?:Error)
	{
		super(paramName, message, innerException);
	}

	protected getName():string
	{
		return NAME;
	}

}

export default ArgumentNullException;