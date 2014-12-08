///<reference path="../../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import IArray = System.Collections.IArray;
import Queue = System.Collections.Queue;

module System.Threading.Tasks
{
	export interface ITaskScheduler
	{
		id: number; // int
		maximumConcurrencyLevel: number; //int

		queueTask(task: Task<any>):void;
	}

	var _lastId: number = 0 | 0;
	var _defaultScheduler: TaskScheduler;
	var _currentScheduler: ITaskScheduler;

	var MAX_INT32_SIGNED = 2147483647 | 0;
	

	export class TaskScheduler implements ITaskScheduler
	{
		constructor(private _maximumConcurrencyLevel: number = MAX_INT32_SIGNED)
		{
			this._id = ++_lastId;
			this._queue = new Queue<Task<any>>();
		}

		static get current(): ITaskScheduler
		{
			return _currentScheduler || TaskScheduler.default;
		}

		static get default(): ITaskScheduler
		{
			if (!_defaultScheduler) _defaultScheduler = new TaskScheduler();
			return _defaultScheduler;
		}

		static fromCurrentSynchronizationContext(): ITaskScheduler
		{
			return null;// placeholder.
		}


		private _id: number;
		get id(): number // int
		{
			return this._id;
		}

		get maximumConcurrencyLevel(): number //int
		{
			return this._maximumConcurrencyLevel;
		}

		private _queue: Queue<Task<any>>;
		_getScheduledTasks(): IArray<ITask<any>>
		{
			return this._queue.toArray();
		}

		private _workerId: number;
		private _ensureWorkerReady(): void
		{
			var _ = this;
			if (!_._workerId)
			{
				_._workerId = setTimeout(() =>
				{
					_._workerId = 0;
					_currentScheduler = this;
					while (_._queue.count)
						_._tryExecuteTask(_._queue.dequeue());
					_currentScheduler = null;
				});
			}
		}

		queueTask(task: Task<any>): void
		{
			if (!task)
				throw new Error("ArgumentNullException");
			this._queue.enqueue(task);
			this._ensureWorkerReady();
		}

		// Internal
		_tryDequeue(task: Task<any>): boolean
		{
			return this._queue.remove(task)!==0;
		}

		// Internal
		_tryExecuteTask(task: Task<any>)
		{
			if (task._executingTaskScheduler != this)
				throw new Error("Excecuted Task on wrong TaskScheduler.");

			return task._executeEntry(true);
		}


		// Internal
		tryExecuteTaskInline(task:Task<any>, taskWasPreviouslyQueued: boolean )
		{
			if (taskWasPreviouslyQueued && !this._tryDequeue(task))
				return false;

			return this._tryExecuteTask(task);
		}


	}
} 