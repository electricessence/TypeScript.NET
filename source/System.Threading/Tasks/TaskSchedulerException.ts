/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.threading.tasks.taskschedulerexception%28v=vs.110%29.aspx
 */

import Exception from "../../System/Exception";

const NAME:string = 'TaskSchedulerException';

export default
class TaskSchedulerException extends Exception {

	protected getName():string
	{
		return NAME;
	}
}
