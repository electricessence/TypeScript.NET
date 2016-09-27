/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */

/**
 *  Represents the current stage in the lifecycle of a Task.
 */
export declare const enum TaskStatus
{
	/**
	 *  The task has been initialized but has not yet been scheduled.
	 */
	Created,
	// /**
	//  *  The task is waiting to be activated and scheduled internally by the .NET Framework infrastructure.
	//  */
	// WaitingForActivation,

	/**
	 *  The task has been scheduled for execution but has not yet begun executing.
	 */
	WaitingToRun,
	/**
	 *  The task is running but has not yet completed.
	 */
	Running,
	/**
	 *  The task is currently blocked in a wait state.
	 */
	// Blocked,
	// /**
	//  *  The task has finished executing and is implicitly waiting for
	//  *  attached child tasks to complete.
	//  */
	// WaitingForChildrenToComplete,
	// /**
	//  *  The task completed execution successfully.
	//  */
	RanToCompletion,
	/**
	 *  The task acknowledged cancellation by throwing an OperationCanceledException with its own CancellationToken
	 *  while the token was in signaled state, or the task's CancellationToken was already signaled before the
	 *  task started executing.
	 */
	Cancelled,
	/**
	 *  The task completed due to an unhandled exception.
	 */
	Faulted
}
