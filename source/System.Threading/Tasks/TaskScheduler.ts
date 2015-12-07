

///<reference path="../../System/Collections/Array/IArray"/>
///<reference path="ITaskScheduler.d.ts"/>
import Task from './Task';
import Queue from '../../System/Collections/Queue';

var _lastId:number = 0 | 0;
var _defaultScheduler:TaskScheduler;
var _currentScheduler:ITaskScheduler;

const MAX_INT32_SIGNED = 2147483647 | 0;


export default class TaskScheduler implements ITaskScheduler
{
	constructor(private _maximumConcurrencyLevel:number = MAX_INT32_SIGNED)
	{
		this._id = ++_lastId;
		this._queue = new Queue<ITask<any>>();
	}

	static get current():ITaskScheduler
	{
		return _currentScheduler || TaskScheduler.defaultInstance;
	}

	static get defaultInstance():ITaskScheduler
	{
		if(!_defaultScheduler) _defaultScheduler = new TaskScheduler();
		return _defaultScheduler;
	}

	static fromCurrentSynchronizationContext():ITaskScheduler
	{
		return null;// placeholder.
	}


	private _id:number;
	get id():number // int
	{
		return this._id;
	}

	get maximumConcurrencyLevel():number //int
	{
		return this._maximumConcurrencyLevel;
	}

	private _queue:Queue<ITask<any>>;
	_getScheduledTasks():IArray<ITask<any>>
	{
		return this._queue.toArray();
	}

	private _workerId:number;

	private _ensureWorkerReady():void
	{
		var _ = this;
		if(!_._workerId)
		{
			_._workerId = setTimeout(() =>
			{
				_._workerId = 0;
				//noinspection JSUnusedAssignment
				_currentScheduler = this;
				while(_._queue.count)
				{
					_._tryExecuteTask(_._queue.dequeue());
				}
				_currentScheduler = null;
			});
		}
	}

	queueTask<T>(task:ITask<T>):void
	{
		if(!task)
			throw new Error("ArgumentNullException");
		this._queue.enqueue(task);
		this._ensureWorkerReady();
	}

	// Internal
	_tryDequeue<T>(task:ITask<T>):boolean
	{
		return this._queue.remove(task)!==0;
	}

	// Internal
	_tryExecuteTask<T>(task:ITask<T>):boolean
	{
		if((<any>task)['_executingTaskScheduler']!=this)
			throw new Error("Executed Task on wrong TaskScheduler.");

		return (<any>task)['_executeEntry'](true);
	}


	// Internal
	tryExecuteTaskInline<T>(task:ITask<T>, taskWasPreviouslyQueued:boolean):boolean
	{
		if(taskWasPreviouslyQueued && !this._tryDequeue(task))
			return false;

		return this._tryExecuteTask(task);
	}


}
