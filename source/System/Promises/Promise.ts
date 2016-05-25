/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */

/*
 * Note: The Promise herein does NOT defer by default.
 * If you require a promise to defer its result then use the .defer() or .delay(ms) methods.
 * The API attempts to follow ES6 style promises.
 */

import Type from "../Types";
import {Closure, Func} from "../FunctionTypes";
import {deferImmediate} from "../Tasks/deferImmediate";
import {defer} from "../Tasks/defer";
import {DisposableBase} from "../Disposable/DisposableBase";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentException} from "../Exceptions/ArgumentException";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {ObjectPool} from "../Disposable/ObjectPool";
import {Set} from "../Collections/Set";


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

function pass<T>(source:PromiseBase<T>, dest:Promise<T>):Closure
{
	return ()=>
	{
		source.then(
			v=>
			{
				dest.resolve(v);
				return dest;
			},
			e=>
			{
				dest.reject(e);
				return dest;
			});
	}
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

function handleDispatch<T,TResult>(
	p:PromiseLike<T>,
	onFulfilled:Promise.Fulfill<T,TResult>,
	onRejected?:Promise.Reject<TResult>):void
{
	if(p instanceof Promise)
		p.thenThis(onFulfilled, onRejected);
	else
		p.then(<any>onFulfilled, onRejected);
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
	 * For simplicity and performance this can happen synchronously unless you call .defer() before calling .then().
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>;


	/**
	 * Same as then but does not return the result.  Returns the current promise instead.
	 * You may not need an additional promise result, and this will not create a new one.
	 * Errors are not trapped.
	 * @param onFulfilled
	 * @param onRejected
	 */
	abstract thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T, TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>;

	/**
	 * Ensures all subsequent then requests are resolved asynchronously.
	 * @returns A promise that defers all subsequent then requests..
	 */
	deferAll():PromiseBase<T>
	{
		this.throwIfDisposed();

		return new SubsequentDeferred(this);
	}

	/**
	 * Ensures any immediately following then requests will occur on next cycle or later.
	 * @returns A promise that yields to the current execution and executes after.
	 */
	defer():PromiseBase<T>
	{
		this.throwIfDisposed();

		var p = Promise.pending<T>();
		deferImmediate(pass(this, p));
		return p;
	}

	delay(milliseconds?:number):PromiseBase<T>
	{
		this.throwIfDisposed();

		var p = Promise.pending<T>();
		defer(pass(this, p), milliseconds);
		return p;
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
		this.thenThis(fin, fin);
		return this;
	}

}

export abstract class Resolvable<T> extends PromiseBase<T>
{

	then<TResult>(
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

	thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T, TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>
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

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		var t = this._target;
		if(!t) return super.then(onFulfilled, onRejected);

		var p = Promise.pending<TResult>();
		handleDispatch(t,
			result=>handleResolution(p, result, onFulfilled),
			error=>onRejected ? handleResolution(p, error, onRejected) : p.reject(error));
		return p;
	}


	thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T, TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>
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
		resolver?:Promise.Executor<T>,
		resolveImmediate:boolean = false)
	{
		super();

		if(resolver) this.resolveUsing(resolver, !resolveImmediate);
	}


	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state) return super.then(onFulfilled, onRejected);

		var p = new Promise<TResult>();
		(this._waiting || (this._waiting = []))
			.push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
		return p;
	}

	thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>
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
		deferResolution:boolean = false,
		throwIfSettled:boolean = false)
	{
		if(!resolver)
			throw new ArgumentNullException("resolver");
		if(this._resolvedCalled)
			throw new InvalidOperationException(".resolve() already called.");
		if(this.state)
			throw new InvalidOperationException("Already resolved: " + Promise.State[this.state]);

		this._resolvedCalled = true;

		var rejectHandler = (reason:any)=>
		{
			this._resolvedCalled = false;
			this.reject(reason);
		};

		var fulfillHandler = (v:any)=>
		{
			this._resolvedCalled = false;
			this.resolve(v);
		};

		var r = ()=>resolver(
			v=>
			{
				if(v==this) throw new InvalidOperationException("Cannot resolve a promise as itself.");
				if(isPromise(v))
					handleDispatch(v, fulfillHandler, rejectHandler);
				else
					fulfillHandler(v);
			},
			rejectHandler);

		if(deferResolution) deferImmediate(r);
		else r();
	}

	resolve(result?:T, throwIfSettled:boolean = false):void
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
}


