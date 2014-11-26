///<reference path="../../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Threading.Tasks
{
	export interface ITaskScheduler
	{
		id: number; // int
		maximumConcurrencyLevel: number; //int

		// protected
		getScheduledTasks(): System.Collections.IEnumerable<ITask<any>>;

		queueTask(task: ITask<any>):void;

		tryDequeue(task: ITask<any>): boolean;

		tryExecuteTask(task: ITask<any>): boolean;

		tryExecuteTaskInline(task: ITask<any>): boolean;
	}

	export class TaskScheduler // implements ITaskScheduler
	{
		static get current(): ITaskScheduler
		{
			return null;// placeholder.
		}

		static get default(): ITaskScheduler
		{
			return null;// placeholder.
		}

		static fromCurrentSynchronizationContext(): ITaskScheduler
		{
			return null;// placeholder.
		}


	}
} 