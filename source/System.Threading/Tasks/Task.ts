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
///<reference path="../../System/FunctionTypes.d.ts"/>
import Type from "../../System/Types";
import TimeSpan from "../../System/Time/TimeSpan";
import DisposableBase from "../../System/Disposable/DisposableBase";
import CancellationToken from "../CancellationToken";
import TaskFactory from "./TaskFactory";
import ArgumentNullException from "../../System/Exceptions/ArgumentNullException";
import TaskScheduler from "./TaskScheduler";
import InvalidOperationException from "../../System/Exceptions/InvalidOperationException";
import Exception from "../../System/Exception";
import NullReferenceException from "../../System/Exceptions/NullReferenceException";
import ThreadAbortException from "../ThreadAbortException";
import TaskSchedulerException from "./TaskSchedulerException";
import TaskCancelledException from "./TaskCancelledException";
import AggregateException from "../../System/Exceptions/AggregateException";

const _factory:TaskFactory = new TaskFactory();
var _current:Task<any>;


export default class Task<TResult>
extends DisposableBase implements ITask<TResult>
{
	constructor(
		private _task:(state?:any) => TResult,
		private _asyncState?:any,
		private _parent?:Task<any>,
		private _cancellationToken?:CancellationToken,
		private _options:TaskCreationOptions = TaskCreationOptions.None,
		private _internalOptions?:InternalTaskOptions,
		private _scheduler?:ITaskScheduler)
	{
		super();
		this._result = void 0; // Assume 'void' in the beginning.
		this._stateFlags = TaskState.WaitingForActivation | _options;
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
		return this._options & ~InternalTaskOptions.InternalOptionsMask;
	}

	// #region State
	private _stateFlags:TaskState;

	get status():TaskStatus
	{
		var s:TaskStatus;

		// get a cached copy of the state flags.  This should help us
		// to get a consistent view of the flags if they are changing during the
		// execution of this method.
		var sf = this._stateFlags;

		if((sf & TaskState.Faulted)!=0) s = TaskStatus.Faulted;
		else if((sf & TaskState.Canceled)!=0) s = TaskStatus.Canceled;
		else if((sf & TaskState.RanToCompletion)!=0) s = TaskStatus.RanToCompletion;
		else if((sf & TaskState.WaitingOnChildren)!=0) s = TaskStatus.WaitingForChildrenToComplete;
		else if((sf & TaskState.DelegateInvoked)!=0) s = TaskStatus.Running;
		else if((sf & TaskState.Started)!=0) s = TaskStatus.WaitingToRun;
		else if((sf & TaskState.WaitingForActivation)!=0) s = TaskStatus.WaitingForActivation;
		else s = TaskStatus.Created;

		return s;
	}

	get isCancelled():boolean
	{
		return (this._stateFlags & (TaskState.Canceled | TaskState.Faulted))==TaskState.Canceled;
	}

	get isCompleted():boolean
	{
		return taskStateIsCompleted(this._stateFlags);
	}

	get isFaulted():boolean
	{
		// Faulted is "king" -- if that bit is present (regardless of other bits), we are faulted.
		return ((this._stateFlags & TaskState.Faulted)!=0);
	}

	// #endregion

	static run<TResult>(
		task:(state?:any) => TResult,
		asyncState?:any,
		cancellationToken?:CancellationToken,
		creationOptions:TaskCreationOptions = TaskCreationOptions.None,
		scheduler:ITaskScheduler = TaskScheduler.default):Task<TResult>
	{
		return Task._internalStartNew(null, task, asyncState, cancellationToken, scheduler, creationOptions);
	}


	/*internal*/
	static _internalStartNew<TResult>(
		creatingTask:Task<any>,
		action:(state?:any) => TResult,
		state:any,
		cancellationToken:CancellationToken,
		scheduler:ITaskScheduler,
		options:TaskCreationOptions = TaskCreationOptions.None,
		internalOptions:InternalTaskOptions = InternalTaskOptions.None
		/*, ref stackMark:StackCrawlMark*/):Task<TResult>
	{
		// Validate arguments.
		if(!scheduler)
			throw new ArgumentNullException("scheduler");

		// Create and schedule the task. This throws an InvalidOperationException if already shut down.
		// Here we add the InternalTaskOptions.QueuedByRuntime to the internalOptions, so that TaskConstructorCore can skip the cancellation token registration
		var t = new Task(
			action, state, creatingTask, cancellationToken, options,
			internalOptions | InternalTaskOptions.QueuedByRuntime,
			scheduler);
		//t.PossiblyCaptureContext(ref stackMark);

		t._scheduleAndStart(false);
		return t;
	}

	/**
	 *  OR-in newBits to m_stateFlags, while making sure that
	 *    no illegalBits are set.  Returns true on success, false on failure.
	 */
	private _stateUpdate(newBits:number, illegalBits:number):boolean
	{
		do
		{
			var oldFlags = this._stateFlags;
			if((oldFlags & illegalBits)!=0) return false;
			this._stateFlags = oldFlags | newBits;
		}
		while(this._stateFlags!=oldFlags);

		return true;
	}

	private _markStarted():boolean
	{
		return this._stateUpdate(TaskState.Started, TaskState.Canceled | TaskState.Started);
	}

	/*internal*/
	_scheduleAndStart(needsProtection:boolean):void
	{
		var _ = this;
		var scheduler = _._scheduler;

		if(!scheduler) throw new InvalidOperationException("expected a task scheduler to have been selected");
		if((_._stateFlags & TaskState.Started)==0) throw new InvalidOperationException("task has already started");

		// Set the TASK_STATE_STARTED bit
		if(needsProtection)
		{
			if(!this._markStarted())
			{
				// A cancel has snuck in before we could get started.  Quietly exit.
				return;
			}
		}
		else
		{
			_._stateFlags |= TaskState.Started;
		}

		//if(s_asyncDebuggingEnabled)
		//{
		//	AddToActiveTasks(this);
		//}

		//if (AsyncCausalityTracer.LoggingOn && (Options & (TaskCreationOptions)InternalTaskOptions.ContinuationTask) == 0)
		//{
		//	//For all other task than TaskContinuations we want to log. TaskContinuations log in their constructor
		//	AsyncCausalityTracer.TraceOperationCreation(CausalityTraceLevel.Required, this.Id, "Task: "+((Delegate)m_action).Method.Name, 0);
		//}


		try
		{
			// Queue to the indicated scheduler.
			scheduler.internalQueueTask(this);
		}
		catch(e)
		{
			if(e instanceof ThreadAbortException)
			{
				_._addException(e);
				_._finishThreadAbortedTask(true, false);
				return;
			}

			// The scheduler had a problem queueing this task.  Record the exception, leaving this task in
			// a Faulted state.
			_._addException(new TaskSchedulerException(e));
			_._finish(false);

			// Now we need to mark ourselves as "handled" to avoid crashing the finalizer thread if we are called from StartNew()
			// or from the self replicating logic, because in both cases the exception is either propagated outside directly, or added
			// to an enclosing parent. However we won't do this for continuation tasks, because in that case we internally eat the exception
			// and therefore we need to make sure the user does later observe it explicitly or see it on the finalizer.

			if((_._options & /*<TaskCreationOptions>*/InternalTaskOptions.ContinuationTask)==0)
			{
				m_contingentProperties.m_exceptionsHolder.MarkAsHandled(false);
			}
			// re-throw the exception wrapped as a TaskSchedulerException.
			throw tse;
		}
	}

	private _exceptionsHolder:{exception:any,cancellation:boolean}[];

	_addException(exceptionObject:any, representsCancellation:boolean)
	{
		if(!exceptionObject) throw new ArgumentNullException("exceptionObject", "Task.addException: Expected a non-null exception object");

		var holder = this._exceptionsHolder;
		if(!holder) this._exceptionsHolder = holder = [];

		holder.push({exception: exceptionObject, cancellation: representsCancellation});
	}

	/**
	 * Returns a list of exceptions by aggregating the holder's contents. Or null if
	 * no exceptions have been thrown.
	 * @param {boolean} includeTaskCanceledExceptions Whether to include a TCE if cancelled.
	 * @returns {any} An aggregate exception, or null if no exceptions have been caught.
	 */
	private getExceptions(includeTaskCanceledExceptions:boolean):any //AggregateException
	{


		// We'll lazily create a TCE if the task has been canceled.
		var canceledException:Exception = null;
		if(includeTaskCanceledExceptions && this.isCancelled)
		{
			canceledException = new TaskCancelledException(this);
		}

		if(this.exceptionRecorded)
		{
			// No need to lock around this, as other logic prevents the consumption of exceptions
			// before they have been completely processed.
			return m_contingentProperties.m_exceptionsHolder.CreateExceptionObject(false, canceledException);
		}
		else if(canceledException!=null)
		{
			// No exceptions, but there was a cancellation. Aggregate and return it.
			return new AggregateException(canceledException);
		}

		return null;
	}

	private static completedTask(
		canceled?:boolean,
		creationOptions?:TaskCreationOptions,
		ct?:CancellationToken):Task<void>
	{
		var task = new Task<void>();
		if(canceled)
		{
			task._stateFlags = TaskState.Canceled | TaskState.CancellationAcknowledged | creationOptions;
			//ContingentProperties props;
			//m_contingentProperties = props = new ContingentProperties(); // can't have children, so just instantiate directly
			//props.m_cancellationToken = ct;
			//props.m_internalCancellationRequested = CANCELLATION_REQUESTED;
		}
		else
			task._stateFlags = TaskState.RanToCompletion | creationOptions;

		return task;
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
		if(timeOrCancel instanceof CancellationToken)
			token = timeOrCancel;

		var milliseconds:number = Type.isNumber(timeOrCancel)
			? timeOrCancel
			: 0;

		if(timeOrCancel instanceof TimeSpan)
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


const enum TaskState {

	/*
	 State constants for m_stateFlags;
	 The bits of m_stateFlags are allocated as follows:
	   0x40000000 - TaskBase state flag
	   0x3FFF0000 - Task state flags
	   0x0000FF00 - internal TaskCreationOptions flags
	   0x000000FF - publicly exposed TaskCreationOptions flags

	 See TaskCreationOptions for bit values associated with TaskCreationOptions
	*/

	OptionsMask                = 0xFFFF, // signifies the Options portion of m_stateFlags bin: 0000 0000 0000 0000 1111 1111 1111 1111
	Started                    = 0x10000, //bin: 0000 0000 0000 0001 0000 0000 0000 0000
	DelegateInvoked            = 0x20000, //bin: 0000 0000 0000 0010 0000 0000 0000 0000
	Disposed                   = 0x40000, //bin: 0000 0000 0000 0100 0000 0000 0000 0000
	Exceptionobservedbyparent  = 0x80000, //bin: 0000 0000 0000 1000 0000 0000 0000 0000
	CancellationAcknowledged   = 0x100000, //bin: 0000 0000 0001 0000 0000 0000 0000 0000
	Faulted                    = 0x200000, //bin: 0000 0000 0010 0000 0000 0000 0000 0000
	Canceled                   = 0x400000, //bin: 0000 0000 0100 0000 0000 0000 0000 0000
	WaitingOnChildren          = 0x800000, //bin: 0000 0000 1000 0000 0000 0000 0000 000
	RanToCompletion            = 0x1000000, //bin: 0000 0001 0000 0000 0000 0000 0000 0000
	WaitingForActivation       = 0x2000000, //bin: 0000 0010 0000 0000 0000 0000 0000 0000
	CompletionReserved         = 0x4000000, //bin: 0000 0100 0000 0000 0000 0000 0000 0000
	ThreadWasAborted           = 0x8000000, //bin: 0000 1000 0000 0000 0000 0000 0000 0000
	WaitCompletionNotification = 0x10000000, //bin: 0001 0000 0000 0000 0000 0000 0000 0000
	//This could be moved to InternalTaskOptions enum
	ExecutionContextIsNull     = 0x20000000, //bin: 0010 0000 0000 0000 0000 0000 0000 0000
	TaskScheduledWasFired      = 0x40000000, //bin: 0100 0000 0000 0000 0000 0000 0000 0000

	// A mask for all of the final states a task may be in
	CompletedMask              = Canceled | Faulted | RanToCompletion,

	// Values for ContingentProperties.m_internalCancellationRequested.
	CancellationRequested      = 0x1
}

function taskStateIsCompleted(flags:TaskState):boolean
{
	return (flags & TaskState.CompletedMask)!=0;
}
