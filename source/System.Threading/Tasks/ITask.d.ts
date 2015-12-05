/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */

///<reference path="../../System/IEquatable"/>
///<reference path="../../System/Disposable/IDisposable"/>
///<reference path="../CancellationToken.d.ts"/>
///<reference path="ITaskScheduler"/>
///<reference path="TaskCreationOptions"/>
///<reference path="TaskStatus"/>
///<reference path="../../System/Time/ITimeQuantity.d.ts"/>
///<reference path="../../System/Promises/IPromise.d.ts"/>
///<reference path="TaskContinuationOptions.d.ts"/>

interface ITask<TResult>
extends IDisposable, IEquatable<ITask<TResult>>, IPromise<TResult>
{
	asyncState: Object;
	creationOptions: TaskCreationOptions;
	exception: Error;
	//factory: TaskFactory<TResult>;
	id: number; // int
	isRunning: boolean;
	isCancelled: boolean;
	isCompleted: boolean;
	isFaulted: boolean;
	result: TResult;
	status: TaskStatus;

	runSynchronously(scheduler?:ITaskScheduler): void;
	start(scheduler?:ITaskScheduler): void;


	/**
	 * To avoid blocking, wait triggers the continuationAction instead of blocking.
	 * In order to avoid creating unnecessary objects, wait returns void.
	 * If the caller expects to chain tasks, then use 'then' or 'continueWith'.
	 * @param continuationAction
	 */

	waitWith(continuationAction:(task:ITask<TResult>)=>void): void;
	waitWith(continuationAction:(task:ITask<TResult>)=>void, token:CancellationToken): void;
	waitWith(continuationAction:(task:ITask<TResult>)=>void, milliseconds:number, token?:CancellationToken): void;
	waitWith(continuationAction:(task:ITask<TResult>)=>void, time:ITimeQuantity, token?:CancellationToken): void;


	/**
	 * Like it's static counterparts, this will delay by the desired time after the target task is done.
	 * The state and result will be the same as the target task.
	 * @param milliseconds
	 */
	delay(milliseconds:number):ITask<TResult>;
	delay(time:ITimeQuantity):ITask<TResult>;

	//configureAwait(continueOnCapturedContext: boolean): ConfiguredTaskAwaitable<TResult;

	/**
	 * https://msdn.microsoft.com/en-us/library/hh139097%28v=vs.110%29.aspx
	 */

	continueWith<TContinue>(
			continuationAction:(task:ITask<TResult>)=>TContinue):ITask<TContinue>;

	continueWith<TContinue>(
			continuationAction:(task:ITask<TResult>)=>TContinue,
			continuationOptions:TaskContinuationOptions,
			scheduler?:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue>(
			continuationAction:(task:ITask<TResult>)=>TContinue,
			scheduler:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue>(
			continuationAction:(task:ITask<TResult>)=>TContinue,
			cancellationToken:CancellationToken,
			continuationOptions?:TaskContinuationOptions,
			scheduler?:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue,TState>(
			continuationAction:(task:ITask<TResult>,state:TState)=>TContinue,
			state:TState,
			cancellationToken:CancellationToken,
			continuationOptions?:TaskContinuationOptions,
			scheduler?:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue,TState>(
			continuationAction:(task:ITask<TResult>,state:TState)=>TContinue,
			state:TState,
			continuationOptions?:TaskContinuationOptions,
			scheduler?:ITaskScheduler):ITask<TContinue>;

}