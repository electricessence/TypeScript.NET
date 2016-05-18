/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

import {Exception} from "../Exception";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {IDisposableAware} from "./IDisposableAware";


const NAME:string = 'ObjectDisposedException';

export class ObjectDisposedException
extends InvalidOperationException
{

	objectName:string;

	// For simplicity and consistency, lets stick with 1 signature.
	constructor(
		objectName:string,
		message:string = null,
		innerException:Exception = null)
	{
		super(message, innerException, (_)=>{
			_.objectName = objectName;
		});
	}


	protected getName():string
	{
		return NAME;
	}

	toString():string
	{
		var _ = this, oName = _.objectName;
		oName = oName ? ('{' + oName + '} ') : '';

		return '[' + _.name + ': ' + oName + _.message + ']';
	}

	static throwIfDisposed(
		disposable:IDisposableAware,
		objectName?:string,
		message?:string):void
	{
		if(disposable.wasDisposed)
			throw new ObjectDisposedException(objectName, message);
	}

}

export default ObjectDisposedException;