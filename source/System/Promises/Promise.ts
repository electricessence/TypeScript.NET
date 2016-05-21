/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * The following code is heavily influenced by Q (https://github.com/kriskowal/q) and uses Q's spec.
 */

/*
 * Note about Promise class and pattern:
 * A promise is effectively an Observable/Lazy object that clears it's observers after reporting.
 * It simplifies the class architecture by not allow for 'unsubscribe'.
 */

import Type from "../Types";
import {ObjectPool} from "../Disposable/ObjectPool";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {DisposableBase} from "../Disposable/DisposableBase";
import {IDisposable} from "../Disposable/IDisposable";
import {deferImmediate} from "../Tasks/deferImmediate";
import {Functions} from "../Functions";
import {Lazy} from "../Lazy";
import * as PromiseCallbacks from "./Callbacks";
import {IPromiseCallbacks} from "./Callbacks";
import * as PromiseMethods from "./Methods";


const VOID0:any = void 0;

var deferPool:ObjectPool<Defer<any>>;
function deferFactory():Defer<any>;
function deferFactory(recycle?:Defer<any>):void;
function deferFactory(recycle?:Defer<any>):Defer<any>
{
	if(!deferPool)
		deferPool
			= new ObjectPool<Defer<any>>(40, ()=>new Defer<any>());
	if(!recycle) return deferPool.take();
	recycle.dispose();
	deferPool.add(recycle);
}

export function defer<T>():Defer<T>
{
	return deferFactory();
}

export function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, "then", Type.FUNCTION);
}


function resolve<T>(value:PromiseMethods.Resolution<T>):PromiseLike<T>
{
	if(isPromise(value)) return value;
	return new FulfilledPromise(value);
}

function reject<T>(err:any):PromiseLike<T>
{
	return new RejectedPromise(err);
}


export class Defer<T> implements IDisposable
{
	private _pending:IPromiseCallbacks<T>[]; // undefined == not initialized.  null == done.
	private _final:PromiseLike<T>;

	dispose():void
	{
		this._pending = VOID0;
		this._final = VOID0;
		this._promiseLazy = VOID0;
	}

	resolve(value:T):void
	{
		let _ = this, p = _._pending;
		if(p===VOID0) _._pending = p = [];

		if(p)
		{
			let r = _._final = resolve<T>(value);
			_._pending = null;

			let pl = _._promiseLazy, pe:any = pl && pl.isValueCreated && pl.value;
			if(pe instanceof PendingPromise)
				pe._state = Promise.State.Fulfilled;

			for(let c of p) PromiseCallbacks.release(r,c);
			p.length = 0;
			p = null;
		}
	}

	reject(err:any):void
	{
		let _ = this, p = _._pending;
		if(p===VOID0) _._pending = p = [];

		if(p)
		{
			let r = _._final = reject(err);
			_._pending = null;

			let pl = _._promiseLazy, pe:any = pl && pl.isValueCreated && pl.value;
			if(pe instanceof PendingPromise)
				pe._state = Promise.State.Rejected;

			for(let c of p) PromiseCallbacks.release(r,c);
			p.length = 0;
			p = null;
		}
	}

	get promise():PromiseLike<T>
	{
		return this.promiseLazy.value;
	}

	// Why?  Because this way it's possible to do a reverse lazy through the promise chain.
	// The promise is not triggered unless/until called for.
	private _promiseLazy:Lazy<PromiseLike<T>>;
	get promiseLazy():Lazy<PromiseLike<T>>
	{
		var _ = this;
		var pr = _._promiseLazy;
		if(!pr) _._promiseLazy = pr = new Lazy(()=>Defer._getPromise(_));
		return pr;
	}

	private static _getPromise<T>(d:Defer<T>):PromiseLike<T>
	{
		return d._final || new PendingPromise((
				onFulfilled:(value:T)=>any,
				onRejected:(err:any)=>any)=>
			{
				onFulfilled = onFulfilled || Functions.Identity;
				onRejected = onRejected || reject;

				var result = deferFactory();
				var f = (v:T)=> { result.resolve(onFulfilled(v)) },
				    e = (v:any)=> { result.resolve(onRejected(v)) };

				let pe = d._pending;
				if(pe===VOID0) pe = d._pending = [];

				if(pe)
					pe.push(PromiseCallbacks.init(f, e));
				else
				{
					let r = d._final;
					deferImmediate(()=>r.then(f, e));
				}

				return result.promise;
			})
	}
}


