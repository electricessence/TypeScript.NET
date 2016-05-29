/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */

/*
 * Resources:
 * https://promisesaplus.com/
 * https://github.com/kriskowal/q
 */

import Type from "../Types";
import {deferImmediate} from "../Threading/deferImmediate";
import {DisposableBase} from "../Disposable/DisposableBase";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentException} from "../Exceptions/ArgumentException";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {ObjectPool} from "../Disposable/ObjectPool";
import {Set} from "../Collections/Set";
import {defer} from "../Threading/defer";
import {ObjectDisposedException} from "../Disposable/ObjectDisposedException";


const VOID0:any = void 0, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";

function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
}

function resolve<T>(
	value:Promise.Resolution<T>, resolver:(v:Promise.Resolution<T>)=>any,
	promiseFactory:(v:any)=>PromiseBase<any>):PromiseBase<any>
{
	let nextValue = resolver
		? resolver(value)
		: value;

	return nextValue && isPromise(nextValue)
		? Promise.wrap(nextValue)
		: promiseFactory(nextValue);
}

function handleResolution(
	p:Promise<any>,
	value:Promise.Resolution<any>,
	resolver?:(v:Promise.Resolution<any>)=>any):void
{
	try
	{
		let v = resolver ? resolver(value) : value;
		if(p) p.resolve(v);
	}
	catch(ex)
	{ p.reject(ex); }
}

function handleResolutionMethods(
	targetFulfill:Promise.Fulfill<any,any>,
	targetReject:Promise.Reject<any>,
	value:Promise.Resolution<any>,
	resolver?:(v:Promise.Resolution<any>)=>any):void
{
	try
	{
		let v = resolver ? resolver(value) : value;
		if(targetFulfill) targetFulfill(v);
	}
	catch(ex)
	{ if(targetReject) targetReject(ex); }
}

function handleDispatch<T,TResult>(
	p:PromiseLike<T>,
	onFulfilled:Promise.Fulfill<T,TResult>,
	onRejected?:Promise.Reject<TResult>):void
{
	if(p instanceof PromiseBase)
		p.thenThis(onFulfilled, onRejected);
	else
		p.then(<any>onFulfilled, onRejected);
}

function newODE()
{
	return new ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
}

export class PromiseState<T>
extends DisposableBase
{

	constructor(
		protected _state:Promise.State,
		protected _result?:T,
		protected _error?:any)
	{
		super();
		this._disposableObjectName = PROMISE_STATE;
	}

	protected _onDispose():void
	{
		this._state = VOID0;
		this._result = VOID0;
		this._error = VOID0;
	}

	protected getState():Promise.State
	{
		return this._state;
	}

	get state():Promise.State
	{
		return this._state;
	}

	get isPending():boolean
	{
		return this.getState()===Promise.State.Pending;
	}

	get isSettled():boolean
	{
		return this.getState()!=Promise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
	}

	get isFulfilled():boolean
	{
		return this.getState()===Promise.State.Fulfilled;
	}

	get isRejected():boolean
	{
		return this.getState()===Promise.State.Rejected;
	}

	/*
	 * Providing overrides allows for special defer or lazy sub classes.
	 */
	protected getResult():T
	{
		return this._result;
	}

	get result():T
	{
		this.throwIfDisposed();
		return this.getResult();
	}

	protected getError():any
	{
		return this._error;
	}

	get error():any
	{
		this.throwIfDisposed();
		return this.getError();
	}

}

