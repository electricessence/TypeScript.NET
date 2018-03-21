/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * See Readme.md for details.
 */

import {deferImmediate} from "../Threading/deferImmediate";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {ObjectPool} from "../Disposable/ObjectPool";
import {ObjectDisposedException} from "../Disposable/ObjectDisposedException";
import {Executor, Fulfill, Reject, Resolution, Resolver} from "./PromiseTypes";
import PromiseBase from "./PromiseBase";
import isPromise from "./Functions/isPromise";
import wrap from "./Functions/wrap";
import resolve from "./Functions/resolve";
import {PromiseStateValue} from "./PromiseState";


const VOID0:any     = void 0,
      NULL:any      = null,
      PROMISE       = "Promise",
      PROMISE_STATE = PROMISE + "PromiseStateValue",
      THEN          = "then",
      TARGET        = "target";


function resolveInternal<T>(
	value:Resolution<T>, resolver:Resolver,
	promiseFactory:(v:any) => PromiseBase<any>):PromiseBase<any>
{
	let nextValue = resolver
		? resolver(value)
		: value;

	return nextValue && isPromise(nextValue)
		? wrap(nextValue)
		: promiseFactory(nextValue);
}

function handleResolution(
	p:TSDNPromise<any> | null | undefined,
	value:Resolution<any>,
	resolver?:Resolver):any
{
	try
	{
		let v = resolver ? resolver(value) : value;
		if(p)
		{ //noinspection JSIgnoredPromiseFromCall
			p.resolve(v);
		}
		return null;
	}
	catch(ex)
	{
		if(p)
		{ //noinspection JSIgnoredPromiseFromCall
			p.reject(ex);
		}
		return ex;
	}
}

export function handleSyncIfPossible<T, TFulfilled = T, TRejected = never>(
	p:PromiseLike<T>,
	onFulfilled:Fulfill<T, TFulfilled>,
	onRejected?:Reject<TRejected>):PromiseLike<TFulfilled | TRejected>
{
	if(p instanceof PromiseBase)
		return p.thenSynchronous(onFulfilled, onRejected);
	else
		return p.then(onFulfilled, onRejected);
}

function newODE()
{
	return new ObjectDisposedException("TSDNPromise", "An underlying promise-result was disposed.");
}


export abstract class Resolvable<T>
	extends PromiseBase<T>
{

	doneNow(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>):void
	{
		this.throwIfDisposed();

		switch(this.state)
		{
			case PromiseStateValue.Fulfilled:
				if(onFulfilled) onFulfilled(this._result!);
				break;
			case PromiseStateValue.Rejected:
				if(onRejected) onRejected(this._error);
				break;
		}
	}

	thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:Fulfill<T, TFulfilled>,
		onRejected?:Reject<TRejected>):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		try
		{
			switch(this.state)
			{
				case PromiseStateValue.Fulfilled:
					return onFulfilled
						? resolveInternal(this._result, onFulfilled, resolve)
						: <any>this; // Provided for catch cases.
				case PromiseStateValue.Rejected:
					return onRejected
						? resolveInternal(this._error, onRejected, resolve)
						: <any>this;
			}
		}
		catch(ex)
		{
			return new Rejected<any>(ex);
		}

		throw new Error("Invalid state for a resolved promise.");
	}

	protected create<TResult>(
		resolver?:Executor<TResult>,
		forceSynchronous:boolean=false):PromiseBase<TResult>
	{
		return new TSDNPromise(resolver,forceSynchronous);
	}
}

