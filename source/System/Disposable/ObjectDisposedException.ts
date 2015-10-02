/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

import Exception = require('../Exception');
import InvalidOperationException = require('../Exceptions/InvalidOperationException');


const NAME:string = 'ObjectDisposedException';

class ObjectDisposedException
extends InvalidOperationException
{

	objectName:string;

	// For simplicity and consistency, lets stick with 1 signature.
	constructor(
		objectName:string,
		message:string = null,
		innerException:Exception = null)
	{
		this.objectName = objectName;
		super(message, innerException);
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

}

export = ObjectDisposedException;
