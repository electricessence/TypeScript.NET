/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */

/**
 *  Specifies flags that control optional behavior for the creation and execution of tasks.
 */
const enum TaskCreationOptions
{
	/**
	 *  Specifies that the default behavior should be used.
	 */
	None = 0x0,

	/**
	 *  A hint to a TaskScheduler to schedule a
	 *  task in as fair a manner as possible, meaning that tasks scheduled sooner will be more likely to
	 *  be run sooner, and tasks scheduled later will be more likely to be run later.
	 */
	PreferFairness = 0x01,

	/**
	 *  Specifies that a task will be a long-running, course-grained operation. It provides a hint to the
	 *  TaskScheduler that over-subscription may be
	 *  warranted.
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
}

export = TaskCreationOptions;