export abstract class PromiseBase<T>
extends PromiseState<T> implements PromiseLike<T>
{
	constructor()
	{
		super(Promise.State.Pending);
		this._disposableObjectName = PROMISE;
	}


	/**
	 * Calls the respective handlers once the promise is resolved.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract thenSynchronous<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>;

	/**
	 * Same as 'thenSynchronous' but does not return the result.  Returns the current promise instead.
	 * You may not need an additional promise result, and this will not create a new one.
	 * Errors are not trapped.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract thenThis(
		onFulfilled:(v?:T)=>any,
		onRejected?:(v?:any)=>any):PromiseBase<T>;


	/**
	 * Standard .then method that defers execution until resolved.
	 * @param onFulfilled
	 * @param onRejected
	 * @returns {Promise}
	 */
	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		return new Promise<TResult>((resolve, reject)=>
		{
			this.thenThis(
				result=>handleResolutionMethods(resolve, reject, result, onFulfilled),
				error=>onRejected
					? handleResolutionMethods(resolve, null, error, onRejected)
					: reject(error)
			);
		});
	}

	/**
	 * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
	 * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
	 * @param onFulfilled
	 * @param onRejected
	 */
	done(
		onFulfilled:Promise.Fulfill<T,any>,
		onRejected?:Promise.Reject<any>):void
	{
		defer(()=>this.thenThis(onFulfilled, onRejected));
	}

	/**
	 * Will yield for a number of milliseconds from the time called before continuing.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a delay.
	 */
	delayFromNow(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		return new Promise<T>(
			(resolve, reject)=>
			{
				defer(()=>
				{
					this.thenThis(
						v=> resolve(v),
						e=> reject(e));
				}, milliseconds)
			},
			true // Since the resolve/reject is deferred.
		);
	}

	/**
	 * Will yield for a number of milliseconds from after this promise resolves.
	 * If the promise is already resolved, the delay will start from now.
	 * @param milliseconds
	 * @returns A promise that yields to the current execution and executes after a delay.
	 */
	delayAfterResolve(milliseconds:number = 0):PromiseBase<T>
	{
		this.throwIfDisposed();

		if(this.isSettled) return this.delayFromNow(milliseconds);

		return new Promise<T>(
			(resolve, reject)=>
			{
				this.thenThis(
					v=>defer(()=>resolve(v), milliseconds),
					e=>defer(()=>reject(e), milliseconds))
			},
			true // Since the resolve/reject is deferred.
		);
	}

	'catch'<TResult>(onRejected:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();
		return this.then(VOID0, onRejected)
	}

	'finally'<TResult>(fin:()=>Promise.Resolution<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();
		return this.then(fin, fin);
	}

	finallyThis(fin:()=>void):PromiseBase<T>
	{
		this.throwIfDisposed();
		var f = ()=>deferImmediate(fin);
		this.thenThis(f, f);
		return this;
	}

}

export abstract class Resolvable<T> extends PromiseBase<T>
{

	thenSynchronous<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		try
		{
			switch(this.state)
			{
				case Promise.State.Fulfilled:
					return onFulfilled
						? resolve(this._result, onFulfilled, Promise.resolve)
						: <any>this; // Provided for catch cases.
				case Promise.State.Rejected:
					return onRejected
						? resolve(this._error, onRejected, Promise.resolve)
						: <any>this;
			}
		}
		catch(ex)
		{
			return new Rejected<any>(ex);
		}

		throw new Error("Invalid state for a resolved promise.");
	}

	thenThis(
		onFulfilled:(v?:T)=>any,
		onRejected?:(v?:any)=>any):PromiseBase<T>
	{
		this.throwIfDisposed();

		switch(this.state)
		{
			case Promise.State.Fulfilled:
				if(onFulfilled) onFulfilled(this._result);
				break;
			case Promise.State.Rejected:
				if(onRejected) onRejected(this._error);
				break;
		}

		return this;
	}

}

/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export abstract class Resolved<T> extends Resolvable<T>
{
	constructor(state:Promise.State, result:T, error?:any)
	{
		super();
		this._result = result;
		this._error = error;
		this._state = state;
	}


}

/**
 * A fulfilled Resolved<T>.  Provided for readability.
 */
class Fulfilled<T> extends Resolved<T>
{
	constructor(value?:T)
	{
		super(Promise.State.Fulfilled, value);
	}
}

/**
 * A rejected Resolved<T>.  Provided for readability.
 */
class Rejected<T> extends Resolved<T>
{
	constructor(error:any)
	{
		super(Promise.State.Rejected, VOID0, error);
	}
}


/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
class PromiseWrapper<T> extends Resolvable<T>
{
	constructor(private _target:PromiseLike<T>)
	{
		super();

		if(!_target)
			throw new ArgumentNullException(TARGET);

		if(!isPromise(_target))
			throw new ArgumentException(TARGET, "Must be a promise-like object.");

		_target.then(
			v=>
			{
				this._state = Promise.State.Fulfilled;
				this._result = v;
				this._error = VOID0;
				this._target = VOID0;
			},
			e=>
			{
				this._state = Promise.State.Rejected;
				this._error = e;
				this._target = VOID0;
			})
	}