export interface IPromise<T> extends PromiseLike<T>
{
	state:Promise.State;
	isResolved:boolean;
	isFulfilled:boolean;
	isRejected:boolean;
	result:T;
	error:any;
}

export abstract class PromiseBase<T>
extends DisposableBase implements IPromise<T>
{

	constructor(
		protected _result?:T,
		protected _error?:any,
		state?:Promise.State)
	{
		super();
		if(state===VOID0)
		{
			if(_error)
				this._state = Promise.State.Rejected;

			if(_result!==VOID0)
				this._state = Promise.State.Fulfilled;
		}
		else
		{
			this._state = state;
		}
	}


	protected _onDispose():void
	{
		this._state = Promise.State.Disposed;
		this._result = VOID0;
		this._error = VOID0;
	}

	protected _state:Promise.State;
	get state():Promise.State
	{
		return this._state;
	}

	get isResolved():boolean
	{
		var s = this._state;
		return isFinite(s) && s>Promise.State.Pending;
	}

	get isFulfilled():boolean
	{
		return this._state===Promise.State.Fulfilled;
	}

	get isRejected():boolean
	{
		return this._state===Promise.State.Rejected;
	}

	get result():T
	{
		return this._result;
	}

	get error():any
	{
		return this._error;
	}

	abstract then<TResult>(
		onFulfilled:PromiseMethods.Fulfill<T,TResult>,
		onRejected?:PromiseMethods.Reject<TResult>):PromiseLike<TResult>;
}


export class FulfilledPromise<T> extends PromiseBase<T>
{
	constructor(value:T)
	{
		super(value, VOID0, Promise.State.Fulfilled);
	}

	then<TResult>(
		onFulfilled:PromiseMethods.Fulfill<T,TResult>):PromiseLike<TResult>
	{
		var _ = this;
		_.throwIfDisposed();

		if(!onFulfilled) onFulfilled = Functions.Identity;

		let result = deferFactory();
		let r = this._result;
		deferImmediate(()=> result.resolve(onFulfilled(r)));
		return result.promise;
	}
}
export class RejectedPromise<T> extends PromiseBase<T>
{
	constructor(err:any)
	{
		super(VOID0, err, Promise.State.Rejected);
	}

	then<TResult>(
		onFulfilled:PromiseMethods.Fulfill<T,TResult>,
		onRejected?:PromiseMethods.Reject<TResult>):PromiseLike<TResult>
	{
		var _ = this;
		_.throwIfDisposed();

		if(!onRejected) onRejected = reject;

		let result = deferFactory();
		let e = this._error;
		deferImmediate(()=> result.resolve(onRejected(e)));
		return result.promise;
	}

}

class PendingPromise<T> extends PromiseBase<T>
{

	constructor(
		private _execute:(
			resolve:(value:T | PromiseLike<T>) => void,
			reject?:(reason:any) => void) => PromiseLike<any>)
	{
		super();
		if(!_execute) throw new ArgumentNullException('_execute');
		this._state = Promise.State.Pending;
	}

	then<TResult>(
		onFulfilled:PromiseMethods.Fulfill<T,TResult>,
		onRejected?:PromiseMethods.Reject<TResult>):PromiseLike<TResult>
	{
		return this._execute(onFulfilled, onRejected);
	}
}


export class Promise<T> extends PromiseBase<T>
{

	constructor(
		private _execute:(
			resolve:(value:T | PromiseLike<T>) => void,
			reject?:(reason:any) => void) => void)
	{
		super();
		if(!_execute) throw new ArgumentNullException('_execute');
		this._state = Promise.State.Ready;
	}


	reset():void
	{
		this.throwIfDisposed();
		this._state = Promise.State.Ready;
	}

	private _listeners:Promise<any>[];

	protected _getListeners():Promise<any>[]
	{
		this.throwIfDisposed();
		var l = this._listeners;
		if(!l) this._listeners = [];
		return l;
	}

	protected _onDispose():void
	{
		if(this._listeners)
		{
			this._listeners.length = 0;
			this._listeners = null;
		}
		super._onDispose();
	}

