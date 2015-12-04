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


interface ITask<TResult>
extends IDisposable, IEquatable<ITask<TResult>>
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

	//configureAwait(continueOnCapturedContext: boolean): ConfiguredTaskAwaitable<TResult;
	//continueWith >>> many overloads.

	//getAwaiter(): TaskAwaiter<TResult>;

	runSynchronously(scheduler?:ITaskScheduler): void;

	start(scheduler?:ITaskScheduler): void;

	wait():void;
	wait(token:CancellationToken): void;
	wait(milliseconds:number, token?:CancellationToken): void;
	//wait(time: System.TimeSpan, token?: CancellationToken): void;
}