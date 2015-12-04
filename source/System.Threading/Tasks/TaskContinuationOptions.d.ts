/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */

/**
 *  Specifies flags that control optional behavior for the creation and execution of continuation tasks.
 */
declare const enum TaskContinuationOptions
{
	/**
	 *  Default = "Continue on any, no task options, run asynchronously"
	 *  Specifies that the default behavior should be used.  Continuations, by default, will
	 *  be scheduled when the antecedent task completes, regardless of the task's final <see
	 *  cref="System.Threading.Tasks.TaskStatus">TaskStatus</see>.
	 */
	None = 0,

	// These are identical to their meanings and values in TaskCreationOptions

	/**
	 *  A hint to a <see cref="System.Threading.Tasks.TaskScheduler">TaskScheduler</see> to schedule a
	 *  task in as fair a manner as possible, meaning that tasks scheduled sooner will be more likely to
	 *  be run sooner, and tasks scheduled later will be more likely to be run later.
	 */
	PreferFairness = 0x01,

	/**
	 *  Specifies that a task will be a long-running, course-grained operation.  It provides
	 *  a hint to the <see cref="System.Threading.Tasks.TaskScheduler">TaskScheduler</see> that
	 *  over-subscription may be warranted.
	 */
	LongRunning = 0x02,
	/**
	 *  Specifies that a task is attached to a parent in the task hierarchy.
	 */
	AttachedToParent = 0x04,

	/**
	 *  Specifies that an InvalidOperationException will be thrown if an attempt is made to attach a child task to the created task.
	 */
	DenyChildAttach = 0x08,
	/**
	 *  Prevents the ambient scheduler from being seen as the current scheduler in the created task.  This means that operations
	 *  like StartNew or ContinueWith that are performed in the created task will see TaskScheduler.Default as the current scheduler.
	 */
	HideScheduler = 0x10,

	/**
	 *  In the case of continuation cancellation, prevents completion of the continuation until the antecedent has completed.
	 */
	LazyCancellation = 0x20,


	// These are specific to continuations

	/**
	 *  Specifies that the continuation task should not be scheduled if its antecedent ran to completion.
	 *  This option is not valid for multi-task continuations.
	 */
	NotOnRanToCompletion = 0x10000,
	/**
	 *  Specifies that the continuation task should not be scheduled if its antecedent threw an unhandled
	 *  exception. This option is not valid for multi-task continuations.
	 */
	NotOnFaulted = 0x20000,
	/**
	 *  Specifies that the continuation task should not be scheduled if its antecedent was canceled. This
	 *  option is not valid for multi-task continuations.
	 */
	NotOnCanceled = 0x40000,
	/**
	 *  Specifies that the continuation task should be scheduled only if its antecedent ran to
	 *  completion. This option is not valid for multi-task continuations.
	 */
	OnlyOnRanToCompletion = NotOnFaulted | NotOnCanceled,
	/**
	 *  Specifies that the continuation task should be scheduled only if its antecedent threw an
	 *  unhandled exception. This option is not valid for multi-task continuations.
	 */
	OnlyOnFaulted = NotOnRanToCompletion | NotOnCanceled,
	/**
	 *  Specifies that the continuation task should be scheduled only if its antecedent was canceled.
	 *  This option is not valid for multi-task continuations.
	 */
	OnlyOnCanceled = NotOnRanToCompletion | NotOnFaulted,
	/**
	 *  Specifies that the continuation task should be executed synchronously. With this option
	 *  specified, the continuation will be run on the same thread that causes the antecedent task to
	 *  transition into its final state. If the antecedent is already complete when the continuation is
	 *  created, the continuation will run on the thread creating the continuation.  Only very
	 *  short-running continuations should be executed synchronously.
	 */
	ExecuteSynchronously = 0x80000
}