	thenSynchronous<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		var t = this._target;
		if(!t) return super.thenSynchronous(onFulfilled, onRejected);

		return new Promise<TResult>((resolve, reject)=>
		{
			handleDispatch(t,
				result=>handleResolutionMethods(resolve, reject, result, onFulfilled),
				error=>onRejected
					? handleResolutionMethods(resolve, null, error, onRejected)
					: reject(error)
			);
		}, true);
	}


	thenThis(
		onFulfilled:(v?:T)=>any,
		onRejected?:(v?:any)=>any):PromiseBase<T>
	{
		this.throwIfDisposed();

		var t = this._target;
		if(!t) return super.thenThis(onFulfilled, onRejected);
		handleDispatch(t, onFulfilled, onRejected);
		return this;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._target = VOID0;
	}

}


/**
 * This promise class that facilitates pending resolution.
 */
export class Promise<T> extends Resolvable<T>
{

	private _waiting:IPromiseCallbacks<any>[];

	/*
	 * A note about deferring:
	 * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
	 * This eliminates the extra defer that will occur internally.
	 * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
	 *
	 * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
	 * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
	 */

	constructor(
		resolver?:Promise.Executor<T>, forceSynchronous:boolean = false)
	{
		super();

		if(resolver) this.resolveUsing(resolver, forceSynchronous);
	}