/**
 * This promise class ensures that all subsequent then calls resolve in a deferred/async manner.
 * This is not intended as a promise generator.  Use Pending for deferring results.
 */
class SubsequentDeferred<T> extends PromiseBase<T>
{
	constructor(private _parent:PromiseBase<T>)
	{
		super();
		if(!_parent || !(_parent instanceof PromiseBase))
			throw new ArgumentException(TARGET, "Must be of type Promise.");
	}

	protected _onDisposed():void
	{
		super._onDispose();
		this._parent = VOID0;
	}

	protected getState():Promise.State
	{
		return this._parent.state;
	}

	protected getResult():T
	{
		return this._parent.result;
	}

	protected getError():any
	{
		return this._parent.error;
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		var d = this._parent.defer();
		var p = d.then(onFulfilled, onRejected);
		// Since there is only 1 'then' for the deferred promise, cleanup immediately after.
		d.finally(()=>pools.recycle(d));
		return p;
	}


	thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T, TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>
	{
		this.throwIfDisposed();

		var d = this._parent.defer();
		d.thenThis(onFulfilled, onRejected);
		// Since there is only 1 'then' for the deferred promise, cleanup immediately after.
		d.finally(()=>pools.recycle(d));
		return this;
	}

	defer():PromiseBase<T>
	{
		this.throwIfDisposed();

		return this;
	}

	deferAll():PromiseBase<T>
	{
		this.throwIfDisposed();

		return this;
	}

	get parent():PromiseBase<T>
	{
		return this._parent;
	}
}

/**
 * This promise class only resolves the provided factory if values are requested or state is queried.
 * It is considered resolved since the resolution will be generated synchronously.
 */
export class LazyResolved<T> extends Resolved<T>
{
	constructor(private _factory:Func<T>)
	{
		super(Promise.State.Pending, VOID0);
		if(!_factory) throw new ArgumentNullException("factory");
	}

	protected _onDispose()
	{
		super._onDispose();
		this._factory = VOID0;
	}

	protected getState():Promise.State
	{
		this.getResult();
		return this._state;
	}

	protected getResult():T
	{
		if(!this._state)
		{
			try
			{
				this._result = this._factory();
				this._state = Promise.State.Fulfilled;
			}
			catch(ex)
			{
				this._error = ex;
				this._state = Promise.State.Rejected;
			}
			this._factory = VOID0;
		}
		return this._result;
	}

	protected getError():any
	{
		this.getResult();
		return this._error;
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this.throwIfDisposed();

		this.getResult();
		return super.then(onFulfilled, onRejected);
	}

	thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>
	{
		this.throwIfDisposed();

		this.getResult();
		return super.thenThis(onFulfilled, onRejected);
	}

	/**
	 * This allows for synchronously triggering the factory ahead of time since calling .defer() shouldn't trigger it.
	 * @returns {LazyResolved}
	 */
	resolve():PromiseBase<T>
	{
		this.getResult();
		return this;
	}

	get isResolved():boolean
	{
		return !this._factory;
	}
}

/**
 * A promise that waits for the first then to trigger the resolver.
 */
export class LazyPromise<T> extends Promise<T>
{

	constructor(private _resolver:Promise.Executor<T>)
	{
		super();
		if(!_resolver) throw new ArgumentNullException("resolver");
		this._resolvedCalled = true;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._resolver = VOID0;
	}

