/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */

import Exception = require('../Exception');


const NAME:string = 'SystemException';

class SystemException extends Exception {

	protected getName():string
	{
		return NAME;
	}


}

export = SystemException
