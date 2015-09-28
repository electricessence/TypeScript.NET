import Types = require('../../System/Types');
import TimeSpan = require('../../System/Time/TimeSpan');
import DisposableBase = require('../../System/Disposable/DisposableBase');
import CancellationToken = require('../CancellationToken');
import ITask = require('./ITask');
import ITaskScheduler = require('./ITaskScheduler');
import TaskStatus = require('./TaskStatus');
import TaskCreationOptions = require('./TaskCreationOptions');

export class Task<TResult> extends DisposableBase implements ITask<TResult>
{


	constructor(
		private _task:(state?:Object) => TResult,
		private _asyncState?:Object,
		private _cancellationToken?:CancellationToken,
		private _creationOptions:TaskCreationOptions = TaskCreationOptions.None)
	{
		super();
		this._result = undefined; // Assume 'void' in the beginning.
		this._status = TaskStatus.Created;
	}

	private _id:number;
	get id():number
	{
		return this._id;
	}


	private _result:TResult;
	get result():TResult
	{
		return this._result;
	}

	private _exception:Error;
	get exception():Error
	{
		return this._exception;
	}

	get asyncState():Object
	{
		return this._asyncState;
	}

	get creationOptions():TaskCreationOptions
	{
		return this._creationOptions;
	}


	// #region State
	private _status:TaskStatus;
	get status():TaskStatus
	{
		return this._status;
	}

	get isRunning():boolean
	{
		return this._status==TaskStatus.Running;
	}

	get isCancelled():boolean
	{
		return this._status==TaskStatus.Canceled;
	}

	get isCompleted():boolean
	{
		return this._status==TaskStatus.RanToCompletion;
	}

	get isFaulted():boolean
	{
		return this._status==TaskStatus.Faulted;
	}

	// #endregion


	runSynchronously(scheduler?:ITaskScheduler):void
	{
	}

	start(scheduler?:ITaskScheduler):void
	{
	}

	wait():void;
	wait(token:CancellationToken):void;
	wait(milliseconds:number, token?:CancellationToken):void;
	wait(time:TimeSpan, token?:CancellationToken):void;
	wait(
		timeOrCancel?:CancellationToken | number | TimeSpan,
		token?:CancellationToken):void
	{
		if(timeOrCancel instanceof CancellationToken)
			token = timeOrCancel;

		var milliseconds:number
			= Types.isNumber(timeOrCancel)
			? <number>timeOrCancel
			: 0;

		if(timeOrCancel instanceof TimeSpan)
			milliseconds = (<TimeSpan>timeOrCancel).milliseconds;

		// TODO: Above is just the scaffold.  Next up, respond to parameters.

	}

	equals(other:Task<TResult>):boolean
	{
		return this==other || this.id==other.id;
	}

	private _scheduler:ITaskScheduler;
	// Internal...
	get _executingTaskScheduler():ITaskScheduler
	{
		return this._scheduler;
	}

	_executeEntry(bPreventDoubleExecution:boolean):boolean
	{
		/*
		 if (bPreventDoubleExecution || ((Options & (TaskCreationOptions)InternalTaskOptions.SelfReplicating) != 0))
		 {
		 int previousState = 0;

		 // Do atomic state transition from queued to invoked. If we observe a task that's already invoked,
		 // we will return false so that TaskScheduler.ExecuteTask can throw an exception back to the custom scheduler.
		 // However we don't want this exception to be throw if the task was already canceled, because it's a
		 // legitimate scenario for custom schedulers to dequeue a task and mark it as canceled (example: throttling scheduler)
		 if (!AtomicStateUpdate(TASK_STATE_DELEGATE_INVOKED,
		 TASK_STATE_DELEGATE_INVOKED | TASK_STATE_COMPLETED_MASK,
		 ref previousState) && (previousState & TASK_STATE_CANCELED) == 0)
		 {
		 // This task has already been invoked.  Don't invoke it again.
		 return false;
		 }
		 }
		 else
		 {
		 // Remember that we started running the task delegate.
		 m_stateFlags |= TASK_STATE_DELEGATE_INVOKED;
		 }

		 if (!IsCancellationRequested && !IsCanceled)
		 {
		 ExecuteWithThreadLocal(ref t_currentTask);
		 }
		 else if (!IsCanceled)
		 {
		 int prevState = Interlocked.Exchange(ref m_stateFlags, m_stateFlags | TASK_STATE_CANCELED);
		 if ((prevState & TASK_STATE_CANCELED) == 0)
		 {
		 CancellationCleanupLogic();
		 }
		 }
		 */
		return true;
	}
}


/**
 *  Task creation flags which are only used internally.
 */
const enum InternalTaskOptions
{
	/**
	 * Specifies "No internal task options"
	 */
	None,

	/**
	 * Used to filter out internal vs. public task creation options.
	 */
	InternalOptionsMask = 0x0000FF00,

	ChildReplica = 0x0100,
	ContinuationTask = 0x0200,
	PromiseTask = 0x0400,
	SelfReplicating = 0x0800,

	/**
	 *  Store the presence of TaskContinuationOptions.LazyCancellation, since it does not directly
	 *  translate into any TaskCreationOptions.
	 */
	LazyCancellation = 0x1000,

	/**
	 * Specifies that the task will be queued by the runtime before handing it over to the user.
	 *  This flag will be used to skip the cancellation-token registration step, which is only meant for unstarted tasks.
	 */
	QueuedByRuntime = 0x2000,

	/**
	 *  Denotes that Dispose should be a complete nop for a Task.  Used when constructing tasks that are meant to be cached/reused.
	 */
	DoNotDispose = 0x4000
}