	thenSynchronous<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state) return super.thenSynchronous(onFulfilled, onRejected);

		var p = new Promise<TResult>();
		(this._waiting || (this._waiting = []))
			.push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
		return p;
	}

	thenThis(
		onFulfilled:(v?:T)=>any,
		onRejected?:(v?:any)=>any):PromiseBase<T>
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state) return super.thenThis(onFulfilled, onRejected);

		(this._waiting || (this._waiting = []))
			.push(pools.PromiseCallbacks.init(onFulfilled, onRejected));

		return this;
	}


	protected _onDispose()
	{
		super._onDispose();
		this._resolvedCalled = VOID0;
	}

	// Protects against double calling.
	protected _resolvedCalled:boolean;

	resolveUsing(
		resolver:Promise.Executor<T>,
		forceSynchronous:boolean = false,
		throwIfSettled:boolean = false)
	{
		if(!resolver)
			throw new ArgumentNullException("resolver");
		if(this._resolvedCalled)
			throw new InvalidOperationException(".resolve() already called.");
		if(this.state)
			throw new InvalidOperationException("Already resolved: " + Promise.State[this.state]);

		this._resolvedCalled = true;

		var state = 0;
		var rejectHandler = (reason:any)=>
		{
			if(state)
			{
				// Someone else's promise handling down stream could double call this. :\
				console.warn(state== -1
					? "Rejection called multiple times"
					: "Rejection called after fulfilled.");
			}
			else
			{
				state = -1;
				this._resolvedCalled = false;
				this.reject(reason);
			}
		};

		var fulfillHandler = (v:any)=>
		{
			if(state)
			{
				// Someone else's promise handling down stream could double call this. :\
				console.warn(state==1
					? "Fulfill called multiple times"
					: "Fulfill called after rejection.");
			}
			else
			{
				state = 1;
				this._resolvedCalled = false;
				this.resolve(v);
			}
		};

		// There are some performance edge cases where there caller is not blocking upstream and does not need to defer.
		if(forceSynchronous)
			resolver(fulfillHandler, rejectHandler);
		else
			deferImmediate(()=>resolver(fulfillHandler, rejectHandler));

	}


	private _emitDisposalRejection(p:PromiseBase<any>):boolean
	{
		var d = p.wasDisposed;
		if(d) this._rejectInternal(newODE());
		return d;
	}

	private _resolveInternal(result?:T|PromiseLike<T>):void
	{
		if(this.wasDisposed) return;

		// Note: Avoid recursion if possible.

		// Check ahead of time for resolution and resolve appropriately
		while(result instanceof PromiseBase)
		{
			let r:PromiseBase<T> = <any>result;
			if(this._emitDisposalRejection(r)) return;
			switch(r.state)
			{
				case Promise.State.Pending:
					r.thenSynchronous(
						v=>this._resolveInternal(v),
						e=>this._rejectInternal(e)
					);
					return;
				case Promise.State.Rejected:
					this._rejectInternal(r.error);
					return;
				case Promise.State.Fulfilled:
					result = r.result;
					break;
			}
		}

		if(isPromise(result))
		{
			result.then(
				v=>this._resolveInternal(v),
				e=>this._rejectInternal(e)
			);
		}
		else
		{
			this._state = Promise.State.Fulfilled;

			this._result = result;
			this._error = VOID0;
			var o = this._waiting;
			if(o)
			{
				this._waiting = VOID0;
				for(let c of o)
				{
					let {onFulfilled, promise} = c, p = (<Promise<T>>promise);
					pools.PromiseCallbacks.recycle(c);
					handleResolution(p, result, onFulfilled);
				}
				o.length = 0;
			}
		}
	}

	private _rejectInternal(error:any):void
	{

		if(this.wasDisposed) return;

		this._state = Promise.State.Rejected;

		this._error = error;
		var o = this._waiting;
		if(o)
		{
			this._waiting = null; // null = finished. undefined = hasn't started.
			for(let c of o)
			{
				let {onRejected, promise} = c, p = (<Promise<T>>promise);
				pools.PromiseCallbacks.recycle(c);
				if(onRejected) handleResolution(p, error, onRejected);
				else p.reject(error);
			}
			o.length = 0;
		}
	}

	resolve(result?:T | PromiseLike<T>, throwIfSettled:boolean = false):void
	{
		this.throwIfDisposed();
		if(<any>result==this)
			throw new InvalidOperationException("Cannot resolve a promise as itself.");

		if(this._state)
		{
			// Same value? Ignore...
			if(!throwIfSettled || this._state==Promise.State.Fulfilled && this._result===result) return;
			throw new InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
		}

		if(this._resolvedCalled)
		{
			if(throwIfSettled)
				throw new InvalidOperationException(".resolve() already called.");
			return;
		}

		this._resolveInternal(result);
	}


	reject(error:any, throwIfSettled:boolean = false):void
	{
		this.throwIfDisposed();
		if(this._state)
		{
			// Same value? Ignore...
			if(!throwIfSettled || this._state==Promise.State.Rejected && this._error===error) return;
			throw new InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
		}

		if(this._resolvedCalled)
		{
			if(throwIfSettled)
				throw new InvalidOperationException(".resolve() already called.");
			return;
		}

		this._rejectInternal(error);
	}
}


module pools
{

	// export module pending
	// {
	//
	//
	// 	var pool:ObjectPool<Promise<any>>;
	//
	// 	function getPool()
	// 	{
	// 		return pool || (pool = new ObjectPool<Promise<any>>(40, factory, c=>c.dispose()));
	// 	}
	//
	// 	function factory():Promise<any>
	// 	{
	// 		return new Promise();
	// 	}
	//
	// 	export function get():Promise<any>
	// 	{
	// 		var p:any = getPool().take();
	// 		p.__wasDisposed = false;
	// 		p._state = Promise.State.Pending;
	// 		return p;
	// 	}
	//
	// 	export function recycle<T>(c:Promise<T>):void
	// 	{
	// 		if(c) getPool().add(c);
	// 	}
	//
	// }
	//
	// export function recycle<T>(c:PromiseBase<T>):void
	// {
	// 	if(!c) return;
	// 	if(c instanceof Promise && c.constructor==Promise) pending.recycle(c);
	// 	else c.dispose();
	// }


	export module PromiseCallbacks
	{

		var pool:ObjectPool<IPromiseCallbacks<any>>;

		function getPool()
		{
			return pool
				|| (pool = new ObjectPool<IPromiseCallbacks<any>>(40, factory, c=>
				{
					c.onFulfilled = null;
					c.onRejected = null;
					c.promise = null;
				}));
		}

		function factory():IPromiseCallbacks<any>
		{
			return {
				onFulfilled: null,
				onRejected: null,
				promise: null
			}
		}

