///<reference path="../../System/FunctionTypes.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/TaskFactory.cs
 */

import TaskScheduler from "./TaskScheduler";
import Task from "./Task";
import ArgumentOutOfRangeException from "../../System/Exceptions/ArgumentOutOfRangeException";
export default class TaskFactory
{
	/**
	 * Important public methods:
	 * - startNew
	 * - continueWhenAll
	 * - continueWhenAny
	 * - fromAsync
	 */

	constructor(
		private _cancellationToken?:CancellationToken,
		private _creationOptions:TaskCreationOptions = TaskCreationOptions.None,
		private _continuationOptions:TaskContinuationOptions = TaskContinuationOptions.None,
		private _scheduler?:ITaskScheduler)
	{

	}

	get cancellationToken():CancellationToken
	{
		return this._cancellationToken;
	}

	get creationOptions():TaskCreationOptions
	{
		return this._creationOptions;
	}

	get continuationOptions():TaskContinuationOptions
	{
		return this._continuationOptions;
	}

	get scheduler():ITaskScheduler
	{
		return this._scheduler;
	}

	private get _defaultScheduler():ITaskScheduler
	{
		return this._scheduler || TaskScheduler.current;
	}


	// sister method to above property -- avoids a TLS lookup
	private getDefaultScheduler(task:Task<any>):ITaskScheduler
	{
		var s = this._scheduler;
		if(s) return s;
		else if(task && ((task.creationOptions & TaskCreationOptions.HideScheduler)==0))
			return task._executingTaskScheduler;
		else
			return TaskScheduler.default;
	}


	/*internal*/
	static _checkCreationOptions(creationOptions:TaskCreationOptions):void
	{
		// Check for validity of options
		if((creationOptions & ~(TaskCreationOptions.AttachedToParent |
			TaskCreationOptions.DenyChildAttach |
			TaskCreationOptions.HideScheduler |
			TaskCreationOptions.LongRunning |
			TaskCreationOptions.PreferFairness |
			TaskCreationOptions.RunContinuationsAsynchronously))!=0)
		{
			throw new ArgumentOutOfRangeException("creationOptions", creationOptions);
		}
	}


	startNew<TResult>(
		f:Func<TResult>,
		token?:CancellationToken,
		creationOptions:TaskCreationOptions = TaskCreationOptions.None,
		scheduler?:TaskScheduler):ITask<TResult>
	{

	}

}