	dispatch():void
	{

	}

	ensure():Promise<T>
	{
		this.throwIfDisposed();
		// Just in case subsequent code calls ensure we only want to actually call execute if in a ready state.
		if(this._state===Promise.State.Ready)
		{
			this._state = Promise.State.Pending;
			this._execute(
				(value:T | PromiseLike<T>)=>this._onResolve(value),
				(reason:any) => this._onReject(reason));
		}
		return this;
	}

	protected _onResolve(value:T | PromiseLike<T>):void
	{
		var l = this._listeners;
		this._listeners = null;
		this.state = Promise.State.Fulfilled;
		if(l) for(let e of l)
		{
			// Deferring ensure that any subsequent exceptions don't affect the other listeners and we don't have to trap them.
			//deferImmediate(()=>e(value));
		}
		l.length = 0;
		this._onFinally();
	}

	protected _onReject(reason:any):void
	{
		var l = this._listeners;
		this._listeners = null;
		this.state = Promise.State.Rejected;
		if(l) for(let e of l)
		{
			// Deferring ensure that any subsequent exceptions don't affect the other listeners and we don't have to trap them.
			//deferImmediate(()=>e(reason));
		}
		l.length = 0;
		this._onFinally();
	}

	protected _onFinally():void
	{
	}

	then<TResult>(
		onFulfilled?:(value:T)=>(PromiseLike<TResult>|TResult),
		onRejected?:(reason:any)=>(void|PromiseLike<TResult>|TResult)):PromiseLike<TResult>

	{
		return null;
		//
		// var self = this;
		// var deferred = deferFactory();
		// var done = false;   // ensure the untrusted promise makes at most a
		//                    // single call to one of the callbacks
		//
		// function _fulfilled(value)
		// {
		// 	try
		// 	{
		// 		return typeof fulfilled==="function" ? fulfilled(value) : value;
		// 	}
		// 	catch(exception)
		// 	{
		// 		return reject(exception);
		// 	}
		// }
		//
		// function _rejected(exception)
		// {
		// 	if(typeof rejected==="function")
		// 	{
		// 		makeStackTraceLong(exception, self);
		// 		try
		// 		{
		// 			return rejected(exception);
		// 		}
		// 		catch(newException)
		// 		{
		// 			return reject(newException);
		// 		}
		// 	}
		// 	return reject(exception);
		// }
		//
		// function _progressed(value)
		// {
		// 	return typeof progressed==="function" ? progressed(value) : value;
		// }
		//
		// Q.nextTick(function()
		// {
		// 	self.promiseDispatch(function(value)
		// 	{
		// 		if(done)
		// 		{
		// 			return;
		// 		}
		// 		done = true;
		//
		// 		deferred.resolve(_fulfilled(value));
		// 	}, "when", [
		// 		function(exception)
		// 		{
		// 			if(done)
		// 			{
		// 				return;
		// 			}
		// 			done = true;
		//
		// 			deferred.resolve(_rejected(exception));
		// 		}
		// 	]);
		// });
		//
		// // Progress propagator need to be attached in the current tick.
		// self.promiseDispatch(void 0, "when", [
		// 	void 0, function(value)
		// 	{
		// 		var newValue;
		// 		var threw = false;
		// 		try
		// 		{
		// 			newValue = _progressed(value);
		// 		}
		// 		catch(e)
		// 		{
		// 			threw = true;
		// 			if(Q.onerror)
		// 			{
		// 				Q.onerror(e);
		// 			}
		// 			else
		// 			{
		// 				throw e;
		// 			}
		// 		}
		//
		// 		if(!threw)
		// 		{
		// 			deferred.notify(newValue);
		// 		}
		// 	}
		// ]);
		//
		// return deferred.promise;
	}

}


export module Promise
{

	export function fulfilled<T>(value:T):IPromise<T>
	{
		return new FulfilledPromise(value);
	}

	export function rejected<T>(err:any):IPromise<T>
	{
		return new RejectedPromise<T>(err);
	}

	export enum State {
		Ready     = -1,
		Pending   = 0,
		Fulfilled = 1,
		Rejected  = 2,
		Disposed  = Infinity
	}
	Object.freeze(State);
}

export default Promise;