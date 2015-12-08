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

const VOID0:any = void 0;
const STATUS:string = 'status';
const RESULT:string = 'result';

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
	var status:TaskStatus = TaskStatus.Created;
	var timeout:number = 0;
	var taskResult:any;

	var okToRun = ()=>
	{
		if(status<=TaskStatus.WaitingToRun)
		{
			if(timeout) clearTimeout(timeout);
			return true;
		}
		return false;
	};

	var cancel = ()=>
	{
		if(okToRun()) status = TaskStatus.Canceled;
		else return false;

		task = null; // Release reference.
		return true;
	};

	var run = ()=>
	{
		if(okToRun()) status = TaskStatus.Running;
		else return false;

		try
		{
			// No task?  Can still be used to track status.
			if(task) taskResult = task.apply(context, args);
			status = TaskStatus.RanToCompletion;
		}
		catch(ex)
		{
			status = TaskStatus.Faulted;
		}

		task = null; // Release reference.
		return true;
	};

	var defer = (delay:number)=>
	{
		if(okToRun()) status = TaskStatus.WaitingToRun;
		else return false;

		timeout = setTimeout(run, delay);
		return true;
	};

	var result:ISimpleTask<T> = {
		status: VOID0,
		result: VOID0,
		cancel: cancel,
		defer: defer,
		runSynchronous: run
	};

	Object.defineProperty(result, STATUS, {
		get: ()=>status,
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(result, RESULT, {
		get: ()=>taskResult,
		enumerable: true,
		configurable: true
	});

	return Object.freeze(result);
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