		export function init<T>(
			onFulfilled:Promise.Fulfill<T,any>,
			onRejected?:Promise.Reject<any>,
			promise?:PromiseLike<any>):IPromiseCallbacks<T>
		{

			var c = getPool().take();
			c.onFulfilled = onFulfilled;
			c.onRejected = onRejected;
			c.promise = promise;
			return c;
		}

		export function recycle<T>(c:IPromiseCallbacks<T>):void
		{
			getPool().add(c);
		}
	}


}


export module Promise
{

	/**
	 * The state of a promise.
	 * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
	 * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
	 */
	export enum State {
		Pending   = 0,
		Fulfilled = 1,
		Rejected  = -1
	}
	Object.freeze(State);

	export type Resolution<TResult> = PromiseLike<TResult>|TResult|void;

	export interface Fulfill<T, TResult>
	{
		(value:T):Resolution<TResult>
	}

	export interface Reject<TResult>
	{
		(err?:any):Resolution<TResult>
	}

	export interface Then<T,TResult>
	{
		(
			onFulfilled:Fulfill<T,TResult>,
			onRejected?:Reject<TResult>):PromiseBase<TResult>
	}

	export interface Executor<T>
	{
		(
			resolve:(value?:T | PromiseLike<T>) => void,
			reject:(reason?:any) => void):void;
	}


	/**
	 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
	 */
	export function all<T>(promises:PromiseLike<T>[]):PromiseBase<T[]>
	export function all<T>(promise:PromiseLike<T>, ...rest:PromiseLike<T>[]):PromiseBase<T[]>
	export function all(
		first:PromiseLike<any>|PromiseLike<any>[],
		...rest:PromiseLike<any>[]):PromiseBase<any[]>
	{
		if(!first && !rest.length) throw new ArgumentNullException("promises");
		var promises = (Array.isArray(first) ? first : [first]).concat(rest); // yay a copy!
		if(!promises.length || promises.every(v=>!v)) return new Fulfilled<any[]>(promises); // it's a new empty, reuse it. :|

		// Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
		return new Promise<any[]>((resolve, reject)=>
		{
			let checkedAll = false;
			let result:any[] = [];
			let len = promises.length;
			result.length = len;
			// Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
			let remaining = new Set(promises.map((v, i)=>i)); // get all the indexes...

			let cleanup = ()=>
			{
				reject = null;
				resolve = null;
				promises.length = 0;
				promises = null;
				remaining.dispose();
				remaining = null;
			};

			let checkIfShouldResolve = ()=>
			{
				let r = resolve;
				if(r && !remaining.count)
				{
					cleanup();
					r(result);
				}
			};

			let onFulfill = (v:any, i:number)=>
			{
				if(resolve)
				{
					result[i] = v;
					remaining.remove(i);
					checkIfShouldResolve();
				}
			};

			let onReject = (e?:any)=>
			{
				let r = reject;
				if(r)
				{
					cleanup();
					r(e);
				}
			};

			for(let i = 0; remaining && i<len; i++)
			{
				let p = promises[i];
				if(p) p.then(v=>onFulfill(v, i), onReject);
				else remaining.remove(i);
				checkIfShouldResolve();
			}
		});
	}

	/**
	 * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
	 * Unlike .all this method waits for all rejections as well as fulfillment.
	 */
	export function waitAll<T>(promises:PromiseLike<T>[]):PromiseBase<PromiseLike<T>[]>
	export function waitAll<T>(
		promise:PromiseLike<T>,
		...rest:PromiseLike<T>[]):PromiseBase<PromiseLike<T>[]>
	export function waitAll(
		first:PromiseLike<any>|PromiseLike<any>[],
		...rest:PromiseLike<any>[]):PromiseBase<PromiseLike<any>[]>
	{
		if(!first && !rest.length) throw new ArgumentNullException("promises");
		var promises = (Array.isArray(first) ? first : [first]).concat(rest); // yay a copy!
		if(!promises.length || promises.every(v=>!v)) return new Fulfilled<any[]>(promises); // it's a new empty, reuse it. :|


		// Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
		return new Promise<any[]>((resolve, reject)=>
		{
			let checkedAll = false;
			let len = promises.length;

			// Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
			let remaining = new Set(promises.map((v, i)=>i)); // get all the indexes...

			let cleanup = ()=>
			{
				reject = null;
				resolve = null;
				remaining.dispose();
				remaining = null;
			};

			let checkIfShouldResolve = ()=>
			{
				let r = resolve;
				if(r && !remaining.count)
				{
					cleanup();
					r(promises);
				}
			};

			let onResolved = (i:number)=>
			{
				if(remaining)
				{
					remaining.remove(i);
					checkIfShouldResolve();
				}
			};

			for(let i = 0; remaining && i<len; i++)
			{
				let p = promises[i];
				if(p) p.then(v=>onResolved(i), e=>onResolved(i));
				else onResolved(i);
			}
		});

	}

