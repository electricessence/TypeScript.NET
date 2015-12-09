/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */


///<reference path="ITask"/>
///<reference path="TaskCreationOptions.d.ts"/>
///<reference path="../../System/Promises/IPromise.d.ts"/>
import Type from "../../System/Types";
import TimeSpan from "../../System/Time/TimeSpan";
import DisposableBase from "../../System/Disposable/DisposableBase";
import CancellationToken from "../CancellationToken";
import TaskFactory from "./TaskFactory";

const _factory:TaskFactory = new TaskFactory();
var _current:Task<any>;


export default class Task<TResult>
extends DisposableBase implements ITask<TResult>
{
	private _scheduler:ITaskScheduler;
	private _parent:Task<any>;

	constructor(
		private _task:(state?:any) => TResult,
		private _asyncState?:any,
		private _cancellationToken?:CancellationToken,
		private _creationOptions:TaskCreationOptions = TaskCreationOptions.None)
	{
		super();
		this._result = void 0; // Assume 'void' in the beginning.
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

	get asyncState():any
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
		return this._status===TaskStatus.Running;
	}

	get isCancelled():boolean
	{
		return this._status===TaskStatus.Canceled;
	}

	get isCompleted():boolean
	{
		return this._status===TaskStatus.RanToCompletion;
	}

	get isFaulted():boolean
	{
		return this._status===TaskStatus.Faulted;
	}

	// #endregion

	static run<TResult>(
			task:(state?:any) => TResult,
			asyncState?:any,
			cancellationToken?:CancellationToken,
			creationOptions:TaskCreationOptions = TaskCreationOptions.None):Task<TResult> {

		var t = new Task<TResult>(task,asyncState,cancellationToken,creationOptions);
		t._startUnsafe();
		return t;
	}

	runSynchronously(scheduler?:ITaskScheduler):void
	{
	}

	protected _startUnsafe(scheduler?:ITaskScheduler):void
	{

	}

	start(scheduler?:ITaskScheduler):void
	{
	}

	then<TResult>(
		onFulfilled:(value:TResult)=>(IPromise<TResult>|TResult),
		onRejected:(reason:any)=>(IPromise<TResult>|TResult)):IPromise<TResult>
	{
		throw 'not implemented yet';
	}


	/**
	 * Waits for the task to be done then passes the task to the continuationAction.
	 * @param continuationAction
	 */
	waitWith(
		continuationAction:(task:ITask<TResult>)=>void):void;

	/**
	 * Waits for the task to be done then passes the task to the continuationAction.
	 * @param continuationAction
	 * @param token
	 */
	waitWith(
		continuationAction:(task:ITask<TResult>)=>void,
		token:CancellationToken):void;

	/**
	 * Waits for the task to be done or milliseconds to pass then passes the task to the continuationAction.
	 * @param continuationAction
	 * @param milliseconds
	 * @param token
	 */
	waitWith(
		continuationAction:(task:ITask<TResult>)=>void,
		milliseconds:number,
		token?:CancellationToken):void;


	/**
	 * Waits for the task to be done or time to pass then passes the task to the continuationAction.
	 * @param continuationAction
	 * @param time
	 * @param token
	 */
	waitWith(
		continuationAction:(task:ITask<TResult>)=>void,
		time:ITimeQuantity,
		token?:CancellationToken):void;

	waitWith(
		continuationAction:(task:ITask<TResult>)=>void,
		timeOrCancel?:CancellationToken | number | ITimeQuantity,
		token?:CancellationToken):void
	{
		if(Type.isInstanceOf<CancellationToken>(timeOrCancel, CancellationToken))
			token = timeOrCancel;

		var milliseconds:number = Type.isNumber(timeOrCancel)
			? timeOrCancel
			: 0;

		if(Type.isInstanceOf<TimeSpan>(timeOrCancel, TimeSpan))
			milliseconds = timeOrCancel.milliseconds;

		// TODO: Above is just the scaffold.  Next up, respond to parameters.

		return null;
	}

	equals(other:Task<TResult>):boolean
	{
		return this===other || this.id===other.id;
	}


	delay(milliseconds:number):ITask<TResult>;
	delay(time:ITimeQuantity):ITask<TResult>;
	delay(time:number|ITimeQuantity):ITask<TResult>
	{
		throw 'not implemented yet';
	}


	continueWith<TContinue>(continuationAction:(task:ITask<TResult>)=>TContinue):ITask<TContinue>;

	continueWith<TContinue>(
		continuationAction:(task:ITask<TResult>)=>TContinue,
		continuationOptions:TaskContinuationOptions,
		scheduler:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue>(
		continuationAction:(task:ITask<TResult>)=>TContinue,
		scheduler:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue>(
		continuationAction:(task:ITask<TResult>)=>TContinue,
		cancellationToken:CancellationToken,
		continuationOptions:TaskContinuationOptions,
		scheduler:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue, TState>(
		continuationAction:(
			task:ITask<TResult>,
			state:TState)=>TContinue,
		state:TState,
		cancellationToken:CancellationToken,
		continuationOptions:TaskContinuationOptions,
		scheduler:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue, TState>(
		continuationAction:(
			task:ITask<TResult>,
			state:TState)=>TContinue,
		state:TState,
		continuationOptions:TaskContinuationOptions,
		scheduler:ITaskScheduler):ITask<TContinue>;

	continueWith<TContinue, TState>(
		continuationAction:(
			task:ITask<TResult>,
			state:TState)=>TContinue,
		a?:TState|CancellationToken|ITaskScheduler|TaskContinuationOptions,
		b?:CancellationToken|ITaskScheduler|TaskContinuationOptions,
		c?:ITaskScheduler|TaskContinuationOptions,
		d?:ITaskScheduler):ITask<TContinue>
	{
		throw 'not implemented yet';
	}

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

	ChildReplica        = 0x0100,
	ContinuationTask    = 0x0200,
	PromiseTask         = 0x0400,
	SelfReplicating     = 0x0800,

	/**
	 *  Store the presence of TaskContinuationOptions.LazyCancellation, since it does not directly
	 *  translate into any TaskCreationOptions.
	 */
	LazyCancellation    = 0x1000,

	/**
	 * Specifies that the task will be queued by the runtime before handing it over to the user.
	 *  This flag will be used to skip the cancellation-token registration step, which is only meant for unstarted tasks.
	 */
	QueuedByRuntime     = 0x2000,

	/**
	 *  Denotes that Dispose should be a complete nop for a Task.  Used when constructing tasks that are meant to be cached/reused.
	 */
	DoNotDispose        = 0x4000
}
