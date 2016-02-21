/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.threading.tasks.taskcanceledexception%28v=vs.110%29.aspx
 */

import OperationCancelledException from "../../System/Exceptions/OperationCancelledException";

const NAME:string = 'TaskCancelledException';

export default
class TaskCancelledException extends OperationCancelledException {

	protected getName():string
	{
		return NAME;
	}
}
