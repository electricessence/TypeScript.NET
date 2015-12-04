/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */

///<reference path="ITask"/>

interface ITaskScheduler
{
	id: number; // int
	maximumConcurrencyLevel: number; //int

	queueTask(task:ITask<any>):void;
}
