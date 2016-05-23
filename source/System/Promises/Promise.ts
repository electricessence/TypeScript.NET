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


const VOID0:any = void 0, PROMISE = "Promise", THEN = "then", TARGET = "target";

function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
}

function resolve<T>(
	value:Promise.Resolution<T>, resolver:(v:Promise.Resolution<T>)=>any,
	promiseFactory:(v:any)=>Promise<any>):Promise<any>
{
	let nextValue = resolver
		? resolver(value)
		: value;

	return nextValue && isPromise(nextValue)
		? Promise.wrap(nextValue)
		: promiseFactory(nextValue);
}

function pass<T>(source:Promise<T>, dest:Pending<T>):Closure
{
	return ()=>
	{
		source.then(
			v=>
			{
				dest.fulfill(v);
				return dest;
			},
			e=>
			{
				dest.reject(e);
				return dest;
			});
	}
}

function handleFulfill(
	p:Pending<any>,
	value:Promise.Resolution<any>,
	resolver:(v:Promise.Resolution<any>)=>any):void
{
	try
	{ p.fulfill(resolver ? resolver(value) : value); }
	catch(ex)
	{ p.reject(ex); }
}

function handleReject(
	p:Pending<any>,
	error:any,
	resolver:(v:any)=>any):void
{
	try
	{ p.reject(resolver ? resolver(error) : error); }
	catch(ex)
	{ p.reject(ex); }
}

export abstract class Promise<T> extends DisposableBase implements PromiseLike<T>
{
	constructor()
	{
		super();
		this._state = Promise.State.Pending;
		this._disposableObjectName = PROMISE;
	}

	protected _result:T;
	protected _error:any;

	abstract then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>;

	protected _onDispose():void
	{
		this._state = VOID0;
		this._result = VOID0;
		this._error = VOID0;
	}

	protected _state:Promise.State;

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

	get isResolved():boolean
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


	/**
	 * Ensures all subsequent then requests are resolved asynchronously.
	 * @returns A promise that defers all subsequent then requests..
	 */
	deferAll():Promise<T>
	{
		this.throwIfDisposed();

		return new Deferred(this);
	}

	/**
	 * Ensures any immediately following then requests will occur on next cycle.
	 * @returns A promise that yields to the current execution and executes after.
	 */
	defer():Promise<T>
	{
		this.throwIfDisposed();

		var p = new Pending<T>();
		deferImmediate(pass(this, p));
		return p;
	}

	delay(milliseconds?:number):Promise<T>
	{
		this.throwIfDisposed();

		var p = new Pending<T>();
		defer(pass(this, p), milliseconds);
		return p;
	}

	'catch'<TResult>(onRejected:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		return this.then(VOID0, onRejected)
	}

	'finally'<TResult>(fin:()=>Promise.Resolution<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		return this.then(fin, fin);
	}

}

/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
class PromiseWrapper<T> extends Promise<T>
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
			},
			e=>
			{
				this._state = Promise.State.Rejected;
				this._error = e;
			})
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		var p = new Pending<TResult>();
		this._target.then(
			result=>handleFulfill(p, result, onFulfilled),
			e=>handleReject(p, e, onRejected)
		);
		return p;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._target = null;
	}

}


/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export abstract class Resolved<T> extends Promise<T>
{
	constructor(state:Promise.State, result?:T, error?:any)
	{
		super();
		this._result = result;
		this._error = error;
		this._state = state;
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		try
		{
			return this._error===VOID0
				? resolve(this._result, onFulfilled, Promise.resolve)
				: resolve(this._error, onRejected, Promise.reject);
		}
		catch(ex)
		{
			return new Rejected(ex);
		}
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

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		try
		{
			return resolve(this._result, onFulfilled, Promise.resolve);
		}
		catch(ex)
		{
			return new Rejected(ex);
		}
	}
}

/**
 * A rejected Resolved<T>.  Provided for readability.
 */
