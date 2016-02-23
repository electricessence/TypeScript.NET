/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

'use strict'; // For compatibility with (let, const, function, class);

import Type from '../Types';
import Exception from '../Exception';
import SystemException from './SystemException';
import {trim} from '../Text/Utility';


const NAME:string = 'ArgumentException';

export default
class ArgumentException extends SystemException
{

	paramName:string;

	// For simplicity and consistency, lets stick with 1 signature.
	constructor(
		paramName:string,
		message:string = null,
		innerException:Error = null,
		beforeSealing?:(ex:any)=>void)
	{
		var pn = paramName ? ('{' + paramName + '} ') : '';

		super(trim(pn + message), innerException, (_)=>{
			_.paramName = paramName;
			if(beforeSealing) beforeSealing(_);
		});
	}


	protected getName():string
	{
		return NAME;
	}

	toString():string
	{
		var _ = this;
		return '[' + _.name + ': ' + _.message + ']';
	}

}