	/**
	 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	 * or rejected.
	 * @param promises An array of Promises.
	 * @returns A new Promise.
	 */
	export function race<T>(promises:PromiseLike<T>[]):PromiseBase<T>
	export function race<T>(promise:PromiseLike<T>, ...rest:PromiseLike<T>[]):PromiseBase<T>
	export function race(
		first:PromiseLike<any>|PromiseLike<any>[],
		...rest:PromiseLike<any>[]):PromiseBase<any>
	{
		var promises = first && (Array.isArray(first) ? first : [first]).concat(rest); // yay a copy?
		if(!promises || !promises.length || !(promises = promises.filter(v=>v!=null)).length)
			throw new ArgumentException("Nothing to wait for.");

		var len = promises.length;

		// Only one?  Nothing to race.
		if(len==1) return wrap(promises[0]);

		// Look for already resolved promises and the first one wins.
		for(let i = 0; i<len; i++)
		{
			var p:any = promises[i];
			if(p instanceof PromiseBase && p.isSettled) return p;
		}

		return new Promise((resolve, reject)=>
		{
			let cleanup = ()=>
			{
				reject = null;
				resolve = null;
				promises.length = 0;
				promises = null;
			};

			let onResolve = (r:(x:any)=>void, v:any)=>
			{
				if(r)
				{
					cleanup();
					r(v);
				}
			};

			let onFulfill = (v:any)=> onResolve(resolve, v);
			let onReject = (e?:any)=> onResolve(reject, e);

			for(let p of promises)
			{
				if(!resolve) break;
				p.then(onFulfill, onReject);
			}
		});
	}

	// // race<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;

	/**
	 * Creates a new resolved promise .
	 * @returns A resolved promise.
	 */
	export function resolve():PromiseBase<void>

	/**
	 * Creates a new resolved promise for the provided value.
	 * @param value A value or promise.
	 * @returns A promise whose internal state matches the provided promise.
	 */
	export function resolve<T>(value:T | PromiseLike<T>):PromiseBase<T>;
	export function resolve(value?:any):PromiseBase<any>
	{

		return isPromise(value) ? wrap(value) : new Fulfilled(value);
	}

	/**
	 * Creates a new rejected promise for the provided reason.
	 * @param reason The reason the promise was rejected.
	 * @returns A new rejected Promise.
	 */
	export function reject<T>(reason:T):PromiseBase<T>
	{
		return new Rejected<T>(reason);
	}

	/**
	 * Takes any Promise-Like object and ensures an extended version of it from this module.
	 * @param target The Promise-Like object
	 * @returns A new target that simply extends the target.
	 */
	export function wrap<T>(target:PromiseLike<T>):PromiseBase<T>
	{
		if(!target) throw new ArgumentNullException(TARGET);
		return target instanceof PromiseBase ? target : new PromiseWrapper(target);
	}

	/**
	 * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
	 * @param then
	 * @returns {PromiseWrapper<T>}
	 */
	export function createFrom<T,TResult>(then:Then<T,TResult>):PromiseBase<T>
	{
		if(!then) throw new ArgumentNullException(THEN);
		return new PromiseWrapper({then: then});
	}

}


interface IPromiseCallbacks<T>
{
	onFulfilled:Promise.Fulfill<T,any>;
	onRejected:Promise.Reject<any>;
	promise?:PromiseLike<any>;
}
