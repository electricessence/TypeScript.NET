/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ArgumentOutOfRangeException, {Error} from "./ArgumentOutOfRangeException";
import Primitive from "../Primitive";
export {Error};

export default class ArgumentGreaterThanMaximumException<T extends Primitive> extends ArgumentOutOfRangeException
{
	readonly maxValue:T;

	constructor(
		paramName:string,
		maxValue:T,
		actualValue:T,
		message:string = `Must be no more than ${maxValue}.`,
		innerException?:Error)
	{
		// @ts-ignore
		this.maxValue = maxValue;

		super(paramName, actualValue, message, innerException);
	}

	protected getName():string
	{
		return 'ArgumentGreaterThanMaximumException';
	}

}
