/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.operationcanceledexception%28v=vs.110%29.aspx
 */

import SystemException from "../../System/Exceptions/SystemException";

const NAME:string = 'OperationCancelledException';

export default
class OperationCancelledException extends SystemException {

	protected getName():string
	{
		return NAME;
	}
}
