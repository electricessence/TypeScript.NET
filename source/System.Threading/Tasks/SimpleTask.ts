///<reference path="ITaskState.d.ts"/>
///<reference path="..\..\System\Promises\IPromise.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/**
 * Prototype for basic tasking.
 * Ironically is not using '.prototype' for functions and could have a memory impact.
 */

///<reference path="ISimpleTask.d.ts"/>
///<reference path="TaskStatus.d.ts"/>

class SimpleTask<T> implements ISimpleTask<T>
{

	constructor(
		context:Object,
		task:(...args:any[])=>T,
		args:any[])
	{
		this._context = context;
		this._task = task;
		this._args = args;
	}

	protected _context:Object;
	protected _task:(...args:any[])=>T;
	protected _args:any[];
	protected _timeout:number;
	protected _status:TaskStatus;
	protected _result:T;
	protected _exception:any;

	protected _okToRun():boolean
	{
		var _ = this;
		if(_._status<=TaskStatus.WaitingToRun)
		{
			if(_._timeout) clearTimeout(_._timeout);
			return true;
		}
		return false;
	}

	get status():TaskStatus
	{
		return this._status;
	}

	get result():T
	{
		return this._result;
	}

	get exception():any
	{
		return this._exception;
	}

	runSynchronous():boolean
	{
		var _ = this;
		if(_._okToRun()) _._status = TaskStatus.Running;
		else return false;

		try
		{
			// No task?  Can still be used to track status.
			if(_._task) _._result = _._task.apply(_._context, _._args);
			_._status = TaskStatus.RanToCompletion;
		}
		catch(ex)
		{
			_._status = TaskStatus.Faulted;
			_._exception = ex;
		}

		_._task = null; // Release reference.
		return true;
	}

	defer(delay:number):boolean
	{
		var _ = this;
		if(_._okToRun()) _._status = TaskStatus.WaitingToRun;
		else return false;

		_._timeout = setTimeout(()=>_.runSynchronous(), delay);
		return true;
	}

	cancel():boolean
	{
		var _ = this;
		if(_._okToRun()) _._status = TaskStatus.Canceled;
		else return false;

		_._task = null; // Release reference.
		return true;
	}

}


export function create<T>(
	task:(...args:any[])=>T,
	...args:any[]):ISimpleTask<T>
{
	return applyInternal(null, task, args);
}

export function apply<T>(
	context:Object,
	task:(...args:any[])=>T,
	...args:any[]):ISimpleTask<T>
{
	return applyInternal(context, task, args);
}

function applyInternal<T>(
	context:Object,
	task:(...args:any[])=>T,
	args:any[]):ISimpleTask<T>
{
	return new SimpleTask<T>(context, task, args);
}

export function defer<T>(
	task:(...args:any[])=>T,
	delay?:number,
	...args:any[]):ISimpleTask<T>
{
	var t = applyInternal(null, task, args);
	t.defer(delay);
	return t;
}