/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export abstract class Resolved<T>
	extends Resolvable<T>
{
	constructor(state:PromiseStateValue, result:T, error?:any)
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
export class Fulfilled<T>
	extends Resolved<T>
{
	constructor(value:T)
	{
		super(PromiseStateValue.Fulfilled, value);
	}
}

/**
 * A rejected Resolved<T>.  Provided for readability.
 */
export class Rejected<T>
	extends Resolved<T>
{
	constructor(error:any)
	{
		super(PromiseStateValue.Rejected, <any>void(0), error);
	}
}



/**
 * This promise class that facilitates pending resolution.
 */
export class TSDNPromise<T>
	extends Resolvable<T>
{

	private _waiting:IPromiseCallbacks<any>[] | null | undefined;

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
		resolver?:Executor<T>, forceSynchronous:boolean = false)
	{
		super();

		if(resolver) this.resolveUsing(resolver, forceSynchronous);
	}

	thenSynchronous<TFulfilled = T, TRejected = never>(
		onFulfilled:Fulfill<T, TFulfilled>,
		onRejected?:Reject<TRejected>):PromiseBase<TFulfilled | TRejected>
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state) return super.thenSynchronous(onFulfilled, onRejected);

		const p = new TSDNPromise<TFulfilled | TRejected>();
		(this._waiting || (this._waiting = []))
			.push(Pool.init(onFulfilled, onRejected, p));
		return p;
	}

	doneNow(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>):void
	{
		this.throwIfDisposed();

		// Already fulfilled?
		if(this._state)
			return super.doneNow(onFulfilled, onRejected);

		(this._waiting || (this._waiting = []))
			.push(Pool.init(onFulfilled, onRejected));
	}

	protected _onDispose()
	{
		super._onDispose();
		this._resolvedCalled = VOID0;
	}

	// Protects against double calling.
	// @ts-ignore;
	protected _resolvedCalled:boolean;

	resolveUsing(
		resolver:Executor<T>,
		forceSynchronous:boolean = false):void
	{
		if(!resolver)
			throw new ArgumentNullException("resolver");
		if(this._resolvedCalled)
			throw new InvalidOperationException(".resolve() already called.");
		if(this.state)
			throw new InvalidOperationException("Already resolved: " + PromiseStateValue[this.state]);

		this._resolvedCalled = true;

		let state = 0;
		const rejectHandler = (reason:any) => {
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

		const fulfillHandler = (v:any) => {
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
			deferImmediate(() => resolver(fulfillHandler, rejectHandler));

	}


	private _emitDisposalRejection(p:PromiseBase<any>):boolean
	{
		const d = p.wasDisposed;
		if(d) this._rejectInternal(newODE());
		return d;
	}

	private _resolveInternal(result?:T | PromiseLike<T>):void
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
				case PromiseStateValue.Pending:
					r.doneNow(
						v => this._resolveInternal(v),
						e => this._rejectInternal(e)
					);
					return;
				case PromiseStateValue.Rejected:
					this._rejectInternal(r.error);
					return;
				case PromiseStateValue.Fulfilled:
					result = r.result;
					break;
			}
		}

		if(isPromise(result))
		{
			result.then(
				v => this._resolveInternal(v),
				e => this._rejectInternal(e)
			);
		}
		else
		{
			this._state = PromiseStateValue.Fulfilled;

			this._result = result;
			this._error = VOID0;
			const o = this._waiting;
			if(o)
			{
				this._waiting = VOID0;
				for(let c of o)
				{
					let {onFulfilled, promise} = c;
					Pool.recycle(c);
					//let ex =
					handleResolution(<any>promise, result, onFulfilled);
					//if(!p && ex) console.error("Unhandled exception in onFulfilled:",ex);
				}
				o.length = 0;
			}
		}
	}

	private _rejectInternal(error:any):void
	{

		if(this.wasDisposed) return;

		this._state = PromiseStateValue.Rejected;

		this._error = error;
		const o = this._waiting;
		if(o)
		{
			this._waiting = null; // null = finished. undefined = hasn't started.
			for(let c of o)
			{
				let {onRejected, promise} = c;
				Pool.recycle(c);
				if(onRejected)
				{
					//let ex =
					handleResolution(promise, error, onRejected);
					//if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
				}
				else if(promise)
				{ //noinspection JSIgnoredPromiseFromCall
					promise.reject(error);
				}
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
			if(!throwIfSettled || this._state==PromiseStateValue.Fulfilled && this._result===result) return;
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
			if(!throwIfSettled || this._state==PromiseStateValue.Rejected && this._error===error) return;
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


module Pool
{

	let pool:ObjectPool<IPromiseCallbacks<any>>;

	//noinspection JSUnusedLocalSymbols
	function getPool()
	{
		return pool
			|| (pool = new ObjectPool<IPromiseCallbacks<any>>(40, factory, c => {
				c.onFulfilled = NULL;
				c.onRejected = NULL;
				c.promise = NULL;
			}));
	}

	function factory():IPromiseCallbacks<any>
	{
		return {
			onFulfilled: NULL,
			onRejected: NULL,
			promise: NULL
		}
	}

	export function init<T>(
		onFulfilled:Fulfill<T, any>,
		onRejected?:Reject<any>,
		promise?:TSDNPromise<any>):IPromiseCallbacks<T>
	{

		const c = getPool().take();
		c.onFulfilled = onFulfilled || undefined;
		c.onRejected = onRejected || undefined;
		c.promise = promise;
		return c;
	}

	export function recycle<T>(c:IPromiseCallbacks<T>):void
	{
		getPool().add(c);
	}
}


interface IPromiseCallbacks<T>
{
	onFulfilled?:Fulfill<T, any>;
	onRejected?:Reject<any>;
	promise?:TSDNPromise<any>;
}

export {TSDNPromise as Promise};

export default TSDNPromise;