class Rejected extends Resolved<any>
{
	constructor(error:any)
	{
		super(Promise.State.Rejected, VOID0, error);
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<any,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		try
		{
			return resolve(this._error, onRejected, Promise.reject);
		}
		catch(ex)
		{
			return new Rejected(ex);
		}
	}
}

/**
 * This promise class that facilitates pending resolution.
 */
export class Pending<T> extends Resolved<T>
{

	private _waiting:IPromiseCallbacks<any>[];

	constructor(resolver?:Promise.Executor<T>)
	{
		super(Promise.State.Pending);

		if(resolver) this.resolve(resolver);
	}


	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state) return super.then(onFulfilled, onRejected);

		var p = new Pending<TResult>();
		(this._waiting || (this._waiting = []))
			.push(PromiseCallbacks.init(onFulfilled, onRejected, p));
		return p;
	}

	protected _onDispose()
	{
		super._onDispose();
		this._resolveCalled = VOID0;
	}

	private _resolveCalled:boolean;

	resolve(resolver:Promise.Executor<T>)
	{
		if(!resolver)
			throw new ArgumentNullException("resolver");
		if(this._resolveCalled)
			throw new InvalidOperationException(".resolve() already called.");
		if(this.state)
			throw new InvalidOperationException("Already resolved: " + Promise.State[this.state]);

		this._resolveCalled = true;
		resolver(
			v=>
			{
				if(v==this) throw new InvalidOperationException("Cannot resolve a promise as itself.");
				if(isPromise(v))
				{
					v.then(
						f=>this.fulfill(f),
						r=>this.reject(r))
				}
				else
					this.fulfill(v);
			},
			reason=>
			{
				this.reject(reason);
			});
	}

	fulfill(result?:T):void
	{
		this.throwIfDisposed();
		if(<any>result==this)
			throw new InvalidOperationException("Cannot resolve a promise as itself.");

		if(this._state)
		{
			// Same value? Ignore...
			if(this._state==Promise.State.Fulfilled && this._result===result) return;
			throw new InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
		}

		if(this._resolveCalled)
			throw new InvalidOperationException(".resolve() already called.");

		this._state = Promise.State.Fulfilled;

		this._result = result;
		this._error = VOID0;
		var o = this._waiting;
		if(o)
		{
			this._waiting = VOID0;
			for(let c of o)
			{
				let {onFulfilled, promise} = c, p = (<Pending<T>>promise);
				PromiseCallbacks.recycle(c);
				handleFulfill(p, result, onFulfilled);
			}
			o.length = 0;
		}
	}

	reject(error:any):void
	{
		this.throwIfDisposed();
		if(this._state)
		{
			// Same value? Ignore...
			if(this._state==Promise.State.Rejected && this._error===error) return;
			throw new InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
		}

		if(this._resolveCalled)
			throw new InvalidOperationException(".resolve() already called.");

		this._state = Promise.State.Rejected;

		this._error = error;
		var o = this._waiting;
		if(o)
		{
			this._waiting = null; // null = finished. undefined = hasn't started.
			for(let c of o)
			{
				let {onRejected, promise} = c, p = (<Pending<T>>promise);
				PromiseCallbacks.recycle(c);
				handleReject(p, error, onRejected);
			}
			o.length = 0;
		}
	}
}

class Deferred<T> extends Resolved<T>
{
	constructor(private _source:Promise<T>)
	{
		super(VOID0);
		if(!(_source instanceof Promise))
			throw new ArgumentException(TARGET, "Must be of type Promise.");
	}

	protected _onDisposed():void
	{
		super._onDispose();
		this._source = VOID0;
	}

	protected getState():Promise.State
	{
		return this._source.state;
	}

	protected getResult():T
	{
		return this._source.result;
	}

	protected getError():any
	{
		return this._source.error;
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		var d = this._source.defer();
		var p = d.then(onFulfilled, onRejected);
		// Since there is only 1 'then' for the deferred promise, cleanup immediately after.
		d.finally(()=>Pools.recycle(d));
		return p;
	}

	defer():Promise<T>
	{
		this.throwIfDisposed();

		return this;
	}