	private _onThen():void
	{
		var r = this._resolver;
		if(r)
		{
			this._resolver = VOID0;
			this._resolvedCalled = false;
			this.resolveUsing(r, true);
		}
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T, TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<TResult>
	{
		this._onThen();
		return super.then(onFulfilled, onRejected);
	}


	thenThis<TResult>(
		onFulfilled:Promise.Fulfill<T, TResult>,
		onRejected?:Promise.Reject<TResult>):PromiseBase<T>
	{
		this._onThen();
		return super.thenThis(onFulfilled, onRejected);
	}
}

module pools
{

	export module pending
	{


		var pool:ObjectPool<Promise<any>>;

		function getPool()
		{
			return pool || (pool = new ObjectPool<Promise<any>>(40, factory));
		}

		function factory():Promise<any>
		{
			return new Promise();
		}

		export function get():Promise<any>
		{
			var p:any = getPool().take();
			p.__wasDisposed = false;
			p._state = Promise.State.Pending;
			return p;
		}

		export function recycle<T>(c:Promise<T>):void
		{
			if(!c) return;
			c.dispose();
			getPool().add(c);
		}

	}

	export function recycle<T>(c:PromiseBase<T>):void
	{
		if(!c) return;
		if(c instanceof Promise) pending.recycle(c);
		else c.dispose();
	}


	export module PromiseCallbacks
	{

		var pool:ObjectPool<IPromiseCallbacks<any>>;

		function getPool()
		{
			return pool || (pool = new ObjectPool<IPromiseCallbacks<any>>(40, factory));
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
			c.onFulfilled = null;
			c.onRejected = null;
			c.promise = null;
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

	// /**
	//  * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	//  * or rejected.
	//  * @param values An array of Promises.
	//  * @returns A new Promise.
	//  */
	// // race<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;


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
		var len = promises.length;
		for(let i = 0; i<len; i++)
		{
			var p = promises[i];
			if(p instanceof SubsequentDeferred) promises[i] = p.parent;
		}

		return pending<any[]>((resolve, reject)=>
		{
			let checkedAll = false;
			let result:any[] = [];
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
	 * Returns a promise for the first of an array of promises to become settled.
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
		if(len==1) return wrap(promises[0]).defer();

		// Look for already resolved promises and the first one wins.
		for(let i = 0; i<len; i++)
		{
			var p:any = promises[i];
			if(p instanceof SubsequentDeferred) p = p.parent;
			if(p instanceof LazyResolved)
			{
				// If a a LazyResolved has resolved, then it wins otherwise let it defer and not (potentially) block.
				if(p.isResolved) return p.defer();
			}
			else if(p instanceof Resolved || p instanceof PromiseBase && p.isSettled)
			{
				return p.defer();
			}
		}

		return pending((resolve, reject)=>
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


	export module lazy
	{
		/**
		 * Provides a promise that will be resolved immediately at the first 'then' request.
		 * @param factory
		 */
		export function resolve<T>(factory:Func<T>):LazyResolved<T>
		{
			return new LazyResolved<T>(factory);
		}


		/**
		 * Provides a promise that will trigger the resolver at the first 'then' request.
		 * @param resolver
		 * @returns {Promise<T>}
		 */
		export function pending<T>(resolver:Promise.Executor<T>):LazyPromise<T>
		{
			return new LazyPromise(resolver);
		}
	}

	/**
	 * Takes any Promise-Like object and ensures an extended version of it from this module.
	 * @param target The Promise-Like object
	 * @returns A new target that simply extends the target.
	 */
	export function wrap<T>(target:PromiseLike<T>):PromiseBase<T>
	{
		if(!target) throw new ArgumentNullException(TARGET);
		return target instanceof Promise ? this : new PromiseWrapper(target);
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

	/**
	 * Provides a promise that can be resolved later.
	 * @returns {Promise<T>}
	 */
	export function pending<T>(resolver?:Promise.Executor<T>):Promise<T>
	{
		var p = pools.pending.get();
		if(resolver) p.resolveUsing(resolver);
		return p;
	}

	//export function all()

}


interface IPromiseCallbacks<T>
{
	onFulfilled:Promise.Fulfill<T,any>;
	onRejected:Promise.Reject<any>;
	promise?:PromiseLike<any>;
}
