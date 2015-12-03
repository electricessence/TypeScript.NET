///<reference path="IPromise.d.ts"/>
///<reference path="IDeferred.d.ts"/>
import TaskManager from '../Tasks/TaskManager';
import Type from '../Types';

const VOID0:any = void 0;

declare const enum PromiseStatus {
	Pending   = 0,
	Fulfilled = 1,
	Rejected  = 2
}


interface IPromiseState<T>
{
	pending:[Deferred<any>,(value:T) => any | IPromiseMinimal<any>,(error:any) => any | IPromiseMinimal<any>,Function][];
	processScheduled:boolean;
	status: PromiseStatus;
	value?: T;
	reason?: any;
}

export class Promise<T> implements IPromise<T>
{

	__state:IPromiseState<T>;

	then<U>(
		onFulfill?:(value:T) => U | IPromiseMinimal<U>,
		onReject?:(error:any) => U | IPromiseMinimal<U>,
		onProgress?:Function):IPromise<U>
	{
		var _ = this;
		if(onFulfill===VOID0 && onReject===VOID0 && onProgress===VOID0)
		{
			return _;
		}

		var result = new Deferred<U>();
		var pending = _.__state.pending;
		if(!pending) pending = _.__state.pending || [];
		pending.push([result, onFulfill, onReject, onProgress]);
		if(_.__state.status>0) scheduleProcessQueue(_.__state);

		return result.promise;
	}


	'catch'<U>(onRejected:(reason:any) => U | IPromiseMinimal<U>):IPromise<U>
	{
		return this.then(null, onRejected);
	}


	'finally'(finallyCallback:() => any, onProgress?:Function): IPromise<T>
	{
		return this.then(
			value=>handleCallback(value, true, finallyCallback),
			error=>handleCallback(error, false, finallyCallback),
			onProgress)
	}
}

export class Deferred<T> implements IDeferred<T>
{
	promise:Promise<T>;

	constructor()
	{
		this.promise = new Promise<T>();
	}

	resolve(value:T):void
	{
		var _ = this, p = _.promise;
		if(p.__state.status) return;
		if(value===p)
		{
			_._reject($qMinErr(
				'qcycle',
				"Expected promise to be resolved with value other than itself '{0}'",
				val));
		}
		else
		{
			_._resolve(value);
		}
	}

	reject(reason:any):void
	{
		if(this.promise.__state.status) return;
		this.$$reject(reason);
	}


	protected _resolve(val)
	{
		var then;
		var that = this;
		var done = false;
		try
		{
			if((isObject(val) || isFunction(val))) then = val && val.then;
			if(isFunction(then))
			{
				this.promise.__state.status = -1;
				then.call(val, resolvePromise, rejectPromise, simpleBind(this, this.notify));
			}
			else
			{
				this.promise.__state.value = val;
				this.promise.__state.status = 1;
				scheduleProcessQueue(this.promise.__state);
			}
		}
		catch(e)
		{
			rejectPromise(e);
			exceptionHandler(e);
		}

		function resolvePromise(val)
		{
			if(done) return;
			done = true;
			that.$$resolve(val);
		}

		function rejectPromise(val)
		{
			if(done) return;
			done = true;
			that.$$reject(val);
		}
	}

	protected _reject(reason)
	{
		var state = this.promise.__state;
		state.value = reason;
		state.status = PromiseStatus.Rejected;
		scheduleProcessQueue(this.promise.__state);
	}

	notify(progress:any):void
	{
		var callbacks = this.promise.__state.pending;

		if((this.promise.__state.status<=0) && callbacks && callbacks.length)
		{
			TaskManager.defer(()=>
			{
				var callback, result;
				for(var i = 0, ii = callbacks.length; i<ii; i++)
				{
					result = callbacks[i][0];
					callback = callbacks[i][3];
					try
					{
						result.notify(Type.isFunction(callback) ? callback(progress) : progress);
					}
					catch(e)
					{
						console.error(e);
					}
				}
			});
		}
	}

}


function simpleBind(context:any, fn:Function):Function {
	return function(value:any) {
		fn.call(context, value);
	};
}

function processQueue<T>(state:IPromiseState<T>):void {
	var fn:any, deferred:Deferred<T>;
	var pending = state.pending;

	state.processScheduled = false;
	state.pending = undefined;
	for(let s of pending) {
		deferred = s[0];
		fn = s[state.status];

		try {
			if (Type.isFunction(fn)) {
				deferred.resolve(fn(state.value));
			} else if (state.status === PromiseStatus.Fulfilled) {
				deferred.resolve(state.value);
			} else {
				deferred.reject(state.value);
			}
		} catch (e) {
			deferred.reject(e);
			console.error(e);
		}
	}

}

function scheduleProcessQueue<T>(state:IPromiseState<T>) {
	if (state.processScheduled || !state.pending) return;
	state.processScheduled = true;
	TaskManager.defer(()=>{ processQueue(state); });
}