	deferAll():Promise<T>
	{
		this.throwIfDisposed();

		return this;
	}
}

/**
 * This promise class only resolves the provided factory if values are requested or state is queried.
 */
class Lazy<T> extends Resolved<T>
{
	constructor(private _factory:Func<T>)
	{
		super(Promise.State.Pending);
	}

	protected _onDispose()
	{
		super._onDispose();
		this._factory = VOID0;
	}

	protected getState():Promise.State
	{
		this.getResult();
		return this._error;
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
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		this.getResult();
		return super.then(onFulfilled, onRejected);
	}


}


module Pools
{

	export module PendingPool
	{


		var pool:ObjectPool<Pending<any>>;

		function getPool()
		{
			return pool || (pool = new ObjectPool<Pending<any>>(40, factory));
		}

		function factory():Pending<any>
		{
			return new Pending();
		}

		export function get():Pending<any>
		{
			var p:any = getPool().take();
			p.__wasDisposed = false;
			p._state = Promise.State.Pending;
			return p;
		}

		export function recycle<T>(c:Pending<T>):void
		{
			c.dispose();
			getPool().add(c);
		}

	}

	export function recycle<T>(c:Promise<T>):void
	{
		if(c instanceof Pending) PendingPool.recycle(c);
		else c.dispose();
	}

}


export module Promise
{

	/**
	 * The state of a promise.
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
			onRejected?:Reject<TResult>):Promise<TResult>
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
	// //resolve<T>(value: T | PromiseLike<T>): Promise<T>;


	/**
	 * Creates a new resolved promise .
	 * @returns A resolved promise.
	 */
	export function resolve():Promise<void>

	/**
	 * Creates a new resolved promise for the provided value.
	 * @param value A promise.
	 * @returns A promise whose internal state matches the provided promise.
	 */
	export function resolve<T>(value:T):Promise<T>
	export function resolve(value?:any):Promise<any>
	{

		return new Fulfilled(value);
	}

	/**
	 * Creates a new rejected promise for the provided reason.
	 * @param reason The reason the promise was rejected.
	 * @returns A new rejected Promise.
	 */
	export function reject(reason:any):Promise<void>;
	export function reject<T>(reason:any):Promise<T>
	{
		return new Rejected(reason);
	}

	export function lazy(factory:Closure):Promise<void>;
	export function lazy<T>(factory:Func<T>):Promise<T>
	{
		return new Lazy<T>(factory);
	}

	/**
	 * Takes any Promise-Like object and ensures an extended version of it from this module.
	 * @param target The Promise-Like object
	 * @returns A new target that simply extends the target.
	 */
	export function wrap<T>(target:PromiseLike<T>):Promise<T>
	{
		return target instanceof Promise ? this : new PromiseWrapper(target);
	}

	/**
	 * A function that acts like a then method can be extended by providing a function that takes an onFulfill and onReject.
	 * @param then
	 * @returns {PromiseWrapper<T>}
	 */
	export function createFrom<T,TResult>(then:Then<T,TResult>):Promise<T>
	{
		return new PromiseWrapper({then: then});
	}

	/**
	 * Provides a promise that can be resolved later.
	 * @returns {Pending<T>}
	 */
	export function pending<T>(resolver?:Promise.Executor<T>):Pending<T>
	{
		var p = Pools.PendingPool.get();
		if(resolver) p.resolve(resolver);
		return p;
	}

}


interface IPromiseCallbacks<T>
{
	onFulfilled:Promise.Fulfill<T,any>;
	onRejected:Promise.Reject<any>;
	promise?:PromiseLike<any>;
}

module PromiseCallbacks
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

	export function release<T>(to:PromiseLike<T>, c:IPromiseCallbacks<T>):void
	{
		let {onFulfilled, onRejected} = c;
		recycle(c);
		to.then(onFulfilled, onRejected);
	}

	export function recycle<T>(c:IPromiseCallbacks<T>):void
	{
		c.onFulfilled = null;
		c.onRejected = null;
		c.promise = null;
		getPool().add(c);
	}
}
