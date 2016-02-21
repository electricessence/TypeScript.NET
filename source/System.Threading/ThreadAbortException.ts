/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.threading.threadabortexception%28v=vs.110%29.aspx
 */

import Exception from "../System/Exception";

const NAME:string = 'ThreadAbortException';

export default
class ThreadAbortException extends Exception {

	protected getName():string
	{
		return NAME;
	}
}
