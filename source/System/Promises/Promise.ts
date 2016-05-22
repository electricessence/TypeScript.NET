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
import * as PromiseCallbacks from "./Callbacks";
import {IPromiseCallbacks} from "./Callbacks";
import {deferImmediate} from "../Tasks/deferImmediate";
import {defer} from "../Tasks/defer";
import {DisposableBase} from "../Disposable/DisposableBase";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";


const VOID0:any = void 0, PROMISE = "Promise",  THEN = "then";

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
		? (nextValue instanceof Promise ? nextValue : new PromiseWrapper(nextValue))
		: promiseFactory(nextValue);
}

function handleFulfill(
	p:Pending<any>,
	value:Promise.Resolution<any>,
	resolver:(v:Promise.Resolution<any>)=>any):void
{
	try
	{
		p.resolve(
			resolver
				? resolver(value)
				: value);
	}
	catch(ex)
	{
		p.reject(ex);
	}
}

function handleReject(
	p:Pending<any>,
	error:any,
	resolver:(v:any)=>any):void
{
	try
	{
		p.reject(
			resolver
				? resolver(error)
				: error);
	}
	catch(ex)
	{
		p.reject(ex);
	}
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
	get state():Promise.State
	{
		return this._state;
	}

	get isPending():boolean
	{
		return this._state===Promise.State.Pending;
	}

	get isResolved():boolean
	{
		return this._state!=Promise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
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
		this.throwIfDisposed();
		return this._result;
	}

	get error():any
	{
		this.throwIfDisposed();
		return this._error;
	}


	defer():Promise<T>
	{
		this.throwIfDisposed();

		var p = new Pending<T>();
		this.then(
			v=>
			{
				deferImmediate(()=>p.resolve(v));
				return p;
			},
			e=>
			{
				deferImmediate(()=>p.reject(e));
				return p;
			});
		return p;
	}

	delay(milliseconds?:number):Promise<T>
	{
		this.throwIfDisposed();

		var p = new Pending<T>();
		this.then(
			v=>
			{
				defer(()=>p.resolve(v), milliseconds);
				return p;
			},
			e=>
			{
				defer(()=>p.reject(e), milliseconds);
				return p;
			});
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

	protected _observers:IPromiseCallbacks<any>[];

	constructor()
	{
		super(Promise.State.Pending);
	}

	then<TResult>(
		onFulfilled:Promise.Fulfill<T,TResult>,
		onRejected?:Promise.Reject<TResult>):Promise<TResult>
	{
		this.throwIfDisposed();

		var o = this._observers;
		if(o===VOID0) this._observers = o = [];

		// Already fulfilled?
		if(!o) return super.then(onFulfilled, onRejected);

		// Still pending?
		var p = new Pending<TResult>();
		this._observers.push(PromiseCallbacks.init(onFulfilled, onRejected, p));
		return p;
	}

	resolve(result?:T):void
	{
		this.throwIfDisposed();

		if(this._state)
		{
			// Same value? Ignore...
			if(this._state==Promise.State.Fulfilled && this._result===result) return;
			throw new InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
		}

		this._state = Promise.State.Fulfilled;

		this._result = result;
		this._error = VOID0;
		var o = this._observers;
		if(o)
		{
			this._observers = null; // null = finished. undefined = hasn't started.
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

		this._state = Promise.State.Rejected;

		this._error = error;
		var o = this._observers;
		if(o)
		{
			this._observers = null; // null = finished. undefined = hasn't started.
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


export module Promise
{

	/**
	 * The state of a promise.
	 * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
	 */
	export enum State {
		Pending   = 0,
		Fulfilled = 1,
		Rejected  = 2
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
			onRejected?:Reject<TResult>
		):Promise<TResult>
	}

	export interface Executor<T> {
		(
			resolve: (value?: T | PromiseLike<T>) => void,
			reject: (reason?: any) => void
		) : void;
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
	export function reject(reason: any): Promise<void>;
	export function reject<T>(reason:any):Promise<T>
	{
		return new Rejected(reason);
	}

	/**
	 * Takes any Promise-Like object and returns an extended version of it from this module.
	 * @param target
	 * @returns A new target that simply extends the target.
	 */
	export function wrap<T>(target:PromiseLike<T>):Promise<T>
	{
		return new PromiseWrapper(target);
	}

	/**
	 * A function that acts like a then method can be extended by providing a function that takes an onFulfill and onReject.
	 * @param then
	 * @returns {PromiseWrapper<T>}
	 */
	export function createFrom<T,TResult>(then:Then<T,TResult>):Promise<T>
	{
		return new PromiseWrapper({ then:then });
	}

	/**
	 * Provides a promise that can be resolved later.
	 * @returns {Pending<T>}
	 */
	export function pending<T>():Pending<T>
	{
		return new Pending<T>();
	}

}
