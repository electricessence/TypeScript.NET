/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

'use strict'; // For compatibility with (let, const, function, class);

import SystemException from './SystemException';


const NAME:string = 'InvalidOperationException';

export default
class InvalidOperationException extends SystemException {

	protected getName():string
	{
		return NAME;
	}

}
